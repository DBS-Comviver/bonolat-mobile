import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Input } from "../Input";

describe("Input Component", () => {
    it("renders correctly with label", () => {
        const { getByText } = render(<Input label="Test Label" />);
        expect(getByText("Test Label")).toBeTruthy();
    });

    it("renders without label", () => {
        const { queryByText } = render(<Input />);
        expect(queryByText("Test Label")).toBeNull();
    });

    it("displays error message when error prop is provided", () => {
        const { getByText } = render(
            <Input label="Test Input" error="This is an error" />
        );
        expect(getByText("This is an error")).toBeTruthy();
    });

    it("calls onChangeText when text is entered", () => {
        const onChangeTextMock = jest.fn();
        const { getByPlaceholderText } = render(
            <Input
                placeholder="Enter text"
                onChangeText={onChangeTextMock}
            />
        );
        const input = getByPlaceholderText("Enter text");
        fireEvent.changeText(input, "test text");
        expect(onChangeTextMock).toHaveBeenCalledWith("test text");
    });

    it("shows password visibility toggle for secureTextEntry", () => {
        const { UNSAFE_getByType } = render(
            <Input secureTextEntry={true} label="Password" />
        );
        const icon = UNSAFE_getByType(require("@expo/vector-icons").Ionicons);
        expect(icon).toBeTruthy();
    });
});

