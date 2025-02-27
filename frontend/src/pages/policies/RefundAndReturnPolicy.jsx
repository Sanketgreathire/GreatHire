// Importing React and useState for state management
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const RefundAndReturnPolicy = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div className="flex flex-col gap-2 w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 w-full mt-2 ">
          Refund and Return Policy
        </h1>

        {/* Overview */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-200 text-blue-700 p-2">
            Overview
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md">
            Our refund and returns policy lasts 1 hour. If 1 hour have passed
            since your purchase, we can’t offer you a full refund or exchange.
          </p>
          <p className="text-gray-600 mt-2 p-2 text-md">
            To be eligible for a return, your item must be unused and in the
            same condition that you received it.
          </p>
          <p className="text-gray-600 mt-2 p-2 text-md">
            Several types of products are exempt from being returned. Courses
            such as recorded courses cannot be returned.
          </p>
          <p className="text-gray-600 mt-2 p-2 text-md">
            Additional non-returnable items:
          </p>
          <ul className="list-disc text-gray-600 mt-2 ml-10 text-md">
            <li>Recorded courses</li>
            <li>Downloadable products</li>
          </ul>
          <p className="text-gray-600 mt-2 p-2 text-md">
            To complete your return, we require a receipt or proof of purchase.
          </p>
        </section>

        {/* Refunds */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-200 text-blue-700 p-2">
            Refunds
          </h2>
          <p className="text-gray-600 mt-2 p-2 text-md">
            Once your return is received and inspected, we will send you an
            email to notify you that we have received your returned item. We
            will also notify you of the approval or rejection of your refund.
          </p>
          <p className="text-gray-600 mt-2 p-2 text-md">
            If you are approved, then your refund will be processed, and a
            credit will automatically be applied to your credit card or original
            method of payment, within a certain amount of days.
          </p>
          <p className="text-gray-600 mt-2 p-2 text-md">
            Several types of products are exempt from being returned. Courses
            such as recorded courses cannot be returned.
          </p>
          <p className="text-gray-600 font-bold mt-2 p-2 text-md">
            Late or missing refunds
          </p>
          <p className="text-gray-600 p-2 text-md">
            If you haven’t received a refund yet, first check your bank account
            again. Then contact your credit card company, it may take some time
            before your refund is officially posted. Next contact your bank.
            There is often some processing time before a refund is posted. If
            you’ve done all of this and you still have not received your refund
            yet, please contact us at{" "}
            <span
              onClick={() => navigate("/contact-us")}
              className="text-blue-500 cursor-pointer"
            >
              contact.GreatHire.in
            </span>
            .
          </p>
          <p className="text-gray-600 mt-2 p-2 text-md">
            <h2 className="text-gray-600 font-bold p-2 text-md">Sale items</h2>
            <span className="text-gray-600 p-2 text-md">
              Only regular priced items may be refunded. Sale items cannot be
              refunded.
            </span>
          </p>
        </section>

        {/* Exchanges */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-200 text-blue-700 p-2">
            Exchanges
          </h2>
          <p className="text-gray-600 p-2 text-md">
            We only replace items if they are defective or damaged. If you need
            to exchange it for the same item, send us an email at{" "}
            <span
              onClick={() => navigate("/contact-us")}
              className="text-blue-500 cursor-pointer"
            >
              contact.GreatHire.in
            </span>
            .
          </p>
        </section>

        {/* Shipping returns */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-200 text-blue-700 p-2">
            Shipping returns
          </h2>
          <p className="text-gray-600 p-2 text-md">
            To return your product, you should mail your product to{" "}
            <span
              onClick={() => navigate("/contact-us")}
              className="text-blue-500 cursor-pointer"
            >
              contact.GreatHire.in
            </span>
            .
          </p>

          <p className="text-gray-600 mt-2 p-2 text-md">
            You will be responsible for paying for your own shipping costs for
            returning your item. Shipping costs are non-refundable. If you
            receive a refund, the cost of return shipping will be deducted from
            your refund.
          </p>

          <p className="text-gray-600 mt-2 p-2 text-md">
            Depending on where you live, the time it may take for your exchanged
            product to reach you may vary.
          </p>

          <p className="text-gray-600 mt-2 p-2 text-md">
            If you are returning more expensive items, you may consider using a
            trackable shipping service or purchasing shipping insurance. We
            don’t guarantee that we will receive your returned item.
          </p>
        </section>

        {/* Need help? */}
        <section className="bg-white border rounded-lg shadow-md m-2">
          <h2 className="font-semibold text-xl bg-blue-200 text-blue-700 p-2">
            Need help?
          </h2>
          <p className="text-gray-600 p-2 text-md">
            Contact us at{" "}
            <span
              onClick={() => navigate("/contact-us")}
              className="text-blue-500 cursor-pointer"
            >
              contact.GreatHire.in
            </span>{" "}
            for questions related to refunds and returns.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default RefundAndReturnPolicy;
