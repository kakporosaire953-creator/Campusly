"use client";

import { useId, type ChangeEvent, type ReactNode } from "react";

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children?: ReactNode;
}

function Wrapper({
  label,
  error,
  hint,
  required,
  htmlFor,
  children,
}: BaseProps & { htmlFor: string }) {
  return (
    <div className="form-group" style={{ marginBottom: 16 }}>
      <label className="form-label" htmlFor={htmlFor}>
        {label}
        {required ? <span aria-hidden="true" style={{ color: "var(--danger)" }}> *</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="form-hint">{hint}</p> : null}
      {error ? (
        <p className="form-error" id={`${htmlFor}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  label,
  error,
  hint,
  required,
  autoComplete,
  inputMode,
  maxLength,
  name,
  disabled,
}: BaseProps & {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password" | "tel" | "search" | "number";
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email" | "search";
  maxLength?: number;
  name?: string;
  disabled?: boolean;
}) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <Wrapper label={label} error={error} hint={hint} required={required} htmlFor={fieldId}>
      <input
        id={fieldId}
        name={name ?? fieldId}
        className="form-input"
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      />
    </Wrapper>
  );
}

export function SelectField<T extends string>({
  id,
  value,
  onChange,
  options,
  label,
  error,
  hint,
  required,
  placeholder,
}: BaseProps & {
  id?: string;
  value: T | "";
  onChange: (value: T) => void;
  options: ReadonlyArray<{ value: T; label: string }>;
  placeholder?: string;
}) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <Wrapper label={label} error={error} hint={hint} required={required} htmlFor={fieldId}>
      <select
        id={fieldId}
        className="form-select"
        value={value}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Wrapper>
  );
}

export function TextAreaField({
  id,
  value,
  onChange,
  placeholder,
  label,
  error,
  hint,
  required,
  rows = 5,
  maxLength,
}: BaseProps & {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <Wrapper label={label} error={error} hint={hint} required={required} htmlFor={fieldId}>
      <textarea
        id={fieldId}
        className="form-textarea"
        value={value}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
    </Wrapper>
  );
}
