interface SecurityStatsProps {
  total: number;
  weakCount: number;
  reusedCount: number;
  strongCount: number;
}

export function SecurityStats({
  total,
  weakCount,
  reusedCount,
  strongCount,
}: SecurityStatsProps) {
  const stats = [
    { label: 'Total Entries', value: total, icon: '📁' },
    { label: 'Strong & Safe', value: strongCount, icon: '✅' },
    { label: 'Weak Passwords', value: weakCount, icon: '⚠️' },
    { label: 'Reused Passwords', value: reusedCount, icon: '🔁' },
  ];

  return (
    <div className="win98-groupbox text-left">
      <span className="win98-groupbox-legend">
        Audit Summary Statistics
      </span>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="win98-sunken p-2 bg-white flex flex-col items-center text-center"
          >
            <span className="text-base mb-0.5">{stat.icon}</span>
            <span className="text-[10px] text-neutral-600 uppercase font-semibold">
              {stat.label}
            </span>
            <span className="text-lg font-bold font-mono text-black">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
