import { parsePhoneNumberFromString } from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// Real-time validation using libphonenumber-js — same library as backend
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
  // value is stored as E.164 e.g. "+919876543210", strip + for the library
  const rawValue = value?.replace("+", "") || "";

  // Derive country ISO from current value for live validation indicator
  const isValid = rawValue.length > 4 ? isValidForCountry(rawValue, null) : null;

  return (
    <div className="w-full">
      <PhoneInput
        country={"in"}
        value={rawValue}
        onChange={(phone, country) => {
          // phone from library may have formatting like "91 95038-13287"
          // Strip ALL non-digits, then prefix with +
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
          border: `1px solid ${isValid === false ? "#ef4444" : isValid === true ? "#22c55e" : "#d1d5db"}`,
          fontSize: "14px",
          paddingLeft: "52px",
          transition: "border-color 0.2s",
        }}
        buttonStyle={{
          borderTopLeftRadius: "8px",
          borderBottomLeftRadius: "8px",
          border: `1px solid ${isValid === false ? "#ef4444" : isValid === true ? "#22c55e" : "#d1d5db"}`,
          backgroundColor: "#fff",
        }}
        dropdownStyle={{ maxHeight: "300px", width: "320px" }}
      />
      {isValid === true && (
        <p className="mt-1 text-xs text-green-500">✔ Valid phone number</p>
      )}
    </div>
  );
};

export default CompanyPhoneInput;
