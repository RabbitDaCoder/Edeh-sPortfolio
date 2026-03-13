import { db } from "../../config/db";
import { CreateContactInput } from "./contact.schema";

export class ContactRepository {
  async create(data: CreateContactInput) {
    return db.contactMessage.create({ data });
  }

  async findAll() {
    return db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  async markAsRead(id: string) {
    return db.contactMessage.update({
      where: { id },
      data: { read: true },
    });
  }

  async delete(id: string) {
    return db.contactMessage.delete({ where: { id } });
  }
}

export const contactRepository = new ContactRepository();
