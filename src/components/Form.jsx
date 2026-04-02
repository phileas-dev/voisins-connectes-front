import { useState, useEffect } from "react";
import Field from "./atoms/Field";

function Form({ fields = [], submitLabel = "Submit", onSubmit }) {
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
    const initial = {};
    fields.forEach((f) => {
        initial[f.name] = f.initialValue ?? "";
    });
    setValues(initial);
    }, [fields]);

    const handleChange = (name, val) => {
        setValues((v) => ({ ...v, [name]: val }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        fields.forEach((f) => {
            if (f.required) {
                const v = values[f.name];
                if (v === undefined || v === null || v.toString().trim() === "") {
                    newErrors[f.name] = "This field is required";
                }
            }
        });
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            onSubmit?.(values);
        }
    };

    return (
    <form onSubmit={handleSubmit} className="dynamic-form" noValidate>
        {fields.map((f) => (
            <Field
                key={f.name}
                name={f.name}
                type={f.type}
                placeholder={f.placeholder}
                required={!!f.required}
                label={f.label}
                value={values[f.name] ?? ""}
                onChange={(val) => handleChange(f.name, val)}
                error={errors[f.name]}
            />
            ))}
        <button type="submit" className="form-submit">
            {submitLabel}
        </button>
    </form>
    );
}

export default Form;