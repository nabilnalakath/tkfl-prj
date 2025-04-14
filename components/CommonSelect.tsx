"use client";

import { Listbox } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CommonSelectProps {
  options: Option[];
  value: Option;
  onChange: (option: Option) => void;
  className?: string;
}

export default function CommonSelect({
  options,
  value,
  onChange,
  className = "w-full",
}: CommonSelectProps) {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className={`relative ${className} text-sm`}>
          <Listbox.Button className="w-full flex items-center justify-between py-2 px-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition">
            <span>{value.label}</span>
            <span className="ml-2 text-gray-400 flex items-center">
              {open ? (
                <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
              )}
            </span>
          </Listbox.Button>
          {open && (
            <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto focus:outline-none">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option}
                  disabled={option.disabled}
                  className={({ active, disabled }) =>
                    `cursor-pointer px-3 py-2 
                    ${active ? "bg-gray-100" : "bg-white"} 
                    ${disabled ? "text-gray-300 cursor-not-allowed" : "text-gray-800"}`
                  }
                >
                  {option.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          )}
        </div>
      )}
    </Listbox>
  );
}
