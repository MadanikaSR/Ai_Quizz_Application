"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// --- Context ---
interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextType | null>(null)

function useSelectContext() {
  const ctx = React.useContext(SelectContext)
  if (!ctx) throw new Error("Select components must be used within <Select>")
  return ctx
}

// --- Select Root ---
interface SelectProps {
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
}

function Select({ children, value: controlledValue, onValueChange, defaultValue = "" }: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [open, setOpen] = React.useState(false)
  const value = controlledValue ?? internalValue
  const handleChange = React.useCallback(
    (v: string) => {
      setInternalValue(v)
      onValueChange?.(v)
    },
    [onValueChange]
  )

  return (
    <SelectContext.Provider value={{ value, onValueChange: handleChange, open, setOpen }}>
      <div data-slot="select" className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

// --- SelectTrigger ---
function SelectTrigger({
  className,
  children,
  id,
  ...props
}: React.ComponentProps<"button"> & { id?: string }) {
  const { open, setOpen } = useSelectContext()

  return (
    <button
      type="button"
      id={id}
      role="combobox"
      aria-expanded={open}
      data-slot="select-trigger"
      className={cn(
        "border-input flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs whitespace-nowrap transition-[color,box-shadow] outline-none",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[placeholder]:text-muted-foreground",
        "[&>span]:line-clamp-1",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-50 shrink-0"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  )
}

// --- SelectValue ---
interface SelectValueProps {
  placeholder?: string
}

function SelectValue({ placeholder }: SelectValueProps) {
  const { value } = useSelectContext()

  return (
    <span data-slot="select-value" data-placeholder={!value ? "" : undefined}>
      {value || placeholder}
    </span>
  )
}

// --- SelectContent ---
function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { open, setOpen } = useSelectContext()
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return

    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.closest('[data-slot="select"]')?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      ref={ref}
      data-slot="select-content"
      className={cn(
        "bg-white text-black absolute z-[100] mt-1 w-full min-w-[8rem] overflow-hidden rounded-none border border-black shadow-lg",
        "animate-in fade-in-0 mt-2",
        className
      )}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  )
}

// --- SelectItem ---
function SelectItem({
  className,
  children,
  value: itemValue,
  ...props
}: React.ComponentProps<"div"> & { value: string }) {
  const { value, onValueChange, setOpen } = useSelectContext()
  const isSelected = value === itemValue

  return (
    <div
      role="option"
      aria-selected={isSelected}
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-none py-2 px-3 text-sm outline-none transition-colors",
        "hover:bg-slate-100 hover:text-black",
        "focus:bg-slate-100 focus:text-black",
        isSelected && "bg-slate-50 font-bold",
        className
      )}
      onClick={() => {
        onValueChange(itemValue)
        setOpen(false)
      }}
      {...props}
    >
      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      {children}
    </div>
  )
}

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
}
