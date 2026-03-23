import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
export function useContactForm() {
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await apiClient.post("/contact", payload);
            return data.data;
        },
    });
}
//# sourceMappingURL=useContact.js.map