import { useThemeColors } from "@core/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@shared/components";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

interface QRCodeScannerProps {
    visible: boolean;
    onScan: (data: string) => void;
    onClose: () => void;
    title?: string;
}

export function QRCodeScanner({
    visible,
    onScan,
    onClose,
    title = "Escaneie o código",
}: QRCodeScannerProps) {
    const colors = useThemeColors();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        if (visible && permission && !permission.granted) {
            requestPermission();
        }
    }, [visible]);

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (!scanned) {
            setScanned(true);
            onScan(data);
            setTimeout(() => {
                setScanned(false);
            }, 2000);
        }
    };

    if (!permission) {
        return (
            <Modal visible={visible} transparent animationType="slide">
                <View style={[styles.container, { backgroundColor: colors.background }]}>
                    <Text style={{ color: colors.text }}>Solicitando permissão da câmera...</Text>
                </View>
            </Modal>
        );
    }

    if (!permission.granted) {
        return (
            <Modal visible={visible} transparent animationType="slide">
                <View style={[styles.container, { backgroundColor: colors.background }]}>
                    <Text style={{ color: colors.error }}>Sem acesso à câmera</Text>
                    <TouchableOpacity 
                        onPress={requestPermission} 
                        className="mt-4 p-4 rounded-full"
                        style={{ backgroundColor: colors.primary }}
                    >
                        <Text style={{ color: colors.white }}>Solicitar Permissão</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={onClose} 
                        className="mt-2 p-4 rounded-full"
                        style={{ backgroundColor: colors.error }}
                    >
                        <Text style={{ color: colors.white }}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={[styles.container, { backgroundColor: "rgba(0,0,0,0.9)" }]}>
                <View className="absolute top-12 left-0 right-0 items-center z-10">
                    <Text className="text-xl font-semibold mb-2" style={{ color: colors.white }}>
                        {title}
                    </Text>
                </View>

                <CameraView
                    style={StyleSheet.absoluteFillObject}
                    facing="back"
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr", "ean13", "ean8", "code128"],
                    }}
                />

                <View className="absolute bottom-8 left-0 right-0 items-center z-10">
                    <TouchableOpacity
                        onPress={onClose}
                        className="px-6 py-3 rounded-full flex-row items-center"
                        style={{ backgroundColor: colors.error }}
                    >
                        <Ionicons name="close" size={20} color={colors.white} style={{ marginRight: 8 }} />
                        <Text className="text-base font-semibold" style={{ color: colors.white }}>
                            Cancelar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

