import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Button } from "../Button";

describe("Button Component", () => {
    it("renders correctly with title", () => {
        const { getByText } = render(<Button title="Test Button" />);
        expect(getByText("Test Button")).toBeTruthy();
    });

    it("calls onPress when pressed", () => {
        const onPressMock = jest.fn();
        const { getByText } = render(
            <Button title="Test Button" onPress={onPressMock} />
        );
        fireEvent.press(getByText("Test Button"));
        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it("shows loading state", () => {
        const { UNSAFE_getByType } = render(
            <Button title="Test Button" loading={true} />
        );
        const activityIndicator = UNSAFE_getByType(
            require("react-native").ActivityIndicator
        );
        expect(activityIndicator).toBeTruthy();
    });

    it("is disabled when disabled prop is true", () => {
        const onPressMock = jest.fn();
        const { getByText } = render(
            <Button title="Test Button" onPress={onPressMock} disabled={true} />
        );
        fireEvent.press(getByText("Test Button"));
        expect(onPressMock).not.toHaveBeenCalled();
    });

    it("renders with primary variant", () => {
        const { getByText } = render(
            <Button title="Primary Button" variant="primary" />
        );
        expect(getByText("Primary Button")).toBeTruthy();
    });

    it("renders with secondary variant", () => {
        const { getByText } = render(
            <Button title="Secondary Button" variant="secondary" />
        );
        expect(getByText("Secondary Button")).toBeTruthy();
    });

    it("renders with outline variant", () => {
        const { getByText } = render(
            <Button title="Outline Button" variant="outline" />
        );
        expect(getByText("Outline Button")).toBeTruthy();
    });
});

