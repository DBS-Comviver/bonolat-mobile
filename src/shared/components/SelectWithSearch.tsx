import { useThemeColors } from "@core/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

export interface SelectOption {
	label: string;
	value: string;
}

interface SelectWithSearchProps {
	label?: string;
	placeholder?: string;
	value?: string;
	options: SelectOption[];
	onValueChange: (value: string) => void;
	error?: string;
	disabled?: boolean;
	allowManualInput?: boolean;
	onManualInput?: (value: string) => void;
}

export function SelectWithSearch({
	label,
	placeholder = "Selecione ou digite...",
	value,
	options,
	onValueChange,
	error,
	disabled = false,
	allowManualInput = true,
	onManualInput,
}: SelectWithSearchProps) {
	const colors = useThemeColors();
	const [isFocused, setIsFocused] = useState(false);
	const [showPicker, setShowPicker] = useState(false);
	const [searchText, setSearchText] = useState("");

	const selectedOption = options.find((opt) => opt.value === value);

	const filteredOptions = useMemo(() => {
		if (!searchText) return options;
		const lowerSearch = searchText.toLowerCase();
		return options.filter(
			(opt) =>
				opt.label.toLowerCase().includes(lowerSearch) ||
				opt.value.toLowerCase().includes(lowerSearch)
		);
	}, [options, searchText]);

	const handleSelect = (selectedValue: string) => {
		onValueChange(selectedValue);
		setShowPicker(false);
		setSearchText("");
	};

	const handleManualInput = (text: string) => {
		if (allowManualInput && onManualInput) {
			onManualInput(text);
		}
	};

	return (
		<View className="mb-4">
			{label && (
				<Text className="mb-2 text-base" style={{ color: colors.text }}>
					{label}
				</Text>
			)}
			<View className="flex-row gap-2">
				{allowManualInput ? (
					<TextInput
						value={value || ""}
						onChangeText={handleManualInput}
						placeholder={placeholder}
						placeholderTextColor={colors.textMuted}
						editable={!disabled}
						className="flex-1 rounded-lg text-base"
						style={{
							backgroundColor: colors.inputBackground,
							color: colors.inputText,
							borderWidth: isFocused ? 2 : 1,
							borderColor: error ? colors.errorBorder : isFocused ? colors.borderFocus : colors.border,
							paddingHorizontal: 16,
							paddingVertical: 12,
							minHeight: 48,
							opacity: disabled ? 0.5 : 1,
						}}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
					/>
				) : (
					<TouchableOpacity
						onPress={() => !disabled && setShowPicker(true)}
						disabled={disabled}
						className="flex-1 rounded-lg flex-row items-center justify-between"
						style={{
							backgroundColor: colors.inputBackground,
							borderWidth: isFocused ? 2 : 1,
							borderColor: error ? colors.errorBorder : isFocused ? colors.borderFocus : colors.border,
							paddingHorizontal: 16,
							paddingVertical: 12,
							minHeight: 48,
							opacity: disabled ? 0.5 : 1,
						}}
					>
						<Text
							className="flex-1 text-base"
							style={{
								color: selectedOption ? colors.inputText : colors.inputPlaceholder,
							}}
						>
							{selectedOption ? selectedOption.label : placeholder}
						</Text>
						<Ionicons
							name="chevron-down"
							size={20}
							color={colors.textMuted}
						/>
					</TouchableOpacity>
				)}
				<TouchableOpacity
					onPress={() => !disabled && setShowPicker(true)}
					disabled={disabled}
					className="rounded-lg justify-center items-center"
					style={{
						backgroundColor: colors.inputBackground,
						borderWidth: 1,
						borderColor: colors.border,
						width: 48,
						height: 48,
						opacity: disabled ? 0.5 : 1,
					}}
				>
					<Ionicons name="list" size={20} color={colors.primary} />
				</TouchableOpacity>
			</View>
			{error && (
				<Text className="text-sm mt-1" style={{ color: colors.errorLight }}>
					{error}
				</Text>
			)}

			<Modal
				visible={showPicker}
				transparent={true}
				animationType="slide"
				onRequestClose={() => {
					setShowPicker(false);
					setSearchText("");
				}}
			>
				<View
					className="flex-1 justify-end"
					style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
				>
					<View
						className="bg-white rounded-t-3xl"
						style={{ maxHeight: "70%", backgroundColor: colors.background }}
					>
						<View className="flex-row items-center justify-between px-5 py-4 border-b"
							style={{ borderBottomColor: colors.border }}
						>
							<Text className="text-lg font-semibold" style={{ color: colors.text }}>
								{label || "Selecione uma opção"}
							</Text>
							<TouchableOpacity onPress={() => {
								setShowPicker(false);
								setSearchText("");
							}}>
								<Ionicons name="close" size={24} color={colors.text} />
							</TouchableOpacity>
						</View>
						<View className="px-5 py-3 border-b" style={{ borderBottomColor: colors.border }}>
							<TextInput
								value={searchText}
								onChangeText={setSearchText}
								placeholder="Buscar..."
								placeholderTextColor={colors.textMuted}
								className="bg-input-background-light dark:bg-input-background-dark rounded-full px-4 py-2"
								style={{
									backgroundColor: colors.inputBackground,
									color: colors.inputText,
									borderWidth: 1,
									borderColor: colors.border,
								}}
							/>
						</View>
						<FlatList
							data={filteredOptions}
							keyExtractor={(item) => item.value}
							renderItem={({ item }) => (
								<TouchableOpacity
									onPress={() => handleSelect(item.value)}
									className="px-5 py-4 border-b"
									style={{
										backgroundColor: value === item.value ? `${colors.primary}10` : "transparent",
										borderBottomColor: colors.border,
									}}
								>
									<Text
										className="text-base"
										style={{
											color: value === item.value ? colors.primary : colors.text,
											fontWeight: value === item.value ? "600" : "400",
										}}
									>
										{item.label}
									</Text>
								</TouchableOpacity>
							)}
							ListEmptyComponent={
								<View className="px-5 py-8 items-center">
									<Text className="text-base" style={{ color: colors.textMuted }}>
										Nenhum resultado encontrado
									</Text>
								</View>
							}
						/>
					</View>
				</View>
			</Modal>
		</View>
	);
}