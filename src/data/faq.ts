import type { FaqItem } from "@/components/site/faq";

export const HOME_FAQ: readonly FaqItem[] = [
  {
    question: "Is Emmy Capital a real broker?",
    answer:
      "No. Emmy Capital is a fictional brand created for a web development portfolio. There is no company, no licence, no trading and no way to deposit money. Every page is a demonstration of design and engineering.",
  },
  {
    question: "Where do the prices come from?",
    answer:
      "Nowhere outside your browser. A small, seeded random-walk engine generates simulated prices locally. They are not connected to any market, are labelled “Simulated prices” wherever they appear and should never be used for decisions.",
  },
  {
    question: "What happens if I open a demo account?",
    answer:
      "You can walk through a three-step form that validates your input, but nothing is sent or stored anywhere. The final screen confirms that the form was only a demonstration.",
  },
  {
    question: "Are the calculators accurate?",
    answer:
      "They use standard textbook formulas and are covered by unit tests, but they are educational tools. They assume a USD account and use fixed illustrative conversion rates for cross pairs, so results are approximate.",
  },
  {
    question: "Does this site collect any data?",
    answer:
      "No. There are no cookies, analytics or third-party scripts. The only thing saved is your light or dark theme choice, which stays in your own browser's local storage.",
  },
  {
    question: "Who built this?",
    answer:
      "Emmanuel Kelvin, a full-stack developer, built it with Next.js, TypeScript and Tailwind CSS. Use the portfolio link in the footer for real enquiries.",
  },
];
