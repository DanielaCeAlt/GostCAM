'use client';

import React, { useState, useId } from 'react';
import CameraScanner from './CameraScanner';

interface ScannableFieldProps {
  /** Label that appears above the input */
  label: string;
  /** Current value of the input */
  value: string;
  /** Called when the value changes (manual typing or successful scan) */
  onChange: (value: string) => void;
  /** HTML input name attribute */
  name?: string;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Extra classes applied to the wrapper div */
  className?: string;
  /** Input type – defaults to "text" */
  type?: React.HTMLInputTypeAttribute;
  /** Scanning mode passed to CameraScanner:
   *  - 'qr'   → QR codes + barcodes only (default)
   *  - 'ocr'  → OCR text recognition only
   *  - 'auto' → QR/barcode first, then OCR toggle available
   */
  scanMode?: 'qr' | 'ocr' | 'auto';
  /** Hint shown inside the camera scanner modal */
  scannerPlaceholder?: string;
  /** Hint shown below the input */
  hint?: string;
}

/**
 * ScannableField
 *
 * A fully reusable form field that combines a standard text input with a
 * camera-scan button. When the user presses "Escanear", the `CameraScanner`
 * modal opens; on a successful read the decoded value is inserted into the
 * field and the modal closes automatically.
 *
 * Usage:
 * ```tsx
 * <ScannableField
 *   label="Número de Serie"
 *   value={formData.no_serie}
 *   onChange={(v) => handleChange('no_serie', v)}
 *   required
 * />
 * ```
 */
export default function ScannableField({
  label,
  value,
  onChange,
  name,
  placeholder = '',
  required = false,
  disabled = false,
  className = '',
  type = 'text',
  scanMode = 'qr',
  scannerPlaceholder = 'Centra el código QR o código de barras',
  hint,
}: ScannableFieldProps) {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [lastScanType, setLastScanType] = useState<string | null>(null);
  const inputId = useId();

  const handleScanResult = (result: string, type: 'qr' | 'barcode' | 'ocr') => {
    onChange(result);
    setLastScanType(type);
    setScannerOpen(false);
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastScanType(null);
    onChange(e.target.value);
  };

  const scanTypeBadge: Record<string, { label: string; color: string }> = {
    qr: { label: 'QR', color: 'bg-indigo-100 text-indigo-700' },
    barcode: { label: 'Código de barras', color: 'bg-green-100 text-green-700' },
    ocr: { label: 'OCR', color: 'bg-amber-100 text-amber-700' },
  };

  const badge = lastScanType ? scanTypeBadge[lastScanType] : null;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {/* Label */}
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
      </label>

      {/* Input + Scan button row */}
      <div className="flex items-stretch gap-2">
        <div className="relative flex-1">
          <input
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={handleManualChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            autoComplete="off"
            className="
              w-full px-3 py-2 border border-gray-300 rounded-md
              text-sm text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              transition-colors
            "
          />
          {/* Scan-type badge shown inside the input when value came from camera */}
          {badge && value && (
            <span
              className={`
                absolute right-2 top-1/2 -translate-y-1/2
                text-xs font-medium px-2 py-0.5 rounded-full
                pointer-events-none select-none
                ${badge.color}
              `}
            >
              {badge.label}
            </span>
          )}
        </div>

        {/* Scan button */}
        <button
          type="button"
          onClick={() => setScannerOpen(true)}
          disabled={disabled}
          aria-label={`Escanear ${label}`}
          title={`Escanear ${label} con la cámara`}
          className="
            inline-flex items-center gap-1.5 px-3 py-2
            bg-blue-600 text-white text-sm font-medium rounded-md
            hover:bg-blue-700 active:bg-blue-800
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors whitespace-nowrap select-none
          "
        >
          {/* Camera icon (inline SVG – no icon library required) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 shrink-0"
            aria-hidden="true"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span className="hidden sm:inline">Escanear</span>
        </button>
      </div>

      {/* Hint text */}
      {hint && (
        <p className="text-xs text-gray-500 mt-0.5">{hint}</p>
      )}

      {/* Camera Scanner modal */}
      {scannerOpen && (
        <CameraScanner
          mode={scanMode}
          onResult={handleScanResult}
          onClose={() => setScannerOpen(false)}
          placeholder={scannerPlaceholder}
        />
      )}
    </div>
  );
}
