const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const NUMBERS = "0123456789";

const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?/";

function getRandomIndex(max: number): number {
    const randomValues = new Uint32Array(1);

    crypto.getRandomValues(randomValues);

    return randomValues[0] % max;
}

function getRandomCharacter(characters: string): string {
    return characters[getRandomIndex(characters.length)];
}

export interface PasswordGeneratorOptions {
    length: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
}

export function generatePassword(
    options: PasswordGeneratorOptions
): string {

    if (options.length < 8) {
        throw new Error(
            "Password length must be at least 8"
        );
    }

    const selectedSets: string[] = [];

    if (options.includeLowercase) {
        selectedSets.push(LOWERCASE);
    }

    if (options.includeUppercase) {
        selectedSets.push(UPPERCASE);
    }

    if (options.includeNumbers) {
        selectedSets.push(NUMBERS);
    }

    if (options.includeSymbols) {
        selectedSets.push(SYMBOLS);
    }

    if (selectedSets.length === 0) {
        throw new Error(
            "Select at least one character type"
        );
    }

    const allCharacters =
        selectedSets.join("");

    const passwordCharacters: string[] = [];

    /*
     * Guarantee at least one character
     * from every selected category.
     */
    for (const characterSet of selectedSets) {

        passwordCharacters.push(
            getRandomCharacter(characterSet)
        );
    }

    /*
     * Fill the remaining characters.
     */
    while (
        passwordCharacters.length <
        options.length
    ) {

        passwordCharacters.push(
            getRandomCharacter(allCharacters)
        );
    }

    /*
     * Shuffle the password so that
     * character categories aren't always
     * in the same positions.
     */
    for (
        let i = passwordCharacters.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            getRandomIndex(i + 1);

        [
            passwordCharacters[i],
            passwordCharacters[randomIndex]
        ] = [
            passwordCharacters[randomIndex],
            passwordCharacters[i]
        ];
    }

    return passwordCharacters.join("");
}
export interface PasswordStrengthResult {
    label: "Very Weak" | "Weak" | "Medium" | "Strong" | "Very Strong";
    score: number;
    percentage: number;
    length: number;
    hasLowercase: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    hasSymbol: boolean;
}

export function analyzePassword(
    password: string
    ): PasswordStrengthResult {

        const length = password.length;

        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[^A-Za-z0-9]/.test(password);

        let score = 0;

        // Length
        if (length >= 8) {
            score++;
        }

        if (length >= 12) {
            score++;
        }

        if (length >= 16) {
            score++;
        }

        // Character diversity
        if (hasLowercase) {
            score++;
        }

        if (hasUppercase) {
            score++;
        }

        if (hasNumber) {
            score++;
        }

        if (hasSymbol) {
            score++;
        }

        let label: PasswordStrengthResult["label"];

        if (score <= 2) {
            label = "Very Weak";
        } else if (score <= 4) {
            label = "Weak";
        } else if (score <= 5) {
            label = "Medium";
        } else if (score <= 6) {
            label = "Strong";
        } else {
            label = "Very Strong";
        }

        return {
            label,
            score,
            percentage: (score / 7) * 100,
            length,
            hasLowercase,
            hasUppercase,
            hasNumber,
            hasSymbol
        };
}