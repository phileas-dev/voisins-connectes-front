import { useState } from 'react';

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
    showPasswordToggle = false,
}) {
    const [showPassword, setShowPassword] = useState(false);

    const displayType = showPasswordToggle && showPassword ? 'text' : type;

    return (
    <div className="form-field">
        {label && (
        <label htmlFor={name} className="field-label">
            {label}
            {required ? <span className="required"> *</span> : ""}
        </label>
        )}
        <div className="field-wrapper">
            <input
                id={name}
                name={name}
                type={displayType}
                placeholder={placeholder}
                required={required}
                accept={accept}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="field-input"
            />
            {showPasswordToggle && type === 'password' && (
                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? '🙈' : '👁️'}
                </button>
            )}
        </div>
        {error && <div className="field-error">{error}</div>}
    </div>
    );
}

export default Field;
