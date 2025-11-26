import { useThemeColors } from "@core/hooks/useThemeColors";
import { Text } from "@shared/components";
import React, { useMemo, useState } from "react";
import { Keyboard, TextInput, TouchableOpacity, View } from "react-native";
import { FilterOption } from "../types/fractioning";

interface FilterSelectProps {
	value: string;
	options: FilterOption[];
	onChange: (value: string) => void;
	label: string;
	placeholder?: string;
	disabled?: boolean;
}

export function FilterSelect({ value, options, onChange, label, placeholder, disabled }: FilterSelectProps) {
	const colors = useThemeColors();
	const [isFocused, setIsFocused] = useState(false);

	const filteredOptions = useMemo(() => {
		if (!value) {
			return options;
		}
		const search = value.toLowerCase();
		return options.filter(
			(option) =>
				option.label.toLowerCase().includes(search) ||
				option.value.toLowerCase().includes(search)
		);
	}, [options, value]);

	const selectedOption = options.find((option) => option.value === value);
	const displayValue = selectedOption ? selectedOption.label : value;
	const showOptions = isFocused && filteredOptions.length > 0;

	return (
		<View className="mt-3 space-y-1">
			<Text className="text-xs font-semibold" style={{ color: colors.text }}>
				{label}
			</Text>
			<View>
				<TextInput
					value={displayValue}
					onChangeText={onChange}
					placeholder={placeholder}
					placeholderTextColor={colors.textMuted}
					editable={!disabled}
					className="rounded-2xl text-base"
					style={{
						backgroundColor: colors.inputBackground,
						color: colors.text,
						borderWidth: 1,
						borderColor: isFocused ? colors.borderFocus : colors.border,
						paddingHorizontal: 14,
						paddingVertical: 10,
						minHeight: 48,
						opacity: disabled ? 0.6 : 1,
					}}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setTimeout(() => setIsFocused(false), 150)}
				/>
				{showOptions && (
					<View
						className="mt-1 rounded-2xl shadow-xl overflow-hidden"
						style={{
							backgroundColor: colors.inputBackground,
							borderColor: colors.border,
							borderWidth: 1,
						}}
					>
						{filteredOptions.map((option) => {
							const isSelected = option.value === value;
							return (
								<TouchableOpacity
									key={option.value}
									onPress={() => {
										onChange(option.value);
										setIsFocused(false);
										Keyboard.dismiss();
									}}
									className="px-4 py-3 border-b last:border-b-0"
									style={{
										borderBottomColor: colors.border,
										backgroundColor: isSelected ? `${colors.primary}20` : "transparent",
									}}
								>
									<Text
										className="text-sm"
										style={{
											color: isSelected ? colors.primary : colors.text,
											fontWeight: isSelected ? "600" : "400",
										}}
									>
										{option.label}
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				)}
			</View>
		</View>
	);
}