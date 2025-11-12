import React from "react";
import { Image, ImageProps, View, StyleSheet, Text } from "react-native";
import { useThemeColors } from "@core/hooks/useThemeColors";

interface LogoProps extends Omit<ImageProps, "source"> {
    type?: "client" | "comviver";
    width?: number;
    height?: number;
}

export function Logo({ type = "client", width, height, style, ...props }: LogoProps) {
    const colors = useThemeColors();
    const defaultSizes = {
        client: { width: 180, height: 70 },
        comviver: { width: 140, height: 50 },
    };

    const size = defaultSizes[type];
    const logoWidth = width || size.width;
    const logoHeight = height || size.height;

    let imageSource;
    try {
        imageSource = type === "client" 
            ? require("@shared/assets/images/client-logo.png")
            : require("@shared/assets/images/comviver-logo.png");
    } catch {
        imageSource = null;
    }

    if (!imageSource) {
        return (
            <View 
                style={[{ width: logoWidth, height: logoHeight }, style]}
                className="items-center justify-center"
            >
                <Text className="text-lg font-light" style={{ color: colors.text }}>
                    {type === "client" ? "client" : "COMVIVER"}
                </Text>
            </View>
        );
    }

    return (
        <View style={[{ width: logoWidth, height: logoHeight }, style]}>
            <Image
                source={imageSource}
                style={[styles.image, { width: logoWidth, height: logoHeight }]}
                resizeMode="contain"
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: "100%",
    },
});

