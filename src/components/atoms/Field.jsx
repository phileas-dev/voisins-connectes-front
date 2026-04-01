import React from "react";

function Field({
    name,
    type = "text",
    placeholder = "",
    required = false,
    accept = "",
    value = "",
    onChange = () => {},
    label,
    error,
}) {
    return (
    <div className="field">
        {label && (
        <label htmlFor={name} className="field-label">
            {label}
            {required ? " *" : ""}
        </label>
        )}
        <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            required={required}
            accept={accept}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="field-input"
        />
        {error && <div className="field-error">{error}</div>}
    </div>
    );
}

export default Field;
