interface SecurityScoreProps {
  score: number; // 0 to 100
  totalEntries: number;
}

export function SecurityScore({ score, totalEntries }: SecurityScoreProps) {
  const getScoreTier = (val: number) => {
    if (val >= 85) return { label: 'Optimal', color: 'bg-green-700' };
    if (val >= 70) return { label: 'Good', color: 'bg-blue-800' };
    if (val >= 50) return { label: 'Moderate Risk', color: 'bg-yellow-600' };
    return { label: 'Vulnerable', color: 'bg-red-700' };
  };

  const tier = getScoreTier(score);

  return (
    <div className="win98-groupbox text-left">
      <span className="win98-groupbox-legend">
        Overall Vault Security Status
      </span>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-1">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🛡️</span>
          <div>
            <div className="text-[12px] font-bold text-black flex items-center gap-2">
              <span>Security Rating: {tier.label}</span>
              <span className="font-mono text-[11px] font-normal">({score} / 100)</span>
            </div>
            <p className="text-[11px] text-neutral-600 mt-0.5">
              Audited across {totalEntries} stored {totalEntries === 1 ? 'credential' : 'credentials'} for complexity, length, and duplication.
            </p>
          </div>
        </div>

        {/* Segmented Meter */}
        <div className="w-48 shrink-0">
          <div className="win98-sunken p-0.5 flex gap-0.5 bg-white h-5">
            {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((step) => (
              <div
                key={step}
                className={`h-full flex-1 ${
                  score >= step ? tier.color : 'bg-neutral-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
