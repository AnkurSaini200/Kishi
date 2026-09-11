export function PasswordStrength({ score = 0 }: { score?: number }) { return <meter min="0" max="4" value={score}>Password strength</meter> }
