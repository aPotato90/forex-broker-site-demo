import { describe, expect, it } from "vitest";
import { z } from "zod";
import { zodResolver } from "./zod-resolver";

const schema = z.object({
  name: z.string().min(2, "Too short"),
  amount: z.number({ error: "Enter a number" }).positive("Must be positive"),
});

const options = { fields: {}, shouldUseNativeValidation: false } as const;

describe("zodResolver", () => {
  it("returns values when valid", async () => {
    const result = await zodResolver(schema)({ name: "Ada", amount: 5 }, undefined, options);
    expect(result).toEqual({ values: { name: "Ada", amount: 5 }, errors: {} });
  });

  it("maps the first issue per field to an error", async () => {
    const result = await zodResolver(schema)({ name: "A", amount: Number.NaN }, undefined, options);
    expect(result.values).toEqual({});
    expect(result.errors).toEqual({
      name: { type: "too_small", message: "Too short" },
      amount: { type: "invalid_type", message: "Enter a number" },
    });
  });
});
