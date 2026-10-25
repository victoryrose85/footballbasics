"use client";

import { useEffect, useState } from "react";
import { openPrivacyChoices, watchPrivacyChoice, type PrivacyChoice } from "@/lib/consent";

// Reopens Google's consent choices for visitors who have one; for everyone else it goes to the privacy policy.
export default function PrivacyChoicesLink({ className }: { className?: string }) {
  const [choice, setChoice] = useState<PrivacyChoice | null>(null);
  useEffect(() => watchPrivacyChoice(setChoice), []);
  return (
    <a
      href="/privacy-policy"
      className={className}
      onClick={e => {
        if (!choice) return;
        e.preventDefault();
        openPrivacyChoices(choice);
      }}
    >
      Privacy &amp; cookie choices
    </a>
  );
}
