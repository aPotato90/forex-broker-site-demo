import { ExternalLinkIcon } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/site/page-hero";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact (demo form)",
  description:
    "A demo contact form for the fictional Emmy Capital that validates but never sends. Real enquiries go to Emmanuel Kelvin's portfolio.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch (or rather, pretend to)"
        description="This form validates your input and then shows a demo confirmation. It does not send email, store messages or contact anyone."
      />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.6fr_1fr] lg:px-8">
        <ContactForm />
        <aside
          aria-labelledby="real-enquiries"
          className="h-fit rounded-2xl border border-brand/40 bg-brand/10 p-6"
        >
          <h2 id="real-enquiries" className="text-lg font-semibold">
            Real enquiries
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Emmy Capital has no support team because it does not exist. If you would like to talk
            about this project or hire its developer, please use the contact details on the
            portfolio.
          </p>
          <a
            href={siteConfig.portfolioUrl}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text underline underline-offset-4"
          >
            Visit {siteConfig.author}&apos;s portfolio
            <ExternalLinkIcon aria-hidden className="size-4" />
          </a>
        </aside>
      </div>
    </>
  );
}
