import React from 'react';
import Navbar from "@/components/shared/Navbar"; // Navbar Module
import Footer from "@/components/shared/Footer"; // Footer Module
import {
  Shield,
  UserCheck,
  Lock,
  Eye,
  FileCheck,
  MessageSquare,
  Book,
  Target,
  Users,
  AlertTriangle,
  Cpu,
  Scale,
  Ban,
  DollarSign,
  HandshakeIcon,
  Building,
  ScrollText,
} from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 justify-center">
            <Shield className="h-8 w-8 text-blue-600" />
            Terms & Privacy Policy
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">

          {/* Policy Sections */}
          <div className="px-6 py-8 space-y-12">
            {/* Introduction Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-blue-600" />
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to GreatHire, a leading provider of HR staffing, recruitment services, and software development solutions. These terms and conditions govern your use of our services available at https://greathire.in. By accessing or using our platform, you agree to be bound by these terms.
              </p>
            </section>

            {/* Purpose Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-600" />
                Purpose
              </h2>
              <p className="text-gray-700 leading-relaxed">
                GreatHire's platform connects talented professionals with leading organizations in the technology sector. We facilitate recruitment processes, provide HR staffing solutions, and deliver custom software development services to meet the evolving needs of businesses.
              </p>
            </section>

            {/* Eligibility Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                Eligibility
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are available to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                <li>Job seekers who are legally eligible to work in their desired location</li>
                <li>Organizations legally registered and operating in their respective jurisdictions</li>
                <li>Individuals aged 18 years or older</li>
                <li>Entities seeking IT staffing and software development services</li>
              </ul>
            </section>

            {/* User Participation Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Book className="h-6 w-6 text-blue-600" />
                User Participation
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Users are expected to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                <li>Provide accurate and current information</li>
                <li>Maintain profile confidentiality</li>
                <li>Engage professionally with other users</li>
                <li>Report any suspicious or inappropriate behavior</li>
              </ul>
            </section>

            {/* Usage Restrictions Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
                Usage Restrictions
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Users must not:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                <li>Share false or misleading information</li>
                <li>Attempt to bypass platform security measures</li>
                <li>Scrape or collect user data without authorization</li>
                <li>Use the platform for any illegal purposes</li>
              </ul>
            </section>

            {/* Intellectual Property Rights Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Cpu className="h-6 w-6 text-blue-600" />
                Intellectual Property Rights
              </h2>
              <p className="text-gray-700 leading-relaxed">
                All content, including software, designs, logos, and documentation on GreatHire's platform is protected by intellectual property rights. Users retain ownership of their submitted content while granting GreatHire necessary licenses to provide our services.
              </p>
            </section>

            {/* Privacy and Data Protection Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6 text-blue-600" />
                Privacy and Data Protection
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We prioritize the protection of your personal and professional information. Our data handling practices comply with relevant privacy laws and industry standards. We implement robust security measures to protect against unauthorized access and data breaches.
              </p>
            </section>

            {/* Third-Party Links and Services Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-blue-600" />
                Third-Party Links and Services
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our platform may contain links to third-party services. GreatHire is not responsible for the content or privacy practices of these external services. Users access third-party services at their own risk.
              </p>
            </section>

            {/* Security and Account Responsibilities Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                Security and Account Responsibilities
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Users are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                <li>Maintaining account security credentials</li>
                <li>Reporting unauthorized access</li>
                <li>Ensuring device and network security</li>
                <li>Logging out from shared devices</li>
              </ul>
            </section>

            {/* Payment and Refund Policy Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-blue-600" />
                Payment and Refund Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                For our recruitment and software development services, we maintain transparent pricing. Refunds are handled on a case-by-case basis according to the terms of individual service agreements and applicable laws.
              </p>
            </section>

            {/* Limitation of Liability Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Scale className="h-6 w-6 text-blue-600" />
                Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                GreatHire's liability is limited to the extent permitted by law. We are not liable for indirect damages, loss of profits, or consequences of platform unavailability.
              </p>
            </section>

            {/* Dispute Resolution Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HandshakeIcon className="h-6 w-6 text-blue-600" />
                Dispute Resolution
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Any disputes will be resolved through:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                <li>Initial informal negotiation</li>
                <li>Formal mediation if necessary</li>
                <li>Binding arbitration as a last resort</li>
              </ul>
            </section>

            {/* Termination and Suspension Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Ban className="h-6 w-6 text-blue-600" />
                Termination and Suspension
              </h2>
              <p className="text-gray-700 leading-relaxed">
                GreatHire reserves the right to suspend or terminate accounts that violate our terms, engage in fraudulent activities, or pose risks to our community. Users may terminate their accounts at any time.
              </p>
            </section>

            {/* Compliance with Local Laws Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="h-6 w-6 text-blue-600" />
                Compliance with Local Laws
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Users must comply with all applicable local, state, and national laws while using our platform. This includes employment laws, data protection regulations, and industry-specific requirements.
              </p>
            </section>

            {/* Amendments to Terms Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ScrollText className="h-6 w-6 text-blue-600" />
                Amendments to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                GreatHire may update these terms periodically. Users will be notified of significant changes, and continued use of the platform constitutes acceptance of modified terms.
              </p>
            </section>

            {/* Conditions for Job Seekers */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileCheck className="h-6 w-6 text-blue-600" />
                Conditions for Job Seekers
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Job seekers must:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                <li>Provide accurate professional information</li>
                <li>Maintain current availability status</li>
                <li>Respect confidentiality of employer information</li>
                <li>Attend scheduled interviews professionally</li>
              </ul>
            </section>

            {/* Conditions for Recruiters */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                Conditions for Recruiters
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Recruiters must:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                <li>Post accurate job descriptions</li>
                <li>Maintain confidentiality of candidate data</li>
                <li>Follow fair hiring practices</li>
                <li>Provide timely feedback to candidates</li>
              </ul>
            </section>

            {/* Contact and Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                Contact and Information
              </h2>
              <p className="text-gray-700 leading-relaxed">
                For questions or concerns about these terms, please contact us at:
                <br />
                <a href="https://greathire.in" className="text-blue-600 hover:text-blue-800 block mt-2">Website: https://greathire.in</a>
                <a href="mailto:hr@greathire.in" className="text-blue-600 hover:text-blue-800">Email: hr@greathire.in</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;