import type { FieldErrors, FieldValues, Resolver } from "react-hook-form";
import type { z } from "zod";

/**
 * Minimal React Hook Form resolver for Zod 4 schemas with flat (non-nested) fields, which is all
 * this site's forms use. Avoids pulling in @hookform/resolvers and its optional peer tree.
 */
export function zodResolver<T extends FieldValues>(schema: z.ZodType<T, T>): Resolver<T> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);
    if (result.success) return { values: result.data, errors: {} };
    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of result.error.issues) {
      const name = issue.path.join(".");
      if (name && !errors[name]) errors[name] = { type: issue.code, message: issue.message };
    }
    return { values: {}, errors: errors as FieldErrors<T> };
  };
}
