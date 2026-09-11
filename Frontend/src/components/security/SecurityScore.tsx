export function SecurityScore({ score = 86 }: { score?: number }) { return <section><strong>{score}</strong><span className="muted"> / 100 security score</span></section> }
