import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const CompanyPhoneInput = ({ value, onChange, wrapperClass = "" }) => {
  const rawValue = value || "+91";

  return (
    <div className={`w-full gh-phone gh-phone-field relative z-50 ${wrapperClass}`}>
      <PhoneInput
        defaultCountry="in"
        value={rawValue}
        forceDialCode
        disableDialCodeAndPrefix={false}
        countryCodeEditable={false}
        className="w-full"
        inputClassName="gh-phone-input"
        placeholder="Enter phone number"
        countrySelectorStyleProps={{
          dropdownStyle: {
            maxHeight: "180px",
            width: "100%",
            zIndex: 9999,
          },
        }}
        onChange={(phone, meta) => {
          const dialCode = `+${meta.country.dialCode}`;
          onChange(phone || "+91", dialCode, meta.country.iso2?.toUpperCase());
        }}
      />
    </div>
  );
};

export default CompanyPhoneInput;
