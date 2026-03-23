interface ContactPayload {
    name: string;
    email: string;
    subject?: string;
    message: string;
}
export declare function useContactForm(): import("@tanstack/react-query").UseMutationResult<any, Error, ContactPayload, unknown>;
export {};
//# sourceMappingURL=useContact.d.ts.map