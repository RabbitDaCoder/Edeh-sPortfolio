import { contactRepository } from "./contact.repository";
import { mailService } from "../../services/mail.service";
import { CreateContactInput } from "./contact.schema";

export class ContactService {
  async submitContact(data: CreateContactInput) {
    // Compose a rich message for DB storage that includes proposal details
    const parts: string[] = [];
    if (data.projectType) parts.push(`Project Type: ${data.projectType}`);
    if (data.company) parts.push(`Company: ${data.company}`);
    if (data.budget) parts.push(`Budget: ${data.budget}`);
    if (data.timeline) parts.push(`Timeline: ${data.timeline}`);
    parts.push("", data.message);

    const storedMessage = parts.length > 1 ? parts.join("\n") : data.message;
    const subject =
      data.subject || data.projectType || "Contact Form Submission";

    const contact = await contactRepository.create({
      name: data.name,
      email: data.email,
      subject,
      message: storedMessage,
    });

    await mailService
      .sendProposalEmail({
        name: data.name,
        email: data.email,
        company: data.company,
        projectType: data.projectType,
        budget: data.budget,
        timeline: data.timeline,
        message: data.message,
      })
      .catch(() => {});

    return contact;
  }

  async getMessages() {
    return contactRepository.findAll();
  }

  async markAsRead(id: string) {
    return contactRepository.markAsRead(id);
  }

  async deleteMessage(id: string) {
    return contactRepository.delete(id);
  }
}

export const contactService = new ContactService();
