import { LegalLayout } from "../../components/layout/LegalLayout";
import {
  LegalSection,
  LP,
  LList,
  LCallout,
  LEmail,
} from "../../components/layout/LegalSection";

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      description="Terms governing use of this portfolio platform, blog content, book purchases, and contact enquiries."
      lastUpdated="March 2026"
    >
      {/* Intro */}
      <LP>
        By using this website, reading my blog, purchasing books, or contacting
        me through this platform, you agree to these Terms of Service. If you do
        not agree, please do not use this platform.
      </LP>
      <LP>
        These terms apply to edehchinedu.dev and any associated subdomains
        operated by Edeh Chinedu Daniel (&quot;I&quot;, &quot;me&quot;,
        &quot;my&quot;).
      </LP>

      <LegalSection number="01" heading="How I work — services offered">
        <LP>
          This platform showcases my work as a full-stack software engineer and
          serves as a hub for my writing and books. Through this platform I
          offer:
        </LP>
        <LList
          items={[
            "Freelance and contract software engineering — web applications, PERN stack systems, IoT dashboards, and blockchain development.",
            "Technical consultation — architecture reviews, code audits, and engineering advice.",
            "Blog content — articles on software engineering, blockchain, IoT, and building products.",
            "Books — technical and educational books written by me, available for purchase and download.",
          ]}
        />
        <LP>
          For project enquiries, use the contact form or book a call through
          Calendly. I respond to all genuine enquiries within 48 hours.
        </LP>
        <LCallout>
          <LP>
            I work with clients directly — no agencies, no handoffs. Every
            project I take on is built by me personally.
          </LP>
        </LCallout>
      </LegalSection>

      <LegalSection number="02" heading="Blog content — usage and copyright">
        <LP>
          All blog posts, articles, and written content published on this
          platform are the original work of Edeh Chinedu Daniel and are
          protected by copyright.
        </LP>
        <LP>You are welcome to:</LP>
        <LList
          items={[
            "Read, share, and link to any blog post.",
            "Quote short excerpts (up to 150 words) with clear attribution and a link back to the original post.",
            "Share blog post links on social media.",
          ]}
        />
        <LP>You may not:</LP>
        <LList
          items={[
            "Republish or reproduce entire blog posts on other websites without written permission.",
            "Copy blog content and present it as your own work.",
            "Scrape or bulk-download blog content for training AI models or any automated system.",
            "Use blog content for commercial purposes without prior written agreement.",
          ]}
        />
        <LP>
          For republishing permission or content licensing, contact me at{" "}
          <LEmail />.
        </LP>
      </LegalSection>

      <LegalSection number="03" heading="Book purchases">
        <LP>
          Books sold through this platform are digital products delivered as PDF
          or ePub files.
        </LP>
        <LP>When you purchase a book:</LP>
        <LList
          items={[
            "You receive a personal, non-transferable licence to read and use the content.",
            "You may download the book to your own devices for personal use.",
            "You may not share, resell, or redistribute the book file.",
            "You may not reproduce substantial portions of the book content without permission.",
          ]}
        />
        <LP>
          <strong>Refund policy:</strong>
        </LP>
        <LList
          items={[
            "I offer a 7-day refund on all book purchases, no questions asked, if you are unsatisfied.",
            "To request a refund, email me at edehchinedu59@gmail.com within 7 days of purchase with your order details.",
            "Refunds are processed within 5–10 business days depending on your payment method.",
            "After 7 days, refunds are granted on a case-by-case basis for technical issues (e.g. file delivery failure).",
          ]}
        />
        <LCallout>
          <LP>
            If you experience any issue downloading or accessing a book you
            purchased, email me at <LEmail /> and I will resolve it within 24
            hours.
          </LP>
        </LCallout>
      </LegalSection>

      <LegalSection number="04" heading="Contact and enquiry system">
        <LP>
          Messages sent through the contact form are read by me personally. By
          submitting an enquiry you agree to:
        </LP>
        <LList
          items={[
            "Providing accurate information about yourself and your project.",
            "Not submitting spam, unsolicited advertising, or malicious content.",
            "Not using the contact form for harassment or abuse.",
          ]}
        />
        <LP>
          I reserve the right to ignore or block enquiries that are abusive,
          spam, or clearly outside my scope of work.
        </LP>
        <LP>
          Submitting a contact form does not create a contractual obligation on
          my part. A project engagement only begins once we have agreed in
          writing (email or written contract) on scope and terms.
        </LP>
      </LegalSection>

      <LegalSection number="05" heading="Newsletter">
        <LP>
          By subscribing to my newsletter you agree to receive occasional emails
          when I publish new blog posts or books. I do not send promotional
          emails for third parties.
        </LP>
        <LList
          items={[
            "You can unsubscribe at any time using the link in any email.",
            "I will never sell or share your email address.",
            "I send emails infrequently — typically fewer than twice per month.",
          ]}
        />
      </LegalSection>

      <LegalSection number="06" heading="Acceptable use">
        <LP>You agree not to use this platform to:</LP>
        <LList
          items={[
            "Attempt to gain unauthorised access to any part of the platform or its infrastructure.",
            "Submit false or misleading information through any form.",
            "Attempt to reverse-engineer, scrape, or extract data from the platform in bulk.",
            "Use automated tools to probe or attack the platform.",
            "Impersonate me or claim affiliation with my work without permission.",
          ]}
        />
        <LP>
          Violations may result in your access being blocked and, where
          applicable, reported to the relevant authorities.
        </LP>
      </LegalSection>

      <LegalSection number="07" heading="Intellectual property">
        <LP>
          All content on this platform — including but not limited to blog
          posts, book content, code examples, project descriptions, design work,
          and the platform itself — is the intellectual property of Edeh Chinedu
          Daniel unless otherwise stated.
        </LP>
        <LP>
          Open-source code I publish on GitHub is governed by the licence stated
          in the respective repository (typically MIT). That licence applies to
          the code only, not to any accompanying written content.
        </LP>
      </LegalSection>

      <LegalSection number="08" heading="Limitation of liability">
        <LP>
          This platform and its content are provided &quot;as is&quot; without
          warranties of any kind. To the fullest extent permitted by law:
        </LP>
        <LList
          items={[
            "I am not liable for any damages arising from your use of this platform or its content.",
            "Blog posts and articles are for educational and informational purposes only. They do not constitute professional advice.",
            "I am not responsible for the content of external websites linked from this platform.",
            "I make no guarantee that the platform will be available at all times or free from errors.",
          ]}
        />
      </LegalSection>

      <LegalSection number="09" heading="Governing law">
        <LP>
          These terms are governed by the laws of the Federal Republic of
          Nigeria. Any disputes arising from these terms or your use of this
          platform shall be subject to the jurisdiction of the courts of
          Nigeria.
        </LP>
      </LegalSection>

      <LegalSection number="10" heading="Changes to these terms">
        <LP>
          I may update these Terms of Service at any time. Updates take effect
          immediately upon publication. Continued use of the platform after
          changes constitutes acceptance of the updated terms.
        </LP>
        <LP>
          The &quot;Last updated&quot; date at the top of this page always
          reflects the most recent revision.
        </LP>
        <LP>
          Questions or concerns? Contact me at <LEmail />.
        </LP>
      </LegalSection>
    </LegalLayout>
  );
}
