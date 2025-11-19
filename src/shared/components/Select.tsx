import { useThemeColors } from "@core/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, TouchableOpacity, View, FlatList, Text } from "react-native";

export interface SelectOption {
    label: string;
    value: string;
}

interface SelectProps {
    label?: string;
    placeholder?: string;
    value?: string;
    options: SelectOption[];
    onValueChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
}

export function Select({
    label,
    placeholder = "Selecione...",
    value,
    options,
    onValueChange,
    error,
    disabled = false,
}: SelectProps) {
    const colors = useThemeColors();
    const [isFocused, setIsFocused] = useState(false);
    const [showPicker, setShowPicker] = useState(false);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <View className="mb-4">
            {label && (
                <Text className="mb-2 text-base" style={{ color: colors.text }}>
                    {label}
                </Text>
            )}
            <TouchableOpacity
                onPress={() => !disabled && setShowPicker(true)}
                disabled={disabled}
                className="bg-input-background-light dark:bg-input-background-dark rounded-full px-5 py-3 flex-row items-center justify-between"
                style={{
                    backgroundColor: colors.inputBackground,
                    borderWidth: isFocused ? 2 : 0,
                    borderColor: error ? colors.errorBorder : isFocused ? colors.borderFocus : "transparent",
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
            {error && (
                <Text className="text-sm mt-1" style={{ color: colors.errorLight }}>
                    {error}
                </Text>
            )}

            <Modal
                visible={showPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowPicker(false)}
            >
                <View
                    className="flex-1 justify-end"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <View
                        className="bg-white rounded-t-3xl"
                        style={{ maxHeight: "50%", backgroundColor: colors.background }}
                    >
                        <View className="flex-row items-center justify-between px-5 py-4 border-b"
                            style={{ borderBottomColor: colors.border }}
                        >
                            <Text className="text-lg font-semibold" style={{ color: colors.text }}>
                                {label || "Selecione uma opção"}
                            </Text>
                            <TouchableOpacity onPress={() => setShowPicker(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        onValueChange(item.value);
                                        setShowPicker(false);
                                    }}
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
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

