import React from "react";
import PhoneInput from "react-phone-number-input";

const PhoneField = () => {
  return (
    <div>
      <PhoneInput
        international
        countryCallingCodeEditable={false}
        defaultCountry="AU"
        value={value}
        onChange={setValue}
        countries={["AU", "US"]}
      />
    </div>
  );
};

export default PhoneField;
