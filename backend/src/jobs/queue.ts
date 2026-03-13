export interface MailJobData {
  type: "contact" | "welcome";
  name?: string;
  email: string;
  subject?: string;
  message?: string;
}
