import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const CompanyPhoneInput = ({ value, onChange }) => {
  const isValidPhone = (phone) => {
    if (!phone) return null;

    try {
      return parsePhoneNumberFromString(phone)?.isValid() ?? false;
    } catch {
      return false;
    }
  };

  const isValid = value?.length > 4 ? isValidPhone(value) : null;

  return (
    <div className="w-full">
      <PhoneInput
        defaultCountry="in"
        value={value}
        forceDialCode
        showDisabledDialCodeAndPrefix={false}
        className="gh-phone"
        onChange={(phone, country) => {
          const e164 = phone.startsWith("+") ? phone : `+${phone}`;

          const dialCode = country?.dialCode
            ? `+${country.dialCode}`
            : "";

          const countryIso =
            country?.iso2?.toUpperCase() ||
            country?.country?.iso2?.toUpperCase() ||
            "";

          onChange(e164, dialCode, countryIso);
        }}
      />

      {isValid === false && (
        <p className="mt-2 text-red-500 text-sm">
          Please enter a valid phone number.
        </p>
      )}

      <style>{`
        .gh-phone{
          width:100%;
        }

        .gh-phone .react-international-phone-input-container{
          width:100%;
        }

        .gh-phone .react-international-phone-country-selector-button{
          height:48px;
          background:#ffffff;
          color:#111827;
          border:1px solid #cbd5e1;
          border-right:none;
          border-radius:10px 0 0 10px;
        }

        .gh-phone .react-international-phone-input{
          width:100%;
          height:48px;
          background:#ffffff;
          color:#111827;
          border:1px solid #cbd5e1;
          border-radius:0 10px 10px 0;
          font-size:15px;
        }

        .gh-phone .react-international-phone-input:focus,
        .gh-phone .react-international-phone-country-selector-button:focus-within{
          outline:none !important;
          border-color:#a855f7 !important;
          box-shadow:0 0 0 4px rgba(168,85,247,.12) !important;
        }

        .gh-phone .react-international-phone-input-container:focus-within{
          border-radius:10px;
          box-shadow:0 0 0 4px rgba(168,85,247,.12);
        }

        .gh-phone .react-international-phone-input-container:focus-within
        .react-international-phone-country-selector-button{
          border-color:#a855f7 !important;
        }

        .gh-phone .react-international-phone-country-selector-dropdown{
          background:#ffffff;
          color:#111827;
        }

        .dark .gh-phone .react-international-phone-country-selector-button{
          background:#0f172a;
          color:#ffffff;
          border-color:rgba(148,163,184,.35);
        }

        .dark .gh-phone .react-international-phone-input{
          background:#0f172a;
          color:#ffffff;
          border-color:rgba(148,163,184,.35);
        }

        .dark .gh-phone .react-international-phone-country-selector-dropdown{
          background:#111827;
          color:#ffffff;
        }

        .gh-phone .react-international-phone-input::placeholder{
          color:#64748b;
        }

        .dark .gh-phone .react-international-phone-input::placeholder{
          color:#94a3b8;
        }
      `}</style>
    </div>
  );
};

export default CompanyPhoneInput;