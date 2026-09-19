import { useState, useCallback } from "react";

import {
    generatePassword,
    type PasswordGeneratorOptions
} from "../utils/passwordAnalysis";

const DEFAULT_OPTIONS: PasswordGeneratorOptions = {
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true
};

export function usePasswordGenerator() {

    const [options, setOptions] =
        useState<PasswordGeneratorOptions>(
            DEFAULT_OPTIONS
        );

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState<string | null>(null);

    function updateOption(
        key: keyof PasswordGeneratorOptions,
        value: boolean | number
    ) {

        setOptions(current => ({
            ...current,
            [key]: value
        }));
    }

    const generate = useCallback(() => {
        try {
            const newPassword =
                generatePassword(options);

            setPassword(newPassword);
            setError(null);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to generate password");
            }
        }
    }, [options]);

    const regenerate = useCallback(() => {
        generate();
    }, [generate]);

    return {
        options,
        password,
        error,
        updateOption,
        generate,
        regenerate
    };
}