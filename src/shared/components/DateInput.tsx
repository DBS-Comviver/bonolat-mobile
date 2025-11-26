import { useThemeColors } from "@core/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Platform, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Button } from "./Button";
import { Text } from "./Text";

interface DateInputProps {
    value: string;
    onChange: (date: string) => void;
    placeholder?: string;
    error?: string;
    label?: string;
}

export function DateInput({ value, onChange, placeholder = "DD/MM/AAAA", error, label }: DateInputProps) {
    const colors = useThemeColors();
    const [showPicker, setShowPicker] = useState(false);
    const [tempDate, setTempDate] = useState<Date | null>(null);

    const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const parseDate = (dateString: string): Date | null => {
        if (!dateString) return null;
        const parts = dateString.split("/");
        if (parts.length !== 3) return null;
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
        return new Date(year, month, day);
    };

    const handleOpenPicker = () => {
        const parsed = parseDate(value);
        setTempDate(parsed || new Date());
        setShowPicker(true);
    };

    const handleConfirm = () => {
        if (tempDate) {
            onChange(formatDate(tempDate));
        }
        setShowPicker(false);
    };

    const handleCancel = () => {
        setShowPicker(false);
    };

    const handleTextChange = (text: string) => {
        const numbers = text.replace(/\D/g, "");

        let formatted = numbers;
        if (numbers.length > 2) {
            formatted = numbers.slice(0, 2) + "/" + numbers.slice(2);
        }
        if (numbers.length > 4) {
            formatted = numbers.slice(0, 2) + "/" + numbers.slice(2, 4) + "/" + numbers.slice(4, 8);
        }

        onChange(formatted);
    };

    const renderDatePicker = () => {
        if (Platform.OS === "web") {
            return (
                <input
                    type="date"
                    value={tempDate ? tempDate.toISOString().split("T")[0] : ""}
                    onChange={(e) => {
                        if (e.target.value) {
                            setTempDate(new Date(e.target.value));
                        }
                    }}
                    style={{
                        width: "100%",
                        padding: 12,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: colors.border,
                        fontSize: 16,
                    }}
                />
            );
        }

        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 30 }, (_, i) => currentYear - 10 + i);
        const months = [
            { value: 1, label: "Jan" },
            { value: 2, label: "Fev" },
            { value: 3, label: "Mar" },
            { value: 4, label: "Abr" },
            { value: 5, label: "Mai" },
            { value: 6, label: "Jun" },
            { value: 7, label: "Jul" },
            { value: 8, label: "Ago" },
            { value: 9, label: "Set" },
            { value: 10, label: "Out" },
            { value: 11, label: "Nov" },
            { value: 12, label: "Dez" },
        ];

        const daysInMonth = tempDate ? new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate() : 31;
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return (
            <ScrollView style={{ maxHeight: 300 }}>
                <View className="flex-row justify-between mb-4">
                    <View className="flex-1 mr-2">
                        <Text className="text-sm mb-2 font-semibold" style={{ color: colors.text }}>
                            Dia
                        </Text>
                        <ScrollView style={{ maxHeight: 200, borderWidth: 1, borderColor: colors.border, borderRadius: 8 }}>
                            {days.map((day) => (
                                <TouchableOpacity
                                    key={day}
                                    onPress={() => {
                                        if (tempDate) {
                                            setTempDate(new Date(tempDate.getFullYear(), tempDate.getMonth(), day));
                                        }
                                    }}
                                    className="p-3 border-b"
                                    style={{
                                        backgroundColor: tempDate?.getDate() === day ? colors.primary : "transparent",
                                        borderBottomColor: colors.border,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: tempDate?.getDate() === day ? colors.white : colors.text,
                                            textAlign: "center",
                                        }}
                                    >
                                        {String(day).padStart(2, "0")}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    <View className="flex-1 mr-2">
                        <Text className="text-sm mb-2 font-semibold" style={{ color: colors.text }}>
                            Mês
                        </Text>
                        <ScrollView style={{ maxHeight: 200, borderWidth: 1, borderColor: colors.border, borderRadius: 8 }}>
                            {months.map((month) => (
                                <TouchableOpacity
                                    key={month.value}
                                    onPress={() => {
                                        if (tempDate) {
                                            const newDate = new Date(tempDate.getFullYear(), month.value - 1, tempDate.getDate());
                                            setTempDate(newDate);
                                        }
                                    }}
                                    className="p-3 border-b"
                                    style={{
                                        backgroundColor: tempDate?.getMonth() + 1 === month.value ? colors.primary : "transparent",
                                        borderBottomColor: colors.border,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: tempDate?.getMonth() + 1 === month.value ? colors.white : colors.text,
                                            textAlign: "center",
                                        }}
                                    >
                                        {month.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm mb-2 font-semibold" style={{ color: colors.text }}>
                            Ano
                        </Text>
                        <ScrollView style={{ maxHeight: 200, borderWidth: 1, borderColor: colors.border, borderRadius: 8 }}>
                            {years.map((year) => (
                                <TouchableOpacity
                                    key={year}
                                    onPress={() => {
                                        if (tempDate) {
                                            setTempDate(new Date(year, tempDate.getMonth(), tempDate.getDate()));
                                        }
                                    }}
                                    className="p-3 border-b"
                                    style={{
                                        backgroundColor: tempDate?.getFullYear() === year ? colors.primary : "transparent",
                                        borderBottomColor: colors.border,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: tempDate?.getFullYear() === year ? colors.white : colors.text,
                                            textAlign: "center",
                                        }}
                                    >
                                        {year}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
        );
    };

    return (
        <View style={{ marginBottom: 0 }}>
            {label && (
                <Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
                    {label}
                </Text>
            )}
            <View className="flex-row items-center">
                <View className="flex-1">
                    <View
                        style={{
                            backgroundColor: colors.inputBackground,
                            borderRadius: 12,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            borderWidth: error ? 2 : 1,
                            borderColor: error ? colors.errorBorder || colors.error : colors.border,
                            height: 48,
                            justifyContent: "center",
                        }}
                    >
                        <TextInput
                            value={value}
                            onChangeText={handleTextChange}
                            placeholder={placeholder}
                            placeholderTextColor={colors.inputPlaceholder || colors.textMuted}
                            keyboardType="numeric"
                            style={{
                                color: colors.inputText || colors.text,
                                fontSize: 16,
                                padding: 0,
                                margin: 0,
                            }}
                        />
                    </View>
                    {error && (
                        <Text className="text-sm mt-1" style={{ color: colors.errorLight || colors.error }}>
                            {error}
                        </Text>
                    )}
                </View>
                <TouchableOpacity
                    onPress={handleOpenPicker}
                    className="ml-2 rounded-lg"
                    style={{
                        backgroundColor: colors.inputBackground,
                        borderWidth: 1,
                        borderColor: colors.border,
                        width: 48,
                        height: 48,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <Modal
                visible={showPicker}
                transparent
                animationType="slide"
                onRequestClose={handleCancel}
            >
                <View
                    className="flex-1 justify-end"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <View
                        className="p-6 rounded-t-3xl"
                        style={{
                            backgroundColor: colors.background,
                            maxHeight: "80%",
                        }}
                    >
                        <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                            Selecionar Data
                        </Text>
                        {renderDatePicker()}
                        <View className="flex-row gap-3 mt-4">
                            <View className="flex-1">
                                <Button
                                    title="Cancelar"
                                    onPress={handleCancel}
                                    variant="secondary"
                                />
                            </View>
                            <View className="flex-1">
                                <Button
                                    title="Confirmar"
                                    onPress={handleConfirm}
                                    variant="primary"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}