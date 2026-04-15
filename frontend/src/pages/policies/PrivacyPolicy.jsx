import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Helmet } from "react-helmet-async";
import {
  AlertTriangle,
  Ban,
  Book,
  Building,
  CalendarClock,
  ChevronDown,
  Cpu,
  DollarSign,
  Eye,
  FileCheck,
  HandshakeIcon,
  Lock,
  Mail,
  MessageSquare,
  Scale,
  ScrollText,
  Shield,
  Target,
  UserCheck,
  Users,
} from "lucide-react";

const sections = [
  {
    id: "introduction",
    label: "Introduction",
    icon: UserCheck,
    intro:
      "GreatHire connects job seekers and recruiters through a secure and transparent hiring platform.",
    points: [
      "This Privacy Policy outlines how we collect, use, and protect your personal information to connect job seekers with recruiters effectively and securely.",
"At GreatHire, we prioritize your privacy and are committed to safeguarding your data while maintaining transparency and trust.",
" Our platform facilitates seamless job matching and recruitment while adhering to strict data protection standards, including GDPR and CCPA compliance.",
" By using GreatHire, you consent to the practices outlined in this policy. Please review it carefully to understand your rights and our responsibilities.",
" This policy applies to all GreatHire services, including our website, mobile applications, and communication tools.",
" We regularly update this policy to reflect legal requirements and service enhancements. We encourage periodic review for the latest updates.",
" Your data is collected to enhance user experience, optimize job matching, and support recruiters in hiring efficiently.",
" We employ robust technical safeguards and strict access controls to ensure the security of your personal information.",
" GreatHire does not sell or rent user data to third parties. Your trust remains our top priority.",
" For inquiries or concerns, please contact us at hr@babde.tech."


    ],
  },
  {
    id: "purpose",
    label: "Purpose",
    icon: Target,
    intro: "This policy explains how and why we collect, use, and protect personal data.",
    points: [
      "The purpose of this Privacy Policy is to inform users of GreatHire about the collection, processing, storage, and sharing of their data.",
"We ensure transparency about your data rights and maintain strict confidentiality throughout the hiring process.",
" Personal data is collected to match job seekers with opportunities and assist recruiters in finding the best candidates.",
" This policy promotes informed decision-making and builds trust through ethical and lawful data usage.",
" We foster a privacy-first culture, empowering users while adhering to global data protection standards like GDPR and CCPA.",
" Data is used only for outlined purposes or with user consent, ensuring accountability and clarity.",
" We provide clear contact points for privacy concerns and comply with legal requirements to mitigate data misuse risks.",
" GreatHire is committed to being a leader in ethical hiring technologies, respecting every user's privacy, dignity, and security.",
"or inquiries, contact us at privacy@greathire.com."    ],
  },
  {
    id: "eligibility",
    label: "Eligibility",
    icon: Users,
    intro: "Users must meet eligibility standards to maintain a trusted hiring environment.",
    points: [
      "Job seekers must satisfy applicable legal working-age requirements.",
      "Recruiters must represent legitimate organizations and accurate job opportunities.",
      "All account details must be truthful and kept reasonably up to date.",
      "Accounts that violate eligibility requirements can be limited or removed.",
    ],
  },
  {
    id: "conditions-recruiters",
    label: "Conditions for Recruiters",
    icon: Users,
    intro: "Recruiters must follow legal, ethical, and platform standards.",
    points: [
      "Post only real roles with clear responsibilities and requirements.",
      "Use candidate data only for hiring decisions and approved communication.",
      "Do not publish discriminatory, deceptive, or harmful job content.",
      "Repeated abuse reports may trigger moderation, suspension, or account closure.",
    ],
  },
  {
    id: "conditions-jobseekers",
    label: "Conditions for Job Seekers",
    icon: FileCheck,
    intro: "Job seekers are expected to use the platform professionally and honestly.",
    points: [
      "Provide accurate resume and profile information.",
      "Respect interview schedules and recruiter communication.",
      "Do not impersonate others or submit fraudulent credentials.",
      "Keep personal details current to improve match quality.",
    ],
  },
  {
    id: "user-participation",
    label: "User Participation",
    icon: Book,
    intro: "Community trust depends on respectful participation from all users.",
    points: [
      "Use constructive language in messages, applications, and feedback.",
      "Report spam, scams, and abusive content using available tools.",
      "Avoid posting misleading claims or confidential third-party information.",
      "Follow local laws and professional standards in all interactions.",
    ],
  },
  {
    id: "usage-restrictions",
    label: "Usage Restrictions",
    icon: AlertTriangle,
    intro: "Certain actions are prohibited to protect platform integrity and user safety.",
    points: [
      "No scraping, automated harvesting, or unauthorized bulk extraction.",
      "No phishing, malware distribution, or account credential abuse.",
      "No reverse engineering or copying protected platform logic.",
      "No misuse of reporting systems or fake account creation.",
    ],
  },
  {
    id: "ip-rights",
    label: "Intellectual Property Rights",
    icon: Cpu,
    intro: "GreatHire content, branding, and software are legally protected assets.",
    points: [
      "Platform trademarks, logos, and code cannot be reused without permission.",
      "Users retain ownership of content they upload, subject to platform license terms.",
      "IP violations may lead to takedowns, suspension, and legal escalation.",
      "Do not claim affiliation with GreatHire without written authorization.",
    ],
  },
  {
    id: "privacy",
    label: "Privacy and Data Protection",
    icon: Lock,
    intro: "Privacy is a core operating principle at GreatHire.",
    points: [
      "We collect only data that is needed for account, matching, and hiring workflows.",
      "Sensitive data is protected with encryption in transit and at rest.",
      "Users can request access, correction, deletion, or portability where applicable.",
      "We align our controls with laws such as GDPR and CCPA where relevant.",
    ],
  },
  {
    id: "third-party",
    label: "Third-Party Links",
    icon: Eye,
    intro: "Some features may connect to third-party services.",
    points: [
      "External links are provided for convenience and are governed by third-party policies.",
      "We are not responsible for third-party content, uptime, or policy changes.",
      "Data sharing with third parties is limited to approved, lawful purposes.",
      "Review third-party privacy terms before sharing sensitive information.",
    ],
  },
  {
    id: "security",
    label: "Security and Account Protection",
    icon: Shield,
    intro: "We combine technical and operational safeguards to reduce risk.",
    points: [
      "Users should maintain strong passwords and keep credentials private.",
      "Unusual sign-in activity can trigger alerts and additional verification.",
      "Role-based access controls restrict internal access to personal data.",
      "Known incidents are investigated promptly with corrective actions.",
    ],
  },
  {
    id: "payment",
    label: "Payment and Refund",
    icon: DollarSign,
    intro: "Paid features follow transparent billing and renewal rules.",
    points: [
      "Pricing details are shown before purchase and applicable taxes are disclosed.",
      "Payments are processed through secure third-party gateways.",
      "Subscription renewal terms are displayed in-plan and in confirmation flows.",
      "Refund requests are reviewed under the posted refund policy.",
    ],
  },
  {
    id: "liability",
    label: "Limitation of Liability",
    icon: Scale,
    intro: "GreatHire aims for reliable service but cannot guarantee uninterrupted operation.",
    points: [
      "The platform is provided on an as-is and as-available basis.",
      "We are not liable for hiring outcomes or third-party actions.",
      "Indirect and consequential damages are excluded where legally permitted.",
      "Liability limits may vary by jurisdiction and applicable law.",
    ],
  },
  {
    id: "dispute",
    label: "Dispute Resolution",
    icon: HandshakeIcon,
    intro: "We encourage direct resolution before formal escalation.",
    points: [
      "Contact support first so we can investigate and resolve quickly.",
      "If unresolved, disputes may proceed under governing law and venue terms.",
      "Some disputes may be subject to arbitration depending on jurisdiction.",
      "Claims should be filed within legal time limits.",
    ],
  },
  {
    id: "termination",
    label: "Termination and Suspension",
    icon: Ban,
    intro: "Accounts may be suspended or terminated for policy violations.",
    points: [
      "Serious abuse, fraud, or repeated misconduct can lead to immediate restriction.",
      "Users may close their own accounts through account settings.",
      "Certain records may be retained for legal, security, or audit reasons.",
      "Termination does not remove liabilities created before account closure.",
    ],
  },
  {
    id: "compliance",
    label: "Compliance with Laws",
    icon: Building,
    intro: "GreatHire operates under applicable local and international laws.",
    points: [
      "We respond to lawful requests from regulators and courts.",
      "Users must follow employment, anti-discrimination, and data protection laws.",
      "Policy controls are reviewed regularly to remain legally aligned.",
      "Non-compliance can result in access restrictions or account removal.",
    ],
  },
  {
    id: "amendments",
    label: "Amendments to Terms",
    icon: ScrollText,
    intro: "We may revise these terms when regulations or services change.",
    points: [
      "Material changes are announced through product notices or email.",
      "Continued usage after updates indicates acceptance of revised terms.",
      "Users who disagree should stop using the platform.",
      "The latest update date is always shown on this page.",
    ],
  },
  {
    id: "contact",
    label: "Contact and Help",
    icon: MessageSquare,
    intro: "For privacy and policy questions, contact our support team.",
    points: [
      "General support: hr@babde.tech",
      "Privacy inquiries: privacy@greathire.com",
      "Website: https://greathire.in",
      "Response times vary based on request type and verification needs.",
    ],
  },
];

const quickFacts = [
  {
    title: "Last Updated",
    value: "February 26, 2026",
    icon: CalendarClock,
  },
  {
    title: "Support Email",
    value: "privacy@greathire.com",
    icon: Mail,
  },
  {
    title: "Sections",
    value: `${sections.length} Policy Areas`,
    icon: FileCheck,
  },
];

function SectionCard({ section, isOpen, onToggle }) {
  const Icon = section.icon;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
            <Icon className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-semibold text-slate-900 dark:text-slate-100">
              {section.label}
            </span>
            <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">
              {section.intro}
            </span>
          </span>
        </span>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-slate-500 dark:text-slate-400"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-200/70 px-5 pb-5 pt-4 dark:border-slate-700">
              <ul className="space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {section.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function PrivacyPolicy() {
  const [expandedSection, setExpandedSection] = useState(sections[0].id);

  const activeSection = useMemo(
    () => sections.find((section) => section.id === expandedSection),
    [expandedSection]
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50 to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100"
      style={{ fontFamily: "Sora, Segoe UI, sans-serif" }}
    >
      <Helmet>
        <title>
          Terms and Privacy Policy | GreatHire Platform Rules and Data Protection
        </title>
        <meta
          name="description"
          content="Read GreatHire terms and privacy policy to understand data usage, account security, eligibility, recruiter and job-seeker responsibilities, and your rights on our platform."
        />
      </Helmet>

      <Navbar />

      <header className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-br from-cyan-100 via-sky-100 to-amber-50 pt-24 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-sky-300/40 blur-3xl dark:bg-cyan-600/20" />
        <div className="pointer-events-none absolute -right-24 bottom-8 h-56 w-56 rounded-full bg-amber-300/30 blur-3xl dark:bg-sky-600/20" />

        <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 md:p-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-800 dark:bg-sky-900/40 dark:text-sky-300">
              <Shield className="h-4 w-4" />
              Legal and Privacy Center
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
              Terms and Privacy Policy
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
              This page explains how GreatHire protects user data, defines platform rules,
              and sets responsibilities for recruiters and job seekers.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {quickFacts.map((fact) => {
                const FactIcon = fact.icon;
                return (
                  <div
                    key={fact.title}
                    className="rounded-2xl border border-slate-200 bg-white/90 p-3 dark:border-slate-700 dark:bg-slate-900/80"
                  >
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <FactIcon className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                      {fact.title}
                    </div>
                    <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {fact.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 lg:hidden">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setExpandedSection(section.id)}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                expandedSection === section.id
                  ? "border-sky-600 bg-sky-600 text-white"
                  : "border-slate-300 bg-white text-slate-600 hover:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Table of Contents
              </h2>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = expandedSection === section.id;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setExpandedSection(section.id)}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${
                        isActive
                          ? "bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="truncate">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Currently Open
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {activeSection?.label}
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Use the section list to quickly navigate policy topics.
              </p>
            </div>

            {sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                isOpen={expandedSection === section.id}
                onToggle={() =>
                  setExpandedSection((current) =>
                    current === section.id ? "" : section.id
                  )
                }
              />
            ))}

            <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-5 dark:border-sky-900 dark:bg-sky-950/30">
              <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">
                Need privacy help?
              </p>
              <p className="mt-1 text-sm text-sky-700 dark:text-sky-200">
                Email us at{" "}
                <a
                  href="mailto:privacy@greathire.com"
                  className="font-semibold underline underline-offset-2"
                >
                  privacy@greathire.com
                </a>{" "}
                and include your account email plus request details.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
