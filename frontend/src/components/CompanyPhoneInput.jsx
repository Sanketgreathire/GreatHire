import { parsePhoneNumberFromString } from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useEffect, useState } from "react";

const isValidForCountry = (phone, countryIso) => {
  if (!phone) return null;
  try {
    const parsed = parsePhoneNumberFromString("+" + phone, countryIso?.toUpperCase());
    return parsed?.isValid() ?? false;
  } catch {
    return false;
  }
};

const CompanyPhoneInput = ({ value, onChange }) => {
  const rawValue = value?.replace("+", "") || "";
  const isValid = rawValue.length > 4 ? isValidForCountry(rawValue, null) : null;

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const borderColor = isValid === false ? "#ef4444" : isValid === true ? "#22c55e" : isDark ? "#4b5563" : "#d1d5db";

  return (
    <div className="w-full">
      <PhoneInput
        country={"in"}
        value={rawValue}
        onChange={(phone, country) => {
          const cleaned = phone.replace(/\D/g, "");
          const e164 = `+${cleaned}`;
          onChange(e164, "+" + country.dialCode, country.countryCode?.toUpperCase());
        }}
        enableSearch={true}
        countryCodeEditable={false}
        placeholder="Enter phone number"
        inputStyle={{
          width: "100%",
          height: "42px",
          borderRadius: "8px",
          border: `1px solid ${borderColor}`,
          fontSize: "14px",
          paddingLeft: "52px",
          transition: "border-color 0.2s",
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f3f4f6" : "#111827",
        }}
        buttonStyle={{
          borderTopLeftRadius: "8px",
          borderBottomLeftRadius: "8px",
          border: `1px solid ${borderColor}`,
          backgroundColor: isDark ? "#374151" : "#ffffff",
        }}
        dropdownStyle={{
          maxHeight: "300px",
          width: "320px",
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f3f4f6" : "#111827",
        }}
      />
    </div>
  );
};

export default CompanyPhoneInput;
