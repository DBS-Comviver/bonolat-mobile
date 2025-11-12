import { validators } from "../validators";

describe("Validators", () => {
    describe("cpf", () => {
        it("validates correct CPF", () => {
            expect(validators.cpf("12345678909")).toBe(true);
        });

        it("rejects invalid CPF", () => {
            expect(validators.cpf("12345678900")).toBe(false);
        });

        it("rejects CPF with all same digits", () => {
            expect(validators.cpf("11111111111")).toBe(false);
        });
    });

    describe("email", () => {
        it("validates correct email", () => {
            expect(validators.email("test@example.com")).toBe(true);
        });

        it("rejects invalid email", () => {
            expect(validators.email("invalid-email")).toBe(false);
        });

        it("rejects email without @", () => {
            expect(validators.email("testexample.com")).toBe(false);
        });
    });

    describe("phone", () => {
        it("validates correct phone with 10 digits", () => {
            expect(validators.phone("(11) 1234-5678")).toBe(true);
        });

        it("validates correct phone with 11 digits", () => {
            expect(validators.phone("(11) 91234-5678")).toBe(true);
        });

        it("rejects invalid phone", () => {
            expect(validators.phone("123")).toBe(false);
        });
    });

    describe("cep", () => {
        it("validates correct CEP", () => {
            expect(validators.cep("12345678")).toBe(true);
        });

        it("rejects invalid CEP", () => {
            expect(validators.cep("12345")).toBe(false);
        });
    });
});

