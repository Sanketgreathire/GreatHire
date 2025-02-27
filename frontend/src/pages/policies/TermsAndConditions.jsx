// Importing React and useState for state management
import React from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const TermsAndConditions = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col gap-2 w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 w-full mt-2 ">
          Terms and Conditions
        </h1>

        {/* Welcome to GreatHire Terms and Conditions */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-200 text-blue-700 p-2">
            Welcome to GreatHire Terms and Conditions
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md">
            By accessing this website we assume you accept these terms and
            conditions in full. Do not continue to use GreatHire website if you
            do not accept all of the terms and conditions stated on this page.
          </p>
          <p className="text-gray-600 mt-2 p-2 text-md">
            The following terminology applies to these Terms and Conditions,
            Privacy Statement and Disclaimer Notice and any or all Agreements:
            “Client”, “You” and “Your” refers to you, the person accessing this
            website and accepting the Company’s terms and conditions. “The
            Company”, “Ourselves”, “We”, “Our” and “Us”, refers to our Company.
            “Party”, “Parties”, or “Us”, refers to both the Client and
            ourselves, or either the Client or ourselves. All terms refer to the
            offer, acceptance and consideration of payment necessary to
            undertake the process of our assistance to the Client in the most
            appropriate manner, whether by formal meetings of a fixed duration,
            or any other means, for the express purpose of meeting the Client’s
            needs in respect of provision of the Company’s stated
            services/products, in accordance with and subject to, prevailing law
            of India. Any use of the above terminology or other words in the
            singular, plural, capitalisation and/or he/she or they, are taken as
            interchangeable and therefore as referring to same.
          </p>
        </section>

        {/* Cookies */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-200 text-blue-700 p-2">
            Cookies
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md">
            We employ the use of cookies. By using GreatHire website you consent
            to the use of cookies in accordance with GreatHire privacy policy.
          </p>
          <p className="text-gray-600 mt-2 p-2 text-md">
            Most of the modern day interactive web sites use cookies to enable
            us to retrieve user details for each visit. Cookies are used in some
            areas of our site to enable the functionality of this area and ease
            of use for those people visiting. Some of our affiliate /
            advertising partners may also use cookies.
          </p>
        </section>

        {/* License */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-200 text-blue-700 p-2">
            License
          </h2>
          <p className="text-gray-600 p-2 text-md">
            Unless otherwise stated, GreatHire and/or it’s licensors own the
            intellectual property rights for all material on GreatHire. All
            intellectual property rights are reserved. You may view and/or print
            pages from{" "}
            <a
              className="text-blue-500 cursor-pointer"
              href="https://GreatHire.in/"
            >
              https://GreatHire.in/
            </a>{" "}
            for your own personal use subject to restrictions set in these terms
            and conditions.
          </p>

          <p className="text-gray-600 mt-2 p-2 text-md">You must not:</p>
          <ul className="list-decimal ml-10 text-gray-600">
            <li>
              Republish material from{" "}
              <a
                className="text-blue-500 cursor-pointer"
                href="https://GreatHire.in/"
              >
                https://GreatHire.in/
              </a>{" "}
            </li>
            <li>
              Sell, rent or sub-license material from{" "}
              <a
                className="text-blue-500 cursor-pointer"
                href="https://GreatHire.in/"
              >
                https://GreatHire.in/
              </a>{" "}
            </li>
            <li>
              Reproduce, duplicate or copy material from{" "}
              <a
                className="text-blue-500 cursor-pointer"
                href="https://GreatHire.in/"
              >
                https://GreatHire.in/
              </a>{" "}
            </li>
          </ul>

          <p className="text-gray-600 mt-2 p-2 text-md">
            Redistribute content from GreatHire(unless content is specifically
            made for redistribution).
          </p>
        </section>

        {/* Hyperlinking to our Content */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-200 text-blue-700 p-2">
            Hyperlinking to our Content
          </h2>
          <p className="text-gray-600 p-2 text-md">
            <ul className="list-decimal ml-10 text-gray-600">
              <li>
                The following organizations may link to our Web site without
                prior written approval:
                <ul className="list-decimal ml-10 text-gray-600">
                  <li>overnment agencies;</li>
                  <li>Search engines;</li>
                  <li>News organizations;</li>
                  <li>
                    Systemwide Accredited Businesses except soliciting
                    non-profit organizations, charity shopping malls, and
                    charity fundraising groups which may not hyperlink to our
                    Web site.
                  </li>
                  <li>
                    Systemwide Accredited Businesses except soliciting
                    non-profit organizations, charity shopping malls, and
                    charity fundraising groups which may not hyperlink to our
                    Web site.
                  </li>
                </ul>
              </li>
              <li>
                These organizations may link to our home page, to publications
                or to other Web site information so long as the link: (a) is not
                in any way misleading; (b) does not falsely imply sponsorship,
                endorsement or approval of the linking party and its products or
                services; and (c) fits within the context of the linking party’s
                site.
              </li>

              <li>
                We may consider and approve in our sole discretion other link
                requests from the following types of organizations:
                <ul className="list-decimal ml-10 text-gray-600">
                  <li>
                    commonly-known consumer and/or business information sources
                    such as Chambers of Commerce, American Automobile
                    Association, AARP and Consumers Union;
                  </li>
                  <li>dot.com community sites;</li>
                  <li>
                    associations or other groups representing charities,
                    including charity giving sites,
                  </li>
                  <li>online directory distributors;</li>
                  <li>internet portals;</li>
                  <li>
                    accounting, law and consulting firms whose primary clients
                    are businesses; and
                  </li>
                  <li>educational institutions and trade associations.</li>
                </ul>
              </li>
            </ul>
          </p>

          <p className="text-gray-600 mt-2 p-2 text-md">
            We will approve link requests from these organizations if we
            determine that: (a) the link would not reflect unfavorably on us or
            our accredited businesses (for example, trade associations or other
            organizations representing inherently suspect types of business,
            such as work-at-home opportunities, shall not be allowed to link);
            (b)the organization does not have an unsatisfactory record with us;
            (c) the benefit to us from the visibility associated with the
            hyperlink outweighs the absence of ; and (d) where the link is in
            the context of general resource information or is otherwise
            consistent with editorial content in a newsletter or similar product
            furthering the mission of the organization.
          </p>

          <p className="text-gray-600 mt-2 p-2 text-md">
            These organizations may link to our home page, to publications or to
            other Web site information so long as the link: (a) is not in any
            way misleading; (b) does not falsely imply sponsorship, endorsement
            or approval of the linking party and it products or services; and
            (c) fits within the context of the linking party’s site.
          </p>

          <p className="text-gray-600 mt-2 p-2 text-md">
            If you are among the organizations listed in paragraph 2 above and
            are interested in linking to our website, you must notify us by
            sending an e-mail to info@greathire.in. Please include your name,
            your organization name, contact information (such as a phone number
            and/or e-mail address) as well as the URL of your site, a list of
            any URLs from which you intend to link to our Web site, and a list
            of the URL(s) on our site to which you would like to link. Allow 2-3
            weeks for a response.
          </p>

          <p className="text-gray-600 mt-2 p-2 text-md">
            Approved organizations may hyperlink to our Web site as follows:
          </p>

          <ul className="list-decimal ml-10 text-gray-600">
            <li>By use of our corporate name; or</li>
            <li>
              By use of the uniform resource locator (Web address) being linked
              to; or
            </li>
            <li>
              By use of any other description of our Web site or material being
              linked to that makes sense within the context and format of
              content on the linking party’s site.
            </li>
          </ul>
          <p className="text-gray-600 mt-2 p-2 text-md">
            No use of GreatHire logo or other artwork will be allowed for
            linking absent a trademark license agreement.
          </p>
        </section>

        {/* frames */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-200 text-blue-700 p-2">
            frames
          </h2>
          <p className="text-gray-600 p-2 text-md">
            Without prior approval and express written permission, you may not
            create frames around our Web pages or use other techniques that
            alter in any way the visual presentation or appearance of our Web
            site.
          </p>
        </section>

        {/* Reservation of Rights */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-200 text-blue-700 p-2">
            Reservation of Rights
          </h2>
          <p className="text-gray-600 p-2 text-md">
            We reserve the right at any time and in its sole discretion to
            request that you remove all links or any particular link to our Web
            site. You agree to immediately remove all links to our Web site upon
            such request. We also reserve the right to amend these terms and
            conditions and its linking policy at any time. By continuing to link
            to our Web site, you agree to be bound to and abide by these linking
            terms and conditions.
          </p>
        </section>

        {/* Removal of links from our website */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-200 text-blue-700 p-2">
            Removal of links from our website
          </h2>
          <p className="text-gray-600 p-2 text-md">
            If you find any link on our Web site or any linked web site
            objectionable for any reason, you may contact us about this. We will
            consider requests to remove links but will have no obligation to do
            so or to respond directly to you.
          </p>
          <p className="text-gray-600 p-2 text-md">
            Whilst we endeavour to ensure that the information on this website
            is correct, we do not warrant its completeness or accuracy; nor do
            we commit to ensuring that the website remains available or that the
            material on the website is kept up to date.
          </p>
        </section>

        {/* Content Liability */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-200 text-blue-700 p-2">
            Content Liability
          </h2>
          <p className="text-gray-600 p-2 text-md">
            We shall have no responsibility or liability for any content
            appearing on your Web site. You agree to indemnify and defend us
            against all claims arising out of or based upon your Website. No
            link(s) may appear on any page on your Web site or within any
            context containing content or materials that may be interpreted as
            libelous, obscene or criminal, or which infringes, otherwise
            violates, or advocates the infringement or other violation of, any
            third party rights.
          </p>
        </section>

        {/* frames */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-200 text-blue-700 p-2">
            Disclaimer
          </h2>
          <p className="text-gray-600 p-2 text-md">
            To the maximum extent permitted by applicable law, we exclude all
            representations, warranties and conditions relating to our website
            and the use of this website (including, without limitation, any
            warranties implied by law in respect of satisfactory quality,
            fitness for purpose and/or the use of reasonable care and skill).
            Nothing in this disclaimer will:
          </p>

          <ul className="list-decimal ml-10 text-gray-600">
            <li>
              limit or exclude our or your liability for death or personal
              injury resulting from negligence;
            </li>
            <li>
              limit or exclude our or your liability for fraud or fraudulent
              misrepresentation;
            </li>
            <li>
              limit any of our or your liabilities in any way that is not
              permitted under applicable law; or
            </li>
            <li>
              exclude any of our or your liabilities that may not be excluded
              under applicable law.
            </li>
          </ul>

          <p className="text-gray-600 p-2 text-md">
            The limitations and exclusions of liability set out in this Section
            and elsewhere in this disclaimer: (a) are subject to the preceding
            paragraph; and (b) govern all liabilities arising under the
            disclaimer or in relation to the subject matter of this disclaimer,
            including liabilities arising in contract, in tort (including
            negligence) and for breach of statutory duty.
          </p>

          <p className="text-gray-600 p-2 text-md">
            To the extent that the website and the information and services on
            the website are provided free of charge, we will not be liable for
            any loss or damage of any nature.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
