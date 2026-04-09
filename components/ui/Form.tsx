'use client'

import React from 'react'

// ── Form Field Wrapper ────────────────────────────

interface FormFieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}

export function FormField({ id, label, required, error, hint, children }: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
        {label}
        {required && <span className="form-field__required" aria-label="required"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="form-field__error" role="alert" aria-live="polite">
          {error}
        </p>
      )}
      {hint && !error && <p className="form-field__hint">{hint}</p>}

      <style jsx>{`
        .form-field { display: flex; flex-direction: column; gap: 0.375rem; }
        .form-field__label {
          font-size: var(--font-label-large-size);
          font-weight: var(--font-label-large-weight);
          color: var(--color-on-surface);
          line-height: 1.4;
        }
        .form-field__required { color: var(--color-error); }
        .form-field__error {
          font-size: var(--font-label-medium-size);
          color: var(--color-error);
          margin: 0;
        }
        .form-field__hint {
          font-size: var(--font-label-medium-size);
          color: var(--color-on-surface-variant);
          margin: 0;
        }
      `}</style>
    </div>
  )
}

// ── Input ─────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  error?: string
}

export function Input({ id, error, className = '', ...props }: InputProps) {
  return (
    <>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`ss-input ${error ? 'ss-input--error' : ''} ${className}`}
        {...props}
      />
      <style jsx>{`
        .ss-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1.5px solid var(--color-outline-variant);
          border-radius: 0.5rem;
          background-color: var(--color-surface);
          color: var(--color-on-surface);
          font-family: inherit;
          font-size: var(--font-body-large-reg-size);
          font-weight: var(--font-body-large-reg-weight);
          line-height: 1.5;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          outline: none;
        }
        .ss-input::placeholder { color: var(--color-on-surface-variant); opacity: 0.7; }
        .ss-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(255,91,4,0.12); }
        .ss-input--error { border-color: var(--color-error); }
        .ss-input--error:focus { border-color: var(--color-error); box-shadow: 0 0 0 3px rgba(242,13,13,0.12); }
        .ss-input:disabled { background-color: var(--color-surface-container); opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </>
  )
}

// ── Textarea ──────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  error?: string
}

export function Textarea({ id, error, className = '', ...props }: TextareaProps) {
  return (
    <>
      <textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`ss-textarea ${error ? 'ss-textarea--error' : ''} ${className}`}
        {...props}
      />
      <style jsx>{`
        .ss-textarea {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1.5px solid var(--color-outline-variant);
          border-radius: 0.5rem;
          background-color: var(--color-surface);
          color: var(--color-on-surface);
          font-family: inherit;
          font-size: var(--font-body-large-reg-size);
          line-height: 1.5;
          resize: vertical;
          min-height: 5rem;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          outline: none;
        }
        .ss-textarea:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(255,91,4,0.12); }
        .ss-textarea--error { border-color: var(--color-error); }
      `}</style>
    </>
  )
}

// ── Select ────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string
  error?: string
}

export function Select({ id, error, className = '', children, ...props }: SelectProps) {
  return (
    <>
      <select
        id={id}
        aria-invalid={!!error}
        className={`ss-select ${error ? 'ss-select--error' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      <style jsx>{`
        .ss-select {
          width: 100%;
          padding: 0.625rem 2rem 0.625rem 0.875rem;
          border: 1.5px solid var(--color-outline-variant);
          border-radius: 0.5rem;
          background-color: var(--color-surface);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2372838d' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          appearance: none;
          color: var(--color-on-surface);
          font-family: inherit;
          font-size: var(--font-body-large-reg-size);
          cursor: pointer;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .ss-select:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(255,91,4,0.12); }
        .ss-select--error { border-color: var(--color-error); }
      `}</style>
    </>
  )
}
