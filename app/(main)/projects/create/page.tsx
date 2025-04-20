"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"

type Option = {
	value: string
	label: string
}

interface MultiSelectProps {
	options: Option[]
	selected?: Option[]
	onChange?: (selected: Option[]) => void
	placeholder?: string
	maxSelectedValues?: number
}

export function MultiSelect({
	options,
	selected = [],
	onChange,
	placeholder = "Select options",
	maxSelectedValues = Number.POSITIVE_INFINITY,
}: MultiSelectProps) {
	const inputRef = React.useRef<HTMLInputElement>(null)
	const [open, setOpen] = React.useState(false)
	const [inputValue, setInputValue] = React.useState("")
	const [selectedValues, setSelectedValues] = React.useState<Option[]>(selected)

	const handleSelect = React.useCallback(
		(option: Option) => {
			const isSelected = selectedValues.some((item) => item.value === option.value)
			let updatedValues: Option[]

			if (isSelected) {
				updatedValues = selectedValues.filter((item) => item.value !== option.value)
			} else {
				if (selectedValues.length >= maxSelectedValues) return
				updatedValues = [...selectedValues, option]
			}

			setSelectedValues(updatedValues)
			onChange?.(updatedValues)
			setInputValue("")
		},
		[selectedValues, onChange, maxSelectedValues],
	)

	const handleRemove = React.useCallback(
		(option: Option) => {
			const updatedValues = selectedValues.filter((item) => item.value !== option.value)
			setSelectedValues(updatedValues)
			onChange?.(updatedValues)
		},
		[selectedValues, onChange],
	)

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			const input = inputRef.current
			if (input) {
				if (e.key === "Delete" || e.key === "Backspace") {
					if (input.value === "" && selectedValues.length > 0) {
						const lastValue = selectedValues[selectedValues.length - 1]
						handleRemove(lastValue)
					}
				}
				// This is not a default behavior of the <input /> field
				if (e.key === "Escape") {
					input.blur()
				}
			}
		},
		[selectedValues, handleRemove],
	)

	const selectables = options.filter((option) => !selectedValues.some((item) => item.value === option.value))

	return (
		<Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
			<div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
				<div className="flex gap-1 flex-wrap">
					{
					selectedValues.map((option) => (
						<Badge key={option.value} variant="secondary" className="rounded-sm">
							{option.label}
							<button
								className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handleRemove(option)
									}
								}}
								onMouseDown={(e) => {
									e.preventDefault()
									e.stopPropagation()
								}}
								onClick={() => handleRemove(option)}
							>
								<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
							</button>
						</Badge>
					))
					}
					<CommandPrimitive.Input
						ref={inputRef}
						value={inputValue}
						onValueChange={setInputValue}
						onBlur={() => setOpen(false)}
						onFocus={() => setOpen(true)}
						placeholder={selectedValues.length === 0 ? placeholder : ""}
						className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
					/>
				</div>
			</div>
			<div className="relative mt-2">
				{
				open && selectables.length > 0 ? (
					<div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
						<CommandGroup className="h-full overflow-auto">
							{
							selectables.map((option) => (
								<CommandItem
									key={option.value}
									onMouseDown={(e) => {
										e.preventDefault()
										e.stopPropagation()
									}}
									onSelect={() => handleSelect(option)}
									className={"cursor-pointer"}
								>
									{option.label}
								</CommandItem>
							))
							}
						</CommandGroup>
					</div>
				) : null
				}
			</div>
		</Command>
	)
}