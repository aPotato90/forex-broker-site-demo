"use client";

import { CheckIcon, CircleCheckBigIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, type UseFormRegister } from "react-hook-form";
import { z } from "zod";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { ACCOUNT_TIERS } from "@/data/accounts";
import { zodResolver } from "@/lib/zod-resolver";
import { FieldShell, SelectField, TextField } from "./fields";

const COUNTRIES = [
  "Select a country",
  "Australia",
  "Canada",
  "Germany",
  "Ghana",
  "India",
  "Ireland",
  "Kenya",
  "Nigeria",
  "Singapore",
  "South Africa",
  "United Kingdom",
  "United States",
  "Other",
];

const EXPERIENCE = [
  { value: "none", label: "New to trading" },
  { value: "some", label: "Some experience" },
  { value: "experienced", label: "Experienced" },
] as const;

const schema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Enter your first name")
    .max(60, "Use 60 characters or fewer"),
  lastName: z.string().trim().min(1, "Enter your last name").max(60, "Use 60 characters or fewer"),
  email: z.email({ error: "Enter a valid email address, like name@example.com" }),
  country: z
    .string()
    .refine((v) => v !== COUNTRIES[0] && COUNTRIES.includes(v), "Select a country"),
  experience: z.enum(["none", "some", "experienced"], { error: "Choose your experience level" }),
  accountType: z.enum(["standard", "pro", "institutional"], { error: "Choose an account type" }),
  baseCurrency: z.enum(["USD", "EUR", "GBP"], { error: "Choose a base currency" }),
  virtualBalance: z.enum(["1000", "10000", "50000"], { error: "Choose a virtual balance" }),
  acknowledge: z.literal(true, { error: "Please confirm you understand this is a demo" }),
});

type Values = z.infer<typeof schema>;
type FormInput = Omit<Values, "acknowledge"> & { acknowledge: boolean };

const STEPS = [
  { title: "Your details", fields: ["firstName", "lastName", "email", "country"] },
  { title: "Preferences", fields: ["experience", "accountType", "baseCurrency", "virtualBalance"] },
  { title: "Review", fields: ["acknowledge"] },
] as const satisfies readonly { title: string; fields: readonly (keyof Values)[] }[];

function RadioCards({
  name,
  legend,
  options,
  error,
  register,
}: {
  name: keyof Values;
  legend: string;
  options: readonly { value: string; label: string; description?: string }[];
  error?: string;
  register: (name: keyof FormInput) => ReturnType<UseFormRegister<FormInput>>;
}) {
  const errorId = `${name}-error`;
  return (
    <fieldset aria-describedby={error ? errorId : undefined} className="space-y-2">
      <legend className="mb-2 text-sm font-medium">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((o) => (
          <label
            key={o.value}
            className="relative flex cursor-pointer flex-col rounded-xl border bg-background p-3.5 text-sm transition-colors hover:bg-muted has-checked:border-brand has-checked:bg-brand/10 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring"
          >
            <input type="radio" value={o.value} className="sr-only" {...register(name)} />
            <span className="font-medium">{o.label}</span>
            {o.description && (
              <span className="mt-1 text-xs text-muted-foreground">{o.description}</span>
            )}
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function OpenAccountForm() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const form = useForm<FormInput>({
    resolver: zodResolver(schema as unknown as z.ZodType<FormInput, FormInput>),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      country: COUNTRIES[0],
      baseCurrency: "USD",
      virtualBalance: "10000",
      acknowledge: false,
    },
  });
  const { errors } = form.formState;

  // Steps are validated with trigger() rather than submit, so RHF's post-submit re-validation
  // never kicks in. Re-check a field on change once it shows an error, so it clears when fixed.
  const field = (name: keyof FormInput) =>
    form.register(name, {
      onChange: () => {
        if (form.getFieldState(name).error) void form.trigger(name);
      },
    });

  // Move focus to the new step's heading so keyboard and screen reader users keep their place.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    (done ? doneRef.current : headingRef.current)?.focus();
  }, [step, done]);

  async function next() {
    const valid = await form.trigger([...STEPS[step].fields], { shouldFocus: true });
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function restart() {
    form.reset();
    setDone(false);
    setStep(0);
  }

  if (done) {
    return (
      <div
        ref={doneRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border bg-card p-8 text-center shadow-sm outline-none sm:p-12"
      >
        <CircleCheckBigIcon aria-hidden className="mx-auto size-12 text-positive" />
        <h2 className="mt-4 text-2xl font-semibold">
          This is a demo. Nothing was submitted or stored.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Your answers only ever existed in this browser tab and have now been discarded. No account
          was created, because Valtrex Markets does not exist.
        </p>
        <Button type="button" size="lg" variant="outline" className="mt-8" onClick={restart}>
          Start again
        </Button>
      </div>
    );
  }

  const values = form.getValues();
  const tierName = ACCOUNT_TIERS.find((t) => t.id === values.accountType)?.name ?? "—";
  const experienceLabel = EXPERIENCE.find((e) => e.value === values.experience)?.label ?? "—";

  return (
    <div className="rounded-2xl border bg-card text-card-foreground shadow-sm">
      <ol className="grid grid-cols-3 border-b text-xs font-medium sm:text-sm">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            aria-current={i === step ? "step" : undefined}
            className={cn(
              "flex items-center gap-2 border-b-2 px-3 py-4 sm:px-5",
              i === step
                ? "border-brand text-foreground"
                : "border-transparent text-muted-foreground",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs",
                i < step
                  ? "bg-positive text-white dark:text-navy"
                  : i === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted",
              )}
            >
              {i < step ? <CheckIcon className="size-3.5" /> : i + 1}
            </span>
            <span>
              <span className="sr-only">
                Step {i + 1} of {STEPS.length}
                {i < step ? " (completed)" : ""}:{" "}
              </span>
              {s.title}
            </span>
          </li>
        ))}
      </ol>

      <form
        noValidate
        onSubmit={form.handleSubmit(() => setDone(true))}
        className="p-5 sm:p-8"
        aria-labelledby="step-heading"
      >
        <h2
          id="step-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-xl font-semibold outline-none"
        >
          {STEPS[step].title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Step {step + 1} of {STEPS.length}. Nothing you enter leaves this page.
        </p>

        <div className="mt-6">
          {step === 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                id="firstName"
                label="First name"
                autoComplete="given-name"
                error={errors.firstName?.message}
                {...field("firstName")}
              />
              <TextField
                id="lastName"
                label="Last name"
                autoComplete="family-name"
                error={errors.lastName?.message}
                {...field("lastName")}
              />
              <TextField
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                hint="Use any address; it is never sent anywhere."
                error={errors.email?.message}
                {...field("email")}
              />
              <SelectField
                id="country"
                label="Country of residence"
                options={COUNTRIES.map((c) => ({ value: c, label: c }))}
                error={errors.country?.message}
                {...field("country")}
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <RadioCards
                name="experience"
                legend="Trading experience"
                options={EXPERIENCE}
                error={errors.experience?.message}
                register={field}
              />
              <RadioCards
                name="accountType"
                legend="Account type (illustrative)"
                options={ACCOUNT_TIERS.map((t) => ({
                  value: t.id,
                  label: t.name,
                  description: `Spreads from ${t.spreadFrom} (example)`,
                }))}
                error={errors.accountType?.message}
                register={field}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField
                  id="baseCurrency"
                  label="Base currency"
                  options={["USD", "EUR", "GBP"].map((c) => ({ value: c, label: c }))}
                  error={errors.baseCurrency?.message}
                  {...field("baseCurrency")}
                />
                <SelectField
                  id="virtualBalance"
                  label="Virtual balance"
                  hint="Play money for the imaginary demo account."
                  options={[
                    { value: "1000", label: "1,000" },
                    { value: "10000", label: "10,000" },
                    { value: "50000", label: "50,000" },
                  ]}
                  error={errors.virtualBalance?.message}
                  {...field("virtualBalance")}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <dl className="grid gap-x-6 gap-y-4 rounded-xl border bg-muted/40 p-5 text-sm sm:grid-cols-2">
                {[
                  ["Name", `${values.firstName} ${values.lastName}`],
                  ["Email", values.email],
                  ["Country", values.country],
                  ["Experience", experienceLabel],
                  ["Account type", tierName],
                  ["Base currency", values.baseCurrency],
                  [
                    "Virtual balance",
                    `${Number(values.virtualBalance).toLocaleString("en-US")} ${values.baseCurrency}`,
                  ],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="mt-0.5 font-medium break-words">{v}</dd>
                  </div>
                ))}
              </dl>
              <FieldShell id="acknowledge" error={errors.acknowledge?.message}>
                {(describedBy) => (
                  <label
                    htmlFor="acknowledge"
                    className="flex cursor-pointer items-start gap-3 text-sm"
                  >
                    <input
                      id="acknowledge"
                      type="checkbox"
                      aria-invalid={errors.acknowledge ? true : undefined}
                      aria-describedby={describedBy}
                      className="mt-0.5 size-5 shrink-0 accent-[var(--brand)]"
                      {...field("acknowledge")}
                    />
                    I understand this is a demo website: no account will be created and nothing I
                    entered will be submitted or stored.
                  </label>
                )}
              </FieldShell>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
          {step > 0 ? (
            <Button type="button" variant="outline" size="lg" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <Button key="continue" type="button" size="lg" onClick={next}>
              Continue
            </Button>
          ) : (
            <Button key="finish" type="submit" size="lg">
              Finish demo sign-up
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
