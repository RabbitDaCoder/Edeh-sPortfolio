import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { useCreateGuestbookEntry } from "../hooks/useGuestbook";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email"),
  message: z
    .string()
    .min(1, "Say something!")
    .max(280, "Keep it under 280 characters"),
  handle: z.string().max(80).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const GuestbookForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const createEntry = useCreateGuestbookEntry();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", message: "", handle: "" },
  });

  const messageLength = watch("message")?.length || 0;

  const onSubmit = (values: FormValues) => {
    const payload = {
      ...values,
      handle: values.handle || undefined,
    };
    createEntry.mutate(payload, {
      onSuccess: () => {
        reset();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
      },
    });
  };

  return (
    <div className="relative rounded-lg border border-border bg-surface/50 p-6">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <CheckCircle2
              size={32}
              strokeWidth={1.5}
              className="text-green-500 mb-3"
            />
            <p className="text-sm font-medium text-text-primary">
              Thank you for signing!
            </p>
            <p className="text-xs text-text-muted mt-1">
              Your message is awaiting approval. It will appear soon.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  {...register("name")}
                  placeholder="Your name *"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email (private) *"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <input
                {...register("handle")}
                placeholder="@handle (optional)"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <textarea
                {...register("message")}
                rows={3}
                placeholder="Leave a message..."
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent resize-none"
              />
              <div className="flex items-center justify-between mt-1">
                {errors.message ? (
                  <p className="text-xs text-red-500">
                    {errors.message.message}
                  </p>
                ) : (
                  <span />
                )}
                <span
                  className={`text-xs ${messageLength > 280 ? "text-red-500" : "text-text-muted"}`}
                >
                  {messageLength}/280
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={createEntry.isPending}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Send size={14} strokeWidth={1.5} />
              {createEntry.isPending ? "Signing..." : "Sign Guestbook"}
            </button>

            {createEntry.isError && (
              <p className="text-xs text-red-500">
                Something went wrong. Please try again.
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};
