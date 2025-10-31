'use client'

import React, { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="mb-1 text-sm text-[#7d8590]">{label}</label>}
      
      <textarea
        {...props}
        className={`
          w-full p-2 rounded bg-[var(--background)]
          border border-[#30363d] border-opacity-50
          text-[var(--primary)]
          outline-none
          transition-all duration-400 ease-in-out
          focus:border-opacity-100 focus:border-[var(--primary)]
          ${className}
        `}
      />

      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  )
}

export default Textarea
