"use client";

import { CircleCheckBigIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@/lib/zod-resolver";
import { FieldShell, SelectField, TextField } from "./fields";

const TOPICS = [
  { value: "", label: "Choose a topic" },
  { value: "accounts", label: "Demo accounts" },
  { value: "platforms", label: "Platforms" },
  { value: "tools", label: "Calculators" },
  { value: "other", label: "Something else" },
];

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name (at least 2 characters)").max(80, "Too long"),
  email: z.email({ error: "Enter a valid email address, like name@example.com" }),
  topic: z.string().min(1, "Choose a topic"),
  message: z
    .string()
    .trim()
    .min(20, "Write at least 20 characters")
    .max(1000, "Keep it under 1,000 characters"),
});
type Values = z.infer<typeof schema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", topic: "", message: "" },
  });
  const { errors } = form.formState;

  useEffect(() => {
    if (sent) statusRef.current?.focus();
  }, [sent]);

  if (sent) {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border bg-card p-8 text-center outline-none"
      >
        <CircleCheckBigIcon aria-hidden className="mx-auto size-10 text-positive" />
        <h2 className="mt-4 text-xl font-semibold">Thanks! (Demo only)</h2>
        <p className="mt-2 text-muted-foreground">
          Your message passed validation, but this is a demo: nothing was sent or stored.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          size="lg"
          onClick={() => {
            form.reset();
            setSent(false);
          }}
        >
          Write another message
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(() => setSent(true))}
      aria-label="Demo contact form"
      className="grid gap-5 rounded-2xl border bg-card p-5 text-card-foreground sm:grid-cols-2 sm:p-8"
    >
      <TextField
        id="contact-name"
        label="Name"
        autoComplete="name"
        error={errors.name?.message}
        {...form.register("name")}
      />
      <TextField
        id="contact-email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...form.register("email")}
      />
      <SelectField
        id="contact-topic"
        label="Topic"
        options={TOPICS}
        error={errors.topic?.message}
        className="sm:col-span-2"
        {...form.register("topic")}
      />
      <FieldShell
        id="contact-message"
        label="Message"
        error={errors.message?.message}
        hint="20 to 1,000 characters."
        className="sm:col-span-2"
      >
        {(describedBy) => (
          <textarea
            id="contact-message"
            rows={5}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive md:text-sm dark:bg-input/30"
            {...form.register("message")}
          />
        )}
      </FieldShell>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
        <Button type="submit" size="lg">
          Send (demo)
        </Button>
        <p className="text-xs text-muted-foreground">Nothing is sent. This form only validates.</p>
      </div>
    </form>
  );
}
