import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { recruiterFaqs } from "../data/recruiterFaqs";

function RecruiterFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-10">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {recruiterFaqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-gray-300 pb-4"
          >
            <button
              className="w-full flex justify-between items-center text-left font-medium text-lg"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <ChevronDown
                className={`transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {openIndex === index && (
              <p className="mt-3 text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecruiterFAQ;
