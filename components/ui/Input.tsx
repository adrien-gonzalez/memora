// components/ui/Input.tsx
'use client'

import React, { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="mb-1 text-sm text-[#7d8590]">{label}</label>}
      <input
        {...props}
        className={`w-full p-2 rounded bg-[var(--background)] border border-[#30363d] text-[var(--primary)] focus:outline-none focus:border-[var(--primary)] ${className}`}
      />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  )
}

export default Input
