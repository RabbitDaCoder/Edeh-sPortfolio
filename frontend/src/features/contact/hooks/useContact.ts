import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";

interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export function useContactForm() {
  return useMutation({
    mutationFn: async (payload: ContactPayload) => {
      const { data } = await apiClient.post("/contact", payload);
      return data.data;
    },
  });
}
