import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";

interface TextProps extends RNTextProps {
    variant?: "default" | "title" | "subtitle" | "caption";
    color?: string;
    className?: string;
}

export function Text({
    variant = "default",
    color,
    className = "",
    style,
    ...props
}: TextProps) {
    const variantStyles = {
        default: "text-text-light dark:text-text-dark",
        title: "text-text-light dark:text-text-dark text-2xl font-bold",
        subtitle: "text-text-light dark:text-text-dark text-lg",
        caption: "text-text-light dark:text-text-dark text-sm",
    };

    const combinedClassName = `${variantStyles[variant]} ${className}`.trim();

    return (
        <RNText
            className={combinedClassName}
            style={[color && { color }, style]}
            {...props}
        />
    );
}

