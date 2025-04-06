/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */
"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@ai/components/ui/badge"

interface SelectMultipleProps {
    options: { label: string; value: string }[]
    placeholder?: string
    onChange?: (values: string[]) => void
}

export function SelectMultiple({ options, placeholder = "Search...", onChange }: SelectMultipleProps) {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState<typeof options>([])
    const [inputValue, setInputValue] = React.useState("")

    const handleSelect = (option: typeof options[0]) => {
        if (selected.some((item) => item.value === option.value)) return

        const newSelected = [...selected, option]
        setSelected(newSelected)
        setInputValue("")
        onChange?.(newSelected.map((item) => item.value))
    }

    const handleRemove = (option: typeof options[0]) => {
        const newSelected = selected.filter((item) => item.value !== option.value)
        setSelected(newSelected)
        onChange?.(newSelected.map((item) => item.value))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current
        if (input) {
            if (e.key === "Delete" || e.key === "Backspace") {
                if (input.value === "" && selected.length > 0) {
                    handleRemove(selected[selected.length - 1])
                }
            }
            if (e.key === "Escape") {
                setOpen(false)
                input.blur()
            }
        }
    }

    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!e.target || !(e.target as HTMLElement).closest(".relative")) {
                setOpen(false)
            }
        }
        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    }, [])

    const filteredOptions = options
        .filter((option) => !selected.some((item) => item.value === option.value))
        .filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()))

    return (
        <div className="relative">
            <div className="relative flex w-full flex-wrap gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm">
                {selected.map((option) => (
                    <Badge key={option.value} variant="secondary" className="max-w-[200px]">
                        {option.label}
                        <button
                            className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            onClick={() => handleRemove(option)}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
                <div onKeyDown={handleKeyDown}>
                    <input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onFocus={() => setOpen(true)}
                        onClick={() => setOpen(true)}
                        className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                        placeholder={selected.length === 0 ? placeholder : ""}
                    />
                </div>
            </div>
            <div className="relative mt-2">
                {open && filteredOptions.length > 0 && (
                    <ul className="absolute top-0 left-0 w-full rounded-md border bg-background shadow-md p-2">
                        {filteredOptions.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => handleSelect(option)}
                                className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                )}
                {open && filteredOptions.length === 0 && (
                    <div className="absolute top-0 left-0 w-full rounded-md border bg-background shadow-md p-2">
                        <p className="text-sm text-muted-foreground px-2 py-1.5">No results found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
