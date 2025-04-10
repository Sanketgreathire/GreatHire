import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import {
  Shield, UserCheck, Lock, Eye, FileCheck, MessageSquare, Book, Target,
  Users, AlertTriangle, Cpu, Scale, Ban, DollarSign, HandshakeIcon, Building, ScrollText, ChevronDown
} from 'lucide-react';

const sections = [
  { id: "introduction", label: "Introduction", icon: UserCheck },
  { id: "purpose", label: "Purpose", icon: Target },
  { id: "eligibility", label: "Eligibility", icon: Users },
  { id: "conditions-recruiters", label: "Conditions for Recruiters", icon: Users },
  { id: "conditions-jobseekers", label: "Conditions for Job Seekers", icon: FileCheck },
  { id: "user-participation", label: "User Participation", icon: Book },
  { id: "usage-restrictions", label: "Usage Restrictions", icon: AlertTriangle },
  { id: "ip-rights", label: "Intellectual Property Rights", icon: Cpu },
  { id: "privacy", label: "Privacy & Data Protection", icon: Lock },
  { id: "third-party", label: "Third-Party Links", icon: Eye },
  { id: "security", label: "Security & Account", icon: Shield },
  { id: "payment", label: "Payment & Refund", icon: DollarSign },
  { id: "liability", label: "Limitation of Liability", icon: Scale },
  { id: "dispute", label: "Dispute Resolution", icon: HandshakeIcon },
  { id: "termination", label: "Termination & Suspension", icon: Ban },
  { id: "compliance", label: "Compliance with Laws", icon: Building },
  { id: "amendments", label: "Amendments to Terms", icon: ScrollText },
  { id: "contact", label: "Contact & Info", icon: MessageSquare },
];

const Section = ({ icon: Icon, title, children, sectionKey, expandedSection, setExpandedSection }) => {
  const isOpen = expandedSection === sectionKey;

  return (
    <motion.div
      className="border border-gray-200 rounded-xl shadow-sm bg-white"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9 }}
    >
      <button
        onClick={() => setExpandedSection(isOpen ? null : sectionKey)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-all"
      >
        <span className="flex items-center gap-3 text-lg font-semibold text-gray-900">
          <Icon className="h-6 w-6 text-blue-600" />
          {title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="text-gray-500 h-5 w-5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="px-6 pb-5 pt-1 text-gray-700 leading-relaxed"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

function App() {
  const [expandedSection, setExpandedSection] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />

      <header className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Shield className="h-9 w-9 text-blue-600" />
            Terms & Privacy Policy
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Please read the following policies carefully for using our services.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex gap-6">
        {/* Sidebar Table of Contents */}
        <aside className="w-64 hidden md:block sticky top-20 h-fit bg-white border rounded shadow p-4">
          <h3 className="text-xl font-bold mb-4">Table of Contents</h3>
          <ul className="space-y-3 text-lg">
            {sections.map(({ id, label, icon }) => (
              <li key={id}>
                <button
                  onClick={() => setExpandedSection(id)}
                  className={`flex items-center gap-2 w-full text-left transition ${
                    expandedSection === id
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {React.createElement(icon, { className: "h-4 w-4 text-blue-600" })}
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-12">
          {sections.map(({ id, label, icon }) => (
            <Section
              key={id}
              icon={icon}
              title={label}
              sectionKey={id}
              expandedSection={expandedSection}
              setExpandedSection={setExpandedSection}
            >
              {getSectionContent(id)}
            </Section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Content for each section
function getSectionContent(id) {
  const bullets = (items) => (
    <ul className="list-disc list-inside space-y-1">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );

  switch (id) {
    case "introduction":
      return <>Welcome to GreatHire, a leading provider of HR staffing, recruitment services, and software development solutions. These terms and conditions govern your use of our services available at <a href='https://greathire.in'>https://greathire.in</a>. By accessing or using our platform, you agree to be bound by these terms.</>;
    case "purpose":
      return <>GreatHire's platform connects talented professionals with leading organizations in the technology sector. We facilitate recruitment processes, provide HR staffing solutions, and deliver custom software development services to meet the evolving needs of businesses.</>;
    case "eligibility":
      return bullets([
        "Job seekers who are legally eligible to work in their desired location",
        "Organizations legally registered and operating in their respective jurisdictions",
        "Individuals aged 18 years or older",
        "Entities seeking IT staffing and software development services"
      ]);
    case "conditions-recruiters":
      return bullets([
        "Post accurate job descriptions",
        "Maintain confidentiality of candidate data",
        "Follow fair hiring practices",
        "Provide timely feedback to candidates"
      ]);
    case "conditions-jobseekers":
      return bullets([
        "Provide accurate professional information",
        "Maintain current availability status",
        "Respect confidentiality of employer information",
        "Attend scheduled interviews professionally"
      ]);
    case "user-participation":
      return bullets([
        "Provide accurate and current information",
        "Maintain profile confidentiality",
        "Engage professionally with other users",
        "Report any suspicious or inappropriate behavior"
      ]);
    case "usage-restrictions":
      return bullets([
        "Share false or misleading information",
        "Attempt to bypass platform security measures",
        "Scrape or collect user data without authorization",
        "Use the platform for any illegal purposes"
      ]);
    case "ip-rights":
      return <>All content, including software, designs, logos, and documentation on GreatHire's platform is protected by intellectual property rights. Users retain ownership of their submitted content while granting GreatHire necessary licenses to provide our services.</>;
    case "privacy":
      return <>We prioritize the protection of your personal and professional information. Our data handling practices comply with relevant privacy laws and industry standards. We implement robust security measures to protect against unauthorized access and data breaches.</>;
    case "third-party":
      return <>Our platform may contain links to third-party services. GreatHire is not responsible for the content or privacy practices of these external services. Users access third-party services at their own risk.</>;
    case "security":
      return bullets([
        "Maintaining account security credentials",
        "Reporting unauthorized access",
        "Ensuring device and network security",
        "Logging out from shared devices"
      ]);
    case "payment":
      return <>For our recruitment and software development services, we maintain transparent pricing. Refunds are handled on a case-by-case basis according to the terms of individual service agreements and applicable laws.</>;
    case "liability":
      return <>GreatHire's liability is limited to the extent permitted by law. We are not liable for indirect damages, loss of profits, or consequences of platform unavailability.</>;
    case "dispute":
      return bullets([
        "Initial informal negotiation",
        "Formal mediation if necessary",
        "Binding arbitration as a last resort"
      ]);
    case "termination":
      return <>GreatHire reserves the right to suspend or terminate accounts that violate our terms, engage in fraudulent activities, or pose risks to our community. Users may terminate their accounts at any time.</>;
    case "compliance":
      return <>Users must comply with all applicable local, state, and national laws while using our platform. This includes employment laws, data protection regulations, and industry-specific requirements.</>;
    case "amendments":
      return <>GreatHire may update these terms periodically. Users will be notified of significant changes, and continued use of the platform constitutes acceptance of modified terms.</>;
    case "contact":
      return <>
        For questions or concerns about these terms, please contact us at:
        <br />
        <a href="https://greathire.in" className="text-blue-600 hover:text-blue-800 block mt-2">Website: https://greathire.in</a>
        <a href="mailto:hr@greathire.in" className="text-blue-600 hover:text-blue-800">Email: hr@greathire.in</a>
      </>;
    default:
      return null;
  }
}

export default App;
