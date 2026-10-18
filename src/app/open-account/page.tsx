import type { Metadata } from "next";
import { OpenAccountForm } from "@/components/forms/open-account-form";
import { PageHero } from "@/components/site/page-hero";
import { RiskWarning } from "@/components/site/risk-warning";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Open a demo account",
  description:
    "Try the three-step demo account sign-up for the fictional Emmy Capital. Inputs are validated in the browser; nothing is submitted or stored.",
  path: "/open-account",
});

export default function OpenAccountPage() {
  return (
    <>
      <PageHero
        eyebrow="Open a demo account"
        title="A sign-up flow with nothing behind it"
        description="Three short steps with validation and a review screen. There is no server, database or account: when you finish, your answers are simply discarded."
      />
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6 sm:py-16">
        <OpenAccountForm />
        <RiskWarning />
      </div>
    </>
  );
}
