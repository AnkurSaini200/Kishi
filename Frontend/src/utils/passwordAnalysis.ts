export function passwordScore(value: string) { return Math.min(4, Number(value.length >= 12) + Number(/[A-Z]/.test(value)) + Number(/[0-9]/.test(value)) + Number(/[^A-Za-z0-9]/.test(value))) }
