// Importing React and useState for state management
import React from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const PrivacyPolicy = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col gap-2 w-full">
      <h1 className="text-2xl font-bold text-center text-gray-700 w-full mt-2 underline">
          Everything You Need To Know!
        </h1>
        <h1 className="text-2xl font-bold text-center text-blue-500 w-full mt-2 underline">
          Privacy, Refund and Returns Policy & Terms and Conditions
        </h1>

        {/* Introduction */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-50 text-black p-2">
          INTRODUCTION
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md text-justify">
          Welcome to the Greathire platform, operated by Greathire Inc. ("Greathire") and its affiliates. By accessing our website and mobile application (collectively, "Platform"), you agree to comply with these Terms of Service ("Terms"). These Terms constitute a legally binding agreement between you ("User") and Greathire. <br />
          <span className="font-semibold text-gray-700">Our website address is : </span>
            <a href="http://greathire.in" className="text-blue-500 font-semibold underline">
              http://greathire.in
            </a>
            .
          </p>
        </section>

        {/* Purpose */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-50 text-black p-2">
          PURPOSE
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md text-justify">
          The Platform connects job seekers and recruiters to facilitate employment-related interactions. Greathire serves as an intermediary and does not guarantee job placements.
          </p>
        </section>

        {/* Eligibility */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-50 text-black p-2">
          ELIGIBILITY
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md text-justify">
          Users must be at least 18 years old and legally eligible to apply for job.
          </p>
        </section>

        {/* User Participation */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-50 text-black p-2">
          USER PARTICIPATION
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md text-justify">
          Users may apply for jobs by submitting accurate information regarding their qualifications, experience, and skills. Providing false or misleading information may result in account suspension or termination.
          </p>
        </section>

        {/* Usage Restrictions */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-50 text-black p-2">
          USAGE RESTRICTIONS
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md text-justify">
          <span className="font-semibold text-lg text-red-700">Users agree not to :</span><br />
          
          <span className="font-semibold">a.</span> Engage in fraudulent, abusive, or disruptive activities. <br />
          <span className="font-semibold">b.</span> Violate any applicable local laws or regulations. <br />
          <span className="font-semibold">c.</span> Perform unauthorized access, hacking, data mining, or spamming. <br />
          <span className="font-semibold">d.</span> Resell, distribute, or exploit platform services for commercial gain. <br />
          </p>
        </section>

        {/* Intellectual Property Rights */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-50 text-black p-2">
          INTELLECTUAL PROPERTY RIGHTS
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md text-justify">
          All content, graphics, software, and intellectual property on the Platform are owned by Greathire and its licensors. Users are granted a limited, non-transferable license to use the Platform and must not reproduce, modify, or distribute materials without written consent.
          </p>
        </section>

        {/* Privacy and Data Protection */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-50 text-black p-2">
          PRIVACY AND DATA PROTECTION
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md text-justify">
          User data is collected and managed in accordance with Greathire's Privacy Policy. Personal information will not be shared without consent. Misuse of shared data may result in account suspension.
          </p>
        </section>

        {/* Third-Party Links and Services */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-50 text-black p-2">
          THIRD-PARTY LINKS AND SERVICES
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md text-justify">
          The Platform may include links to third-party websites and services. Greathire does not endorse or control these third-party entities and is not responsible for any transactions or losses resulting from their use.
          </p>
        </section>

        {/* Security and Account Responsibilities */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-50 text-black p-2">
          SECURITY AND ACCOUNT RESPONSIBILITIES
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md text-justify">
          Users must maintain the confidentiality of their login credentials. Any unauthorized access or suspected security breaches must be reported immediately to Greathire.
          </p>
        </section>

        {/* Payment and Refund Policy */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-50 text-black p-2">
          PAYMENT AND REFUND POLICY
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md text-justify">
          Paid services must be purchased in advance. Payments are non-refundable unless explicitly stated otherwise. Refund requests, if applicable, will be considered at Greathire’s sole discretion.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-50 text-black p-2">
          LIMITATION OF LIABILITY
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md text-justify">
          Greathire provides services "as is" without warranties regarding uptime, security, or accuracy. Greathire is not liable for any indirect, incidental, or consequential damages. Liability, if any, is limited to the amount of fees paid by the User.
          </p>
        </section>

        {/* Dispute Resolution */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-50 text-black p-2">
          DISPUTE RESOLUTION
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md text-justify">
          Any disputes arising from these Terms will be resolved through arbitration in Hyderabad, India, in accordance with the Arbitration & Conciliation Act, 1996. The governing law shall be Indian law, and the language of arbitration will be English.
          </p>
        </section>

        {/* Termination and Suspension */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-50 text-black p-2">
          TERMINATION AND SUSPENSION
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md text-justify">
          Greathire reserves the right to suspend or terminate access if a User violates these Terms. Upon termination, all rights granted to the User will cease immediately, and any confidential information must be returned or destroyed.
          </p>
        </section>

        {/* Compliance with Local Laws */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-50 text-black p-2">
          COMPLIANCE wWITH LOCAL LAWS
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md text-justify">
          Users must adhere to all applicable laws and regulations, including tax obligations such as GST or VAT. Any discrepancies in tax details are the User’s responsibility.
          </p>
        </section>

        {/* Amendments to Terms */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-50 text-black p-2">
          AMENDMENTS TO TERMS
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md text-justify">
          Greathire reserves the right to modify these Terms at any time. Users are encouraged to review the Terms periodically for updates.
          </p>
        </section>

        {/* Conditions for Job Seekers */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-50 text-black p-2">
          CONDITIONS FOR JOB SEEKERS
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md text-justify">
          By registering, job seekers agree to receive job alerts and promotional communications. They may adjust their preferences at any time. Greathire is not liable for any communications received from recruiters.
          </p>
        </section>

        {/* Conditions for Recruiters */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-50 text-black p-2">
          CONDITIONS FOR RECRUITERS
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md text-justify">
          Recruiters must post genuine job openings and comply with applicable data protection laws. Resumes accessed through the Platform must be used solely for recruitment purposes and not for unauthorized data sharing.
          </p>
        </section>

        {/* Contact Information */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-50 text-black p-2">
          CONTACT INFORMATION
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md text-justify">
          <span className="font-semibold text-lg text-blue-600">For support, inquiries, or complaints, Users may contact Greathire at :</span> <br />
          <span className="font-semibold">Email : <a href="mailto:Hr@greathire.in" className="text-blue-500 underline">Hr@greathire.in</a></span>
          <span className="text-blue-600 underline"></span> <br />
          <span className="font-semibold">Address : </span>  
          <span className=" text-gray-700">
          5th Floor, Doc, Vasantha Bhavana Rd, Whitefields, Kondapur, Hyderabad, Telangana 500006
          </span> <br />
          By using the Greathire Platform, you acknowledge that you have read, understood, and agreed to these Terms of Service.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
