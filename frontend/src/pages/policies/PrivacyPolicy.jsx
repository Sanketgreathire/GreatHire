import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import {
  Shield, UserCheck, Lock, Eye, FileCheck, MessageSquare, Book, Target,
  Users, AlertTriangle, Cpu, Scale, Ban, DollarSign, HandshakeIcon, Building, ScrollText, ChevronDown
} from 'lucide-react';

const sections = [
  { id: "introduction", label: "Introduction" , icon: UserCheck },
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
                  <span className="font-serif text-lg tracking-wide">{label}</span> {/* Updated font style */}
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
      return (
        <div className="font-oswald">
          <h2 className="text-2xl font-bold text-blue-600  mb-4">
            Welcome to GreatHire
          </h2>
          <p style={{ fontFamily: "Oswald" }} className="text-lg text-gray-700 leading-relaxed">
            This Privacy Policy outlines how we collect, use, and protect your personal information to connect job seekers with recruiters effectively and securely. <br></br>
            • At GreatHire, we prioritize your privacy and are committed to safeguarding your data while maintaining transparency and trust.<br></br>
            • Our platform facilitates seamless job matching and recruitment while adhering to strict data protection standards, including GDPR and CCPA compliance.<br></br>
            • By using GreatHire, you consent to the practices outlined in this policy. Please review it carefully to understand your rights and our responsibilities.<br></br>
            • This policy applies to all GreatHire services, including our website, mobile applications, and communication tools.<br></br>
            • We regularly update this policy to reflect legal requirements and service enhancements. We encourage periodic review for the latest updates.<br></br>
            • Your data is collected to enhance user experience, optimize job matching, and support recruiters in hiring efficiently.<br></br>
            • We employ robust technical safeguards and strict access controls to ensure the security of your personal information.<br></br>
            • GreatHire does not sell or rent user data to third parties. Your trust remains our top priority.<br></br>
            • For inquiries or concerns, please contact us at <a href="privacy@greathire.com" className="text-blue-600 hover:text-blue-800">privacy@greathire.com</a>.
          </p>
        </div>
      );
    case "purpose":
      return (
          <p style={{ fontFamily: "Oswald" }} className="text-lg text-gray-700 leading-relaxed">
            The purpose of this Privacy Policy is to inform users of GreatHire about the collection, processing, storage, and sharing of their data. <br></br>
            • We ensure transparency about your data rights and maintain strict confidentiality throughout the hiring process. <br></br>
            • Personal data is collected to match job seekers with opportunities and assist recruiters in finding the best candidates. <br></br>
            • This policy promotes informed decision-making and builds trust through ethical and lawful data usage. <br></br>
            • We foster a privacy-first culture, empowering users while adhering to global data protection standards like GDPR and CCPA. <br></br>
            • Data is used only for outlined purposes or with user consent, ensuring accountability and clarity. <br></br>
            • We provide clear contact points for privacy concerns and comply with legal requirements to mitigate data misuse risks. <br></br>
            • GreatHire is committed to being a leader in ethical hiring technologies, respecting every user's privacy, dignity, and security. <br></br>
            <br></br>
            For inquiries, contact us at <a href="privacy@greathire.com" className="text-blue-600 hover:text-blue-800">privacy@greathire.com</a>.
          </p>
    
      );
    case "eligibility":
      return <p style={{ fontFamily: "Oswald" }} className="text-lg text-gray-700 leading-relaxed">
        GreatHire is a professional job hiring platform designed for individuals meeting specific eligibility criteria to ensure a secure and compliant environment.<br></br>

        • Job seekers must be at least 16 years old or meet the legal working age in their jurisdiction.<br></br>
        • Recruiters must represent legitimate organizations with valid credentials.<br></br>
        • Users must provide accurate and truthful information during registration and profile creation.<br></br>
        • We reserve the right to verify user identities and affiliations through background checks or third-party validation.<br></br>
        • Suspended or banned individuals cannot re-register without written consent.<br></br>
        • Eligibility may vary by region based on local laws and regulations.<br></br>
        • Users acting on behalf of organizations must have the authority to bind the organization to this policy.<br></br>
        • Failure to meet eligibility standards may result in account suspension or termination.<br></br>
        • All users must respect community guidelines and avoid discriminatory practices.<br></br>
        • Providing false information or misrepresentation will lead to removal from the platform.<br></br>

        For clarification or assistance, contact our support team. By adhering to these standards, we ensure a trusted and professional hiring experience for all participants.
      </p>;
    case "conditions-recruiters":
      return <p style={{ fontFamily: "Oswald" }} className="text-lg text-gray-700 leading-relaxed">
        Recruiters using GreatHire must adhere to professional standards and comply with all legal and ethical requirements.<br></br>

        • Recruiter accounts must be linked to verified businesses or organizations.<br></br>
        • Accurate and truthful information about job postings and hiring practices is mandatory.<br></br>
        • Fraudulent or misleading job listings are strictly prohibited and may result in suspension.<br></br>
        • Candidate data must remain confidential and used only for recruitment purposes with consent.<br></br>
        • Discrimination based on race, gender, religion, age, or other protected categories is not allowed.<br></br>
        • Job postings must be clear, legitimate, and specific to actual vacancies.<br></br>
        • Automated bots or scraping tools are prohibited.<br></br>
        • Repeated complaints from job seekers may lead to account review or restriction.<br></br>
        • Communications with candidates must be professional and harassment-free.<br></br>
        • Compliance with GDPR, CCPA, and other data privacy laws is required.<br></br>
        • Misuse of the platform for illegal activities will result in permanent bans.<br></br>
        • Recruiters are responsible for job offers and employment contracts.<br></br>
        • Misrepresentation of identity or affiliation is prohibited.<br></br>
        • Offensive or harmful job listings will be removed.<br></br>

        By adhering to these guidelines, recruiters ensure a fair, transparent, and effective hiring process. For assistance, contact our support team.
      </p>;
    case "conditions-jobseekers":
      return bullets([
         <p style={{ fontFamily: "Oswald" }} className="text-lg text-gray-700 leading-relaxed">

        "Provide accurate professional information",
        "Maintain current availability status",
        "Respect confidentiality of employer information",
        "Attend scheduled interviews professionally"
        </p>
      ]);
    case "user-participation":
      return <p style={{ fontFamily: "Oswald" }} className="text-lg text-gray-700 leading-relaxed">
        GreatHire fosters a transparent and collaborative platform where users are expected to contribute positively to the hiring ecosystem.<br></br>

        • Ensure the accuracy and integrity of shared information.<br></br>
        • Participate professionally by uploading resumes, applying to jobs, and communicating respectfully.<br></br>
        • Report inappropriate content, spam, or abuse promptly.<br></br>
        • Avoid discriminatory, offensive, or misleading content.<br></br>
        • Respect others' privacy and refrain from misusing contact information.<br></br>
        • Provide honest and constructive feedback in ratings and reviews.<br></br>
        • Contributions must align with community guidelines and legal standards.<br></br>
        • GreatHire reserves the right to moderate or remove content violating platform policies.<br></br>
        • Harassment or intimidation of any user will result in suspension or ban.<br></br>
        • Active participation enhances opportunities and platform recommendations.<br></br>
        • Users are responsible for their actions and must not impersonate GreatHire staff.<br></br>

        By adhering to these principles, users help maintain a fair and efficient hiring platform.
      </p>;
    case "usage-restrictions":
      return <p style={{ fontFamily: "Oswald" }} className="text-lg text-gray-700 leading-relaxed">
        To maintain the integrity of the GreatHire platform, the following usage restrictions apply:<br></br>

        • Users must not disrupt platform operations or engage in unauthorized access.<br></br>
        • Automated systems (e.g., bots, scrapers) are prohibited without written approval.<br></br>
        • Data collection for unlawful or commercial purposes is strictly forbidden.<br></br>
        • Reverse engineering, copying, or altering platform functionality is not allowed.<br></br>
        • The platform must only be used for lawful purposes within user roles.<br></br>
        • Misuse of job listings for unrelated promotions is prohibited.<br></br>
        • Sharing account credentials or impersonating others is not permitted.<br></br>
        • Uploading false, malicious, or misleading content is strictly prohibited.<br></br>
        • Spam, phishing, or unsolicited advertising is not allowed.<br></br>
        • Intellectual property rights must be respected at all times.<br></br>
        • Users may not create multiple fake accounts or distribute harmful software.<br></br>
        • Harassment, discrimination, or hate speech is strictly prohibited.<br></br>
        • Misuse of reporting or feedback mechanisms is not tolerated.<br></br>
        • Unauthorized use of platform branding or trademarks is forbidden.<br></br>
        • Users must comply with regional laws and respect others' rights.<br></br>

        Violations may result in account suspension, legal action, or permanent bans. By using GreatHire, you agree to these restrictions and any updates to the guidelines.
      </p>;
    case "ip-rights":
      return <p style={{ fontFamily: "Oswald" }} className="text-lg text-gray-700 leading-relaxed">

        • All platform content, including logos, software, and designs, is owned or licensed by GreatHire.<br></br>
        • Users are granted limited rights to access and use services for personal or recruitment purposes.<br></br>
        • Copying, modifying, or distributing platform materials without consent is prohibited.<br></br>
        • User-generated content remains the property of the user but may be used within the platform.<br></br>
        • Trademarks and branding elements must not be used without permission.<br></br>
        • Misrepresentation of association with GreatHire is strictly prohibited.<br></br>
        • Unauthorized use of intellectual property may result in legal action.<br></br>
        • Proprietary algorithms and systems are protected under law.<br></br>
        • Violations of IP rights will be addressed promptly and may lead to account suspension.<br></br>
        • Users must ensure uploaded content does not infringe on others' IP rights.<br></br>

        By using GreatHire, users agree to respect all IP-related policies. For concerns, contact us with appropriate evidence.
      </p>;
    case "privacy":
      return <p style={{ fontFamily: "Oswald" }} className="text-lg text-gray-700 leading-relaxed">

        • Personal data is collected solely for platform functionality and user benefit.<br></br>
        • Transparency is maintained in data collection, processing, and sharing.<br></br>
        • Consent is obtained for collecting and processing personal information.<br></br>
        • Data is encrypted during storage and transmission, accessible only to authorized personnel.<br></br>
        • Regular audits ensure compliance and improve data protection protocols.<br></br>
        • Users can manage privacy preferences and request data access, correction, or deletion.<br></br>
        • Sensitive data is handled securely and with user approval.<br></br>
        • We do not sell or rent personal data to advertisers or external firms.<br></br>
        • GDPR, CCPA, and other data protection laws are strictly followed.<br></br>
        • Data breaches are addressed promptly, with affected users notified.<br></br>
        • Privacy settings can be adjusted via user dashboards.<br></br>
        • Deactivated accounts are deleted unless legally required for retention.<br></br>
        • Analytics are conducted on anonymized datasets to protect user identity.<br></br>
        • Cross-border data transfers comply with strict legal frameworks.<br></br>
        • Staff are trained on best practices in data protection.<br></br>

        For concerns or inquiries, users are encouraged to contact us. Privacy remains a core value at GreatHire.
      </p>;
    case "third-party":
      return <p style={{ fontFamily: "Oswald" }} className="text-lg text-gray-700 leading-relaxed">
        GreatHire may include links to third-party websites, tools, or services to enhance your job-seeking or hiring experience.<br></br>

        • These links are provided for convenience and do not imply endorsement by GreatHire.<br></br>
        • We are not responsible for the content, policies, or practices of third-party websites.<br></br>
        • Users access external links at their own risk and should review third-party privacy policies.<br></br>
        • Limited data is shared with third parties only with user consent and for specific purposes.<br></br>
        • Integrated third-party services meet strict security and privacy standards.<br></br>
        • GreatHire disclaims liability for loss or damage arising from third•party services.<br></br>
        • Transactions or communications outside the platform are not governed by this policy.<br></br>
        • Users should verify third-party information before reliance and report suspicious content.<br></br>
        • API connections to trusted tools are regularly tested for reliability.<br></br>
        • GreatHire is not liable for third-party site downtimes or errors.<br></br>

        By using GreatHire, users agree to these terms. For concerns, contact our support team.
      </p>;
    case "security":
      return <p style={{ fontFamily: "Oswald" }} className="text-lg text-gray-700 leading-relaxed">
        GreatHire is committed to protecting your account and data with robust security measures.<br></br>

        • Users must maintain the confidentiality of their login credentials.<br></br>
        • Data is encrypted during storage and transmission using secure servers.<br></br>
        • Two-factor authentication (2FA) is recommended for enhanced account security.<br></br>
        • Suspicious login activity is monitored, and anomalies are promptly reported to users.<br></br>
        • Passwords must meet complexity standards and be updated periodically.<br></br>
        • Unauthorized access must be reported immediately to GreatHire.<br></br>
        • Firewall protection, intrusion detection, and regular security audits are employed.<br></br>
        • Access to user data is restricted to authorized personnel with role•based permissions.<br></br>
        • Users can manage sessions, update security preferences, and deactivate accounts via dashboards.<br></br>
        • GreatHire does not request sensitive data via email or chat.<br></br>
        • Known data breaches are promptly communicated to affected users.<br></br>
        • API connections are monitored to prevent unauthorized access.<br></br>
        • Session timeouts and auto-logouts protect unattended accounts.<br></br>
        • Users are encouraged to use secure networks and up-to-date browsers.<br></br>
        • Security policies are updated transparently to address emerging threats.<br></br>

        Your account integrity is essential to our mission. For concerns, contact our support team.
      </p>;
    case "payment":
      return <p style={{ fontFamily: "Oswald" }} className="text-lg text-gray-700 leading-relaxed">
        •Certain features or premium services on GreatHire may require payment.<br></br>
        •	All pricing is displayed clearly at the point of purchase, with applicable taxes included.<br></br>
        •	Payments are processed through secure, PCI-compliant third-party gateways.<br></br>
        •	Billing information is encrypted and not stored on our servers unless necessary.<br></br>
        •	Users will receive confirmation of purchases via email and within their account.<br></br>
        •	Subscription plans renew automatically unless canceled before the renewal date.<br></br>
        •	Users can manage billing preferences and subscriptions through their dashboard.<br></br>
        •	Refunds may be issued under specific circumstances outlined in our refund policy.<br></br>
        •	To request a refund, users must contact support within the specified time frame.<br></br>
        •	GreatHire reserves the right to deny refunds in cases of abuse or violation of terms.<br></br>
        •	Trial periods, if offered, will automatically convert to paid plans unless canceled.<br></br>
        •	Users are notified of any changes in pricing or billing structure in advance.<br></br>
        •	Disputes regarding charges should be submitted promptly to our billing team.<br></br>
        •	Refund eligibility may vary depending on region and legal requirements.<br></br>
        •	In cases of fraudulent payment or chargeback, account access may be suspended.<br></br>
        •	Users will be informed of failed payment attempts and given a grace period to resolve them.<br></br>
        •	GreatHire does not guarantee job placements or outcomes based on paid features.<br></br>
        •	Payment methods can be updated at any time via account settings.<br></br>
        •	We partner only with reputable payment processors that meet global security standards.<br></br>
        •	All financial transactions are logged and available to users for review.<br></br>
      </p>;
    case "liability":
      return <p style={{ fontFamily: "Oswald" }} className="text-lg text-gray-700 leading-relaxed">
        GreatHire strives to provide a secure, efficient, and reliable platform but cannot guarantee uninterrupted or error-free operation.<br></br>

        • We are not liable for delays, interruptions, or technical issues beyond our control, including internet outages or force majeure events.<br></br>
        • The platform is provided on an "as is" and "as available" basis, and users assume all risks associated with its use.  <br></br>
        • GreatHire is not responsible for the accuracy or reliability of user-generated content or recruiter postings.  <br></br>
        • No guarantees are made regarding job outcomes, interview offers, or hiring decisions.  <br></br>
        • We disclaim liability for damages caused by user negligence, misuse, or failure to follow platform guidelines.<br></br>
        • Indirect, incidental, or consequential damages, including loss of income or data, are excluded to the fullest extent permitted by law.<br></br>
        • Liability is limited to the amount paid by the user in the preceding 12 months, if applicable.  <br></br>
        • GreatHire is not responsible for unauthorized access due to weak passwords or shared credentials.  <br></br>
        • Content or services accessed via third-party links are not our responsibility.  <br></br>
        • Users agree to indemnify GreatHire against claims arising from misuse of the platform.  <br></br>
        • The platform may change or discontinue without prior notice, and we are not liable for resulting inconvenience.<br></br>

        These limitations apply to the maximum extent allowed by law. Certain jurisdictions may have exceptions to these terms.
      </p>;
    case "dispute":
      return <p style={{ fontFamily: "Oswald" }} className="text-lg text-gray-700 leading-relaxed">
        GreatHire is committed to resolving disputes fairly, promptly, and in good faith.<br></br>

        • Users should first contact our support team for informal resolution of concerns.  <br></br>
        • If unresolved within 30 days, formal proceedings may be initiated.  <br></br>
        • Disputes are governed by the laws of GreatHire's headquarters jurisdiction unless otherwise required by law. <br></br>
        • Binding arbitration is required for dispute resolution, except where legally exempt.  <br></br>
        • Arbitration will be conducted in English by a recognized arbitration body.  <br></br>
        • Each party bears its own legal fees unless otherwise decided by the arbitrator.  <br></br>
        • Class actions or collective claims against GreatHire are not permitted.  <br></br>
        • Claims must be filed within one year of the event giving rise to the dispute.  <br></br>
        • Exceptions to arbitration include intellectual property disputes or injunctive relief.  <br></br>
        • Arbitration decisions are final and enforceable in competent courts.  <br></br>
        • Users may pursue data-related complaints with relevant privacy authorities.  <br></br>
        • Complaints must be submitted in writing with supporting details.  <br></br>
        • GreatHire may seek equitable relief to prevent unauthorized platform use or violations.<br></br>

        We encourage respectful and transparent communication to ensure timely resolution.
      </p>;
    case "termination":
      return <p style={{ fontFamily: "Oswald" }} className="text-lg text-gray-700 leading-relaxed">
        GreatHire reserves the right to suspend or terminate user accounts for violations of our Terms, Privacy Policy, or community guidelines.<br></br>

        • Suspension may be temporary or permanent, based on the severity of violations.  <br></br>
        • Grounds for termination include fraudulent activity, harassment, spam, unauthorized data use, or security breaches.  <br></br>
        • Access may be suspended to prevent harm, investigate complaints, or ensure platform integrity.  <br></br>
        • Users will generally be notified of suspension or termination unless restricted by legal obligations.  <br></br>
        • Inactive accounts may be deactivated after prolonged periods, with prior notice where feasible.  <br></br>
        • Users can terminate their accounts anytime via platform settings.  <br></br>
        • Upon termination, access to the platform and stored data will be revoked.  <br></br>
        • Certain data may be retained post-termination for legal or regulatory purposes.  <br></br>
        • Termination does not absolve users of liabilities incurred before account closure.  <br></br>
        • Appeals for reinstatement must include clear explanations and evidence.  <br></br>
        • GreatHire reserves the right to deny appeals if violations are confirmed.  <br></br>
        • Continued attempts to access the platform after termination may result in legal consequences.<br></br>

        We aim to handle all suspension and termination actions fairly and transparently.
      </p>;
    case "compliance":
      return <p style={{ fontFamily: "Oswald" }} className="text-lg text-gray-700 leading-relaxed">
        GreatHire complies with all applicable international, national, and regional laws and regulations.<br></br>

        • Users must ensure their platform usage aligns with the legal requirements of their location.  <br></br>
        • We cooperate with regulatory and law enforcement authorities when legally required.  <br></br>
        • User data may be disclosed upon valid legal requests, such as subpoenas or court orders.  <br></br>
        • GreatHire adheres to employment laws, data protection regulations, and anti-discrimination statutes.<br></br>
        • Prohibited content and behavior are monitored to ensure compliance with legal and ethical standards.  <br></br>
        • Platform features are developed and updated to reflect compliance obligations.  <br></br>
        • Regular internal reviews are conducted to maintain legal alignment.  <br></br>
        • Users are responsible for understanding and abiding by applicable laws.  <br></br>
        • Region-specific policy updates are provided where required (e.g., GDPR, CCPA).  <br></br>
        • Compliance training is offered to staff handling sensitive operations.  <br></br>
        • Legal notices are issued to users when necessary.  <br></br>
        • Contracts with third parties include strict legal compliance clauses.<br></br>
        • Breaches of legal obligations may result in account restrictions or termination.<br></br>
      </p>;
    case "amendments":
      return <p style={{ fontFamily: "Oswald" }} className="text-lg text-gray-700 leading-relaxed">
        GreatHire may update its Terms of Use and Privacy Policy periodically to reflect legal, technological, or service-related changes.<br></br>

        • Significant updates will be communicated via email, platform alerts, or announcements.  <br></br>
        • Continued platform use after updates implies acceptance of the revised terms.  <br></br>
        • Minor changes may be applied without direct notification.  <br></br>
        • Users are encouraged to review the Terms regularly to stay informed.<br></br>
        • The effective date of the latest revision will always be displayed at the top of the policy.<br></br>
        • Users who disagree with updated terms must discontinue platform use.  <br></br>
        • Amendments may include updates to user responsibilities, privacy practices, or service guidelines.  <br></br>
        • In some jurisdictions, user consent may be required for specific changes.  <br></br>
        • Archived versions of past terms may be made available upon request.  <br></br>
        • Major revisions will be supported by FAQs or summaries for clarity.  <br></br>

        By continuing to use GreatHire, users agree to the most current version of these terms.
      </p>;
    case "contact":
      return <p style={{ fontFamily: "Oswald" }} className="text-lg text-gray-700 leading-relaxed">
        For any questions, concerns, or feedback regarding GreatHire’s Terms, Privacy Policy, or platform usage, please contact us:<br></br>

        <br></br>
        Phone: +91 9999999999 <br></br> 
        (Mon–Fri, 9 AM – 6 PM, local time)
        <a href=" support@greathire.com " className="text-blue-600 hover:text-blue-800 block mt-2"><b>Email : </b>support@greathire.com</a>
        <a href=" privacy@greathire.com " className="text-blue-600 hover:text-blue-800 block mt-2"><b>Privacy inquiries : </b> privacy@greathire.com     </a>
        <br></br>

        Additional Information:<br></br>

        • Requests related to data access, deletion, or rights under data protection laws can be submitted via your account dashboard or the privacy contact above.<br></br>
        • All inquiries will be acknowledged within a reasonable timeframe.<br></br>
        • For legal concerns, include relevant documentation or references in your communication.<br></br>
        • If unsatisfied with our response, you may escalate the issue to the relevant regulatory authority.<br></br>
        • Identity verification may be required for sensitive requests to protect user data.<br></br>
        • Suggestions and feedback to improve our services are always welcome.<br></br>
        • For media or partnership inquiries, contact: media@greathire.com<br></br>
      <br></br>
        Visit us: <br></br>
        <a href="https://greathire.in" className="text-blue-600 hover:text-blue-800 block mt-2"><b>Website : </b> https://greathire.in</a>
        <a href="mailto:hr@greathire.in" className="text-blue-600 hover:text-blue-800"><b>Email :</b> hr@greathire.in</a>

      </p>;
    default:
      return null;
  }
}

export default App;
