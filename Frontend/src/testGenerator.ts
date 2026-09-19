import { generatePassword } from "./utils/passwordAnalysis";

const password = generatePassword({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true
});

console.log("Generated password:", password);
console.log("Length:", password.length);