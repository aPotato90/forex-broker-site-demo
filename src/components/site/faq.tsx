import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqItem {
  question: string;
  answer: string;
}

/** Accessible accordion (Radix: buttons with aria-expanded controlling labelled regions). */
export function FAQ({ items }: { items: readonly FaqItem[] }) {
  return (
    <Accordion type="single" collapsible className="mx-auto max-w-3xl rounded-2xl border bg-card">
      {items.map((item, index) => (
        <AccordionItem key={item.question} value={`item-${index}`} className="px-5">
          <AccordionTrigger className="py-5 text-base hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-[0.95rem] leading-relaxed text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
