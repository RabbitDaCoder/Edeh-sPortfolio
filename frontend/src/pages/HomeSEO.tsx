import React from "react";
import { useSEO } from "../hooks/useSEO";
import { SEO } from "../components/seo/SEO";
import { JsonLD } from "../components/seo/JsonLD";
import { personSchema, websiteSchema } from "../lib/schemas";

export const HomeSEO: React.FC = () => {
  const seo = useSEO({
    title: "Full-Stack Engineer & Digital Creator",
    description:
      "Edeh Chinedu Daniel — Full-Stack Engineer, IoT builder, and " +
      "Digital Creator based in Enugu, Nigeria. Founder of DroineTech. " +
      "Lead Developer at HydroSense.",
    canonical: "https://edehchinedu.dev",
    ogType: "website",
    ogImage: "https://edehchinedu.dev/og-default.jpg",
    keywords: [
      "Full-Stack Engineer Nigeria",
      "React Developer Enugu",
      "IoT Developer Nigeria",
      "Web Developer Portfolio",
      "RabbitDaCoder",
      "Edeh Chinedu Daniel",
      "DroineTech",
      "HydroSense",
    ],
  });

  return (
    <>
      <SEO {...seo} />
      <JsonLD schema={personSchema()} />
      <JsonLD schema={websiteSchema()} />
    </>
  );
};
