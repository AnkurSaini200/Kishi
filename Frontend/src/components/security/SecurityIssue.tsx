import type { SecurityIssue as SecurityIssueType } from '../../types/security';

interface SecurityIssueProps {
  issue: SecurityIssueType & {
    affectedTitles?: string[];
    onFix?: () => void;
  };
}

export function SecurityIssue({ issue }: SecurityIssueProps) {
  const isHigh = issue.severity === 'high';

  return (
    <div className="win98-sunken p-2 bg-white text-left flex items-start justify-between gap-2">
      <div className="flex items-start gap-2 min-w-0">
        <span className="text-base shrink-0 mt-0.5">
          {isHigh ? '⚠️' : 'ℹ️'}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-black truncate">
              {issue.title}
            </span>
            <span className="text-[9px] font-bold uppercase px-1 border border-black bg-[#c0c0c0]">
              {issue.severity}
            </span>
          </div>
          <p className="text-[10px] text-neutral-700 mt-0.5">
            {issue.description}
          </p>
          {issue.affectedTitles && issue.affectedTitles.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {issue.affectedTitles.map((title) => (
                <span
                  key={title}
                  className="text-[9px] font-mono px-1 bg-neutral-100 border border-neutral-300 text-black"
                >
                  {title}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {issue.onFix && (
        <button
          onClick={issue.onFix}
          className="win98-btn !px-2 !py-0.5 text-[10px] shrink-0"
        >
          Review...
        </button>
      )}
    </div>
  );
}
