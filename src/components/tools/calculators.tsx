"use client";

import { useState, type ReactNode } from "react";
import {
  useForm,
  useWatch,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import { SelectField, TextField } from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import {
  ACCOUNT_CURRENCY,
  CALCULATOR_PAIRS,
  marginRequired,
  pipValue,
  positionSize,
  profitLoss,
  type CalculatorPair,
} from "@/lib/forex/calculators";
import { getInstrument } from "@/lib/forex/instruments";
import { zodResolver } from "@/lib/zod-resolver";

/* ------------------------------------------------------------------------------------------ */
/* Shared pieces                                                                              */
/* ------------------------------------------------------------------------------------------ */

const PAIR_OPTIONS = CALCULATOR_PAIRS.map((p) => ({ value: p, label: p }));
const pairSchema = z.enum(CALCULATOR_PAIRS, { error: "Choose a currency pair" });

function num(label: string) {
  return z.number({ error: `Enter ${label}` });
}

const priceSchema = num("a price")
  .positive("Price must be greater than 0")
  .max(100_000, "Too large");
const lotsSchema = num("a size in lots")
  .min(0.01, "Minimum is 0.01 lots")
  .max(100, "Maximum is 100 lots in this demo");

function referencePrice(pair: string): number {
  return getInstrument(pair)?.basePrice ?? 1;
}

function priceStep(pair: string) {
  return pair.endsWith("/JPY") ? "0.001" : "0.00001";
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: ACCOUNT_CURRENCY });
const fmtUsd = (v: number) => usd.format(v);

interface CalculatorCardProps {
  id: string;
  title: string;
  intro: string;
  formula: ReactNode;
  assumptions: string[];
  children: ReactNode;
}

function CalculatorCard({ id, title, intro, formula, assumptions, children }: CalculatorCardProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-24 rounded-2xl border bg-card text-card-foreground shadow-xs"
    >
      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        <div className="p-5 sm:p-7">
          <h2 id={`${id}-title`} className="text-2xl font-semibold">
            {title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{intro}</p>
          <div className="mt-6">{children}</div>
        </div>
        <aside
          aria-label={`${title}: formula and assumptions`}
          className="rounded-b-2xl border-t bg-muted/50 p-5 text-sm sm:p-7 lg:rounded-r-2xl lg:rounded-bl-none lg:border-t-0 lg:border-l"
        >
          <h3 className="font-sans text-sm font-semibold">Formula</h3>
          <div className="mt-2 rounded-lg border bg-background p-3 font-mono text-xs leading-relaxed">
            {formula}
          </div>
          <h3 className="mt-5 font-sans text-sm font-semibold">Assumptions</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-muted-foreground">
            {assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

function Results({ items, error }: { items: [string, string][] | null; error?: string }) {
  return (
    <div
      aria-live="polite"
      className="mt-6 rounded-xl border border-brand/40 bg-brand/10 p-4"
      data-testid="calculator-result"
    >
      {items ? (
        <dl className="grid grid-cols-2 gap-4">
          {items.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="tabular font-mono text-lg font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm">{error ?? "Enter values and select Calculate."}</p>
      )}
    </div>
  );
}

/** When the pair changes, refill price fields with that pair's illustrative reference price. */
function pairChangeHandler<T extends FieldValues>(form: UseFormReturn<T>, priceFields: Path<T>[]) {
  return (pair: string) => {
    for (const field of priceFields) {
      form.setValue(field, referencePrice(pair) as T[Path<T>], { shouldValidate: true });
    }
  };
}

const COMMON_ASSUMPTIONS = [
  `Account currency is ${ACCOUNT_CURRENCY}.`,
  "1 standard lot = 100,000 units of the base currency.",
  "A pip is 0.0001, or 0.01 for JPY-quoted pairs.",
  "Cross pairs convert to USD with fixed illustrative rates, not live data.",
];

/* ------------------------------------------------------------------------------------------ */
/* Position size                                                                              */
/* ------------------------------------------------------------------------------------------ */

const positionSchema = z.object({
  balance: num("an account balance")
    .min(0, "Balance cannot be negative")
    .max(100_000_000, "Too large for this demo"),
  riskPercent: num("a risk percentage")
    .gt(0, "Risk must be more than 0%")
    .max(100, "Risk cannot exceed 100%"),
  stopLossPips: num("a stop-loss distance")
    .gt(0, "Stop-loss must be more than 0 pips")
    .max(10_000, "Too large"),
  pair: pairSchema,
  price: priceSchema,
});
type PositionValues = z.infer<typeof positionSchema>;

function computePosition(v: PositionValues): [string, string][] | null {
  const r = positionSize(v);
  if (!r) return null;
  return [
    ["Amount at risk", fmtUsd(r.riskAmount)],
    ["Position size", `${r.lots.toFixed(2)} lots`],
    ["Units", r.units.toLocaleString("en-US")],
    ["Pip value", fmtUsd(r.pipValue)],
  ];
}

export function PositionSizeCalculator() {
  const defaults: PositionValues = {
    balance: 10_000,
    riskPercent: 1,
    stopLossPips: 25,
    pair: "EUR/USD",
    price: referencePrice("EUR/USD"),
  };
  const form = useForm<PositionValues>({
    resolver: zodResolver(positionSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });
  const [result, setResult] = useState(() => computePosition(defaults));
  const { errors } = form.formState;
  const onPair = pairChangeHandler(form, ["price"]);
  const pair = useWatch({ control: form.control, name: "pair" });

  return (
    <CalculatorCard
      id="position-size"
      title="Position size"
      intro="Work out a position size from how much of your balance you are prepared to risk and where your stop-loss sits."
      formula={
        <>
          risk amount = balance × risk % ÷ 100
          <br />
          lots = risk amount ÷ (stop-loss pips × pip value per lot)
        </>
      }
      assumptions={[
        ...COMMON_ASSUMPTIONS,
        "Lots are rounded down to 0.01 so the planned risk is not exceeded.",
        "Ignores spread, commission and slippage.",
      ]}
    >
      <form
        noValidate
        onSubmit={form.handleSubmit((v) => setResult(computePosition(v)))}
        className="grid gap-4 sm:grid-cols-2"
      >
        <TextField
          id="ps-balance"
          label="Account balance"
          suffix="USD"
          type="number"
          inputMode="decimal"
          step="any"
          error={errors.balance?.message}
          {...form.register("balance", { valueAsNumber: true })}
        />
        <TextField
          id="ps-risk"
          label="Risk per trade"
          suffix="%"
          type="number"
          inputMode="decimal"
          step="any"
          error={errors.riskPercent?.message}
          {...form.register("riskPercent", { valueAsNumber: true })}
        />
        <TextField
          id="ps-stop"
          label="Stop-loss distance"
          suffix="pips"
          type="number"
          inputMode="decimal"
          step="any"
          error={errors.stopLossPips?.message}
          {...form.register("stopLossPips", { valueAsNumber: true })}
        />
        <SelectField
          id="ps-pair"
          label="Currency pair"
          options={PAIR_OPTIONS}
          error={errors.pair?.message}
          {...form.register("pair", { onChange: (e) => onPair(e.target.value) })}
        />
        <TextField
          id="ps-price"
          label="Current price"
          type="number"
          inputMode="decimal"
          step={priceStep(pair)}
          hint="Prefilled with an illustrative reference price. Used for USD conversion."
          error={errors.price?.message}
          className="sm:col-span-2"
          {...form.register("price", { valueAsNumber: true })}
        />
        <Button type="submit" size="lg" className="sm:col-span-2 sm:justify-self-start">
          Calculate position size
        </Button>
      </form>
      <Results items={result} />
    </CalculatorCard>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* Pip value                                                                                  */
/* ------------------------------------------------------------------------------------------ */

const pipSchema = z.object({ pair: pairSchema, lots: lotsSchema, price: priceSchema });
type PipValues = z.infer<typeof pipSchema>;

function computePip(v: PipValues): [string, string][] | null {
  const value = pipValue(v);
  const perLot = pipValue({ ...v, lots: 1 });
  if (value === null || perLot === null) return null;
  return [
    ["Value of 1 pip", fmtUsd(value)],
    ["Per standard lot", fmtUsd(perLot)],
  ];
}

export function PipValueCalculator() {
  const defaults: PipValues = { pair: "USD/JPY", lots: 1, price: referencePrice("USD/JPY") };
  const form = useForm<PipValues>({
    resolver: zodResolver(pipSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });
  const [result, setResult] = useState(() => computePip(defaults));
  const { errors } = form.formState;
  const onPair = pairChangeHandler(form, ["price"]);
  const pair = useWatch({ control: form.control, name: "pair" });

  return (
    <CalculatorCard
      id="pip-value"
      title="Pip value"
      intro="See what a one-pip move is worth in US dollars for a given pair and position size."
      formula={
        <>
          pip value = pip size × lots × 100,000 × USD per quote unit
          <br />
          USD-quoted: × 1 · USD-base: ÷ price
        </>
      }
      assumptions={COMMON_ASSUMPTIONS}
    >
      <form
        noValidate
        onSubmit={form.handleSubmit((v) => setResult(computePip(v)))}
        className="grid gap-4 sm:grid-cols-3"
      >
        <SelectField
          id="pv-pair"
          label="Currency pair"
          options={PAIR_OPTIONS}
          error={errors.pair?.message}
          {...form.register("pair", { onChange: (e) => onPair(e.target.value) })}
        />
        <TextField
          id="pv-lots"
          label="Position size"
          suffix="lots"
          type="number"
          inputMode="decimal"
          step="0.01"
          error={errors.lots?.message}
          {...form.register("lots", { valueAsNumber: true })}
        />
        <TextField
          id="pv-price"
          label="Current price"
          type="number"
          inputMode="decimal"
          step={priceStep(pair)}
          error={errors.price?.message}
          {...form.register("price", { valueAsNumber: true })}
        />
        <Button type="submit" size="lg" className="sm:col-span-3 sm:justify-self-start">
          Calculate pip value
        </Button>
      </form>
      <Results items={result} />
    </CalculatorCard>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* Margin                                                                                     */
/* ------------------------------------------------------------------------------------------ */

const LEVERAGE_OPTIONS = [1, 5, 10, 20, 30, 50, 100].map((l) => ({
  value: String(l),
  label: `1:${l}`,
}));

const marginSchema = z.object({
  pair: pairSchema,
  lots: lotsSchema,
  price: priceSchema,
  leverage: z.enum(LEVERAGE_OPTIONS.map((o) => o.value) as [string, ...string[]], {
    error: "Choose a leverage ratio",
  }),
});
type MarginValues = z.infer<typeof marginSchema>;

function computeMargin(v: MarginValues): [string, string][] | null {
  const r = marginRequired({ ...v, leverage: Number(v.leverage) });
  if (!r) return null;
  return [
    ["Margin required", fmtUsd(r.margin)],
    ["Notional value", fmtUsd(r.notional)],
  ];
}

export function MarginCalculator() {
  const defaults: MarginValues = {
    pair: "EUR/USD",
    lots: 1,
    price: referencePrice("EUR/USD"),
    leverage: "30",
  };
  const form = useForm<MarginValues>({
    resolver: zodResolver(marginSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });
  const [result, setResult] = useState(() => computeMargin(defaults));
  const { errors } = form.formState;
  const onPair = pairChangeHandler(form, ["price"]);
  const pair = useWatch({ control: form.control, name: "pair" });

  return (
    <CalculatorCard
      id="margin"
      title="Margin required"
      intro="Estimate the margin a leveraged position would lock up. Leverage ratios here are illustrative."
      formula={
        <>
          notional = lots × 100,000 × USD per base unit
          <br />
          margin = notional ÷ leverage
        </>
      }
      assumptions={[
        ...COMMON_ASSUMPTIONS,
        "Leverage options are examples only; real limits depend on the provider and jurisdiction.",
      ]}
    >
      <form
        noValidate
        onSubmit={form.handleSubmit((v) => setResult(computeMargin(v)))}
        className="grid gap-4 sm:grid-cols-2"
      >
        <SelectField
          id="mg-pair"
          label="Currency pair"
          options={PAIR_OPTIONS}
          error={errors.pair?.message}
          {...form.register("pair", { onChange: (e) => onPair(e.target.value) })}
        />
        <SelectField
          id="mg-leverage"
          label="Leverage (illustrative)"
          options={LEVERAGE_OPTIONS}
          error={errors.leverage?.message}
          {...form.register("leverage")}
        />
        <TextField
          id="mg-lots"
          label="Position size"
          suffix="lots"
          type="number"
          inputMode="decimal"
          step="0.01"
          error={errors.lots?.message}
          {...form.register("lots", { valueAsNumber: true })}
        />
        <TextField
          id="mg-price"
          label="Current price"
          type="number"
          inputMode="decimal"
          step={priceStep(pair)}
          error={errors.price?.message}
          {...form.register("price", { valueAsNumber: true })}
        />
        <Button type="submit" size="lg" className="sm:col-span-2 sm:justify-self-start">
          Calculate margin
        </Button>
      </form>
      <Results items={result} />
    </CalculatorCard>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* Profit / loss                                                                              */
/* ------------------------------------------------------------------------------------------ */

const plSchema = z.object({
  pair: pairSchema,
  direction: z.enum(["buy", "sell"], { error: "Choose buy or sell" }),
  entry: priceSchema,
  exit: priceSchema,
  lots: lotsSchema,
});
type PlValues = z.infer<typeof plSchema>;

function computePl(v: PlValues): [string, string][] | null {
  const r = profitLoss(v);
  if (!r) return null;
  const sign = r.profit > 0 ? "+" : "";
  return [
    ["Result", `${sign}${fmtUsd(r.profit)}`],
    ["Movement", `${r.pips > 0 ? "+" : ""}${r.pips.toFixed(1)} pips`],
  ];
}

export function ProfitLossCalculator() {
  const ref = referencePrice("GBP/USD");
  const defaults: PlValues = {
    pair: "GBP/USD" satisfies CalculatorPair,
    direction: "buy",
    entry: ref,
    exit: Math.round((ref + 0.005) * 1e5) / 1e5,
    lots: 0.5,
  };
  const form = useForm<PlValues>({
    resolver: zodResolver(plSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });
  const [result, setResult] = useState(() => computePl(defaults));
  const { errors } = form.formState;
  const onPair = pairChangeHandler(form, ["entry", "exit"]);
  const pair = useWatch({ control: form.control, name: "pair" });

  return (
    <CalculatorCard
      id="profit-loss"
      title="Profit and loss"
      intro="Calculate the result of a hypothetical trade between an entry and an exit price."
      formula={
        <>
          move = (exit − entry) × (+1 buy, −1 sell)
          <br />
          pips = move ÷ pip size
          <br />
          P/L = move × lots × 100,000 × USD per quote unit
        </>
      }
      assumptions={[
        ...COMMON_ASSUMPTIONS,
        "Quote-currency results convert to USD at the exit price.",
        "Ignores spread, commission, swaps and slippage.",
      ]}
    >
      <form
        noValidate
        onSubmit={form.handleSubmit((v) => setResult(computePl(v)))}
        className="grid gap-4 sm:grid-cols-2"
      >
        <SelectField
          id="pl-pair"
          label="Currency pair"
          options={PAIR_OPTIONS}
          error={errors.pair?.message}
          {...form.register("pair", { onChange: (e) => onPair(e.target.value) })}
        />
        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1.5 text-sm font-medium">Direction</legend>
          <div className="grid h-11 grid-cols-2 gap-1 rounded-lg bg-muted p-1">
            {(["buy", "sell"] as const).map((d) => (
              <label
                key={d}
                className="flex cursor-pointer items-center justify-center rounded-md text-sm font-medium capitalize has-checked:bg-background has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-ring"
              >
                <input type="radio" value={d} className="sr-only" {...form.register("direction")} />
                {d}
              </label>
            ))}
          </div>
          {errors.direction && (
            <p className="text-xs font-medium text-destructive">{errors.direction.message}</p>
          )}
        </fieldset>
        <TextField
          id="pl-entry"
          label="Entry price"
          type="number"
          inputMode="decimal"
          step={priceStep(pair)}
          error={errors.entry?.message}
          {...form.register("entry", { valueAsNumber: true })}
        />
        <TextField
          id="pl-exit"
          label="Exit price"
          type="number"
          inputMode="decimal"
          step={priceStep(pair)}
          error={errors.exit?.message}
          {...form.register("exit", { valueAsNumber: true })}
        />
        <TextField
          id="pl-lots"
          label="Position size"
          suffix="lots"
          type="number"
          inputMode="decimal"
          step="0.01"
          error={errors.lots?.message}
          {...form.register("lots", { valueAsNumber: true })}
        />
        <Button type="submit" size="lg" className="self-end sm:justify-self-start">
          Calculate P/L
        </Button>
      </form>
      <Results items={result} />
    </CalculatorCard>
  );
}
