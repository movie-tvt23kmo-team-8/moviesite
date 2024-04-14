import React from "react";

function Password({ value, onChange, placeholder }) {
  return (
    <input
      type="password"
      name="password"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete="current-password"
    />
  );
}

export default Password;
