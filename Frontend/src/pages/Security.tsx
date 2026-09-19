import { useState, useMemo } from 'react';
import { useVault } from '../hooks/useVault';
import { useVaultCrypto } from '../contexts/VaultCryptoContext';
import { SecurityScore } from '../components/security/SecurityScore';
import { SecurityStats } from '../components/security/SecurityStats';
import { SecurityIssue } from '../components/security/SecurityIssue';
import { EditEntryModal } from '../components/vault/EditEntryModal';
import { Toast } from '../components/common/Toast';
import { analyzePassword } from '../utils/passwordAnalysis';
import type { VaultEntry } from '../types/vault';
import type { SecurityIssue as SecurityIssueType } from '../types/security';

export function Security() {
  const { entries, editEntry } = useVault();
  const { isUnlocked } = useVaultCrypto();

  const [selectedEntry, setSelectedEntry] = useState<VaultEntry | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Security calculations
  const securityAnalysis = useMemo(() => {
    if (!isUnlocked || entries.length === 0) {
      return {
        score: 100,
        weakCount: 0,
        reusedCount: 0,
        strongCount: 0,
        issues: [] as (SecurityIssueType & {
          affectedTitles?: string[];
          onFix?: () => void;
        })[],
      };
    }

    let weakCount = 0;
    let strongCount = 0;

    // Track password frequency for reuse detection
    const passwordMap = new Map<string, VaultEntry[]>();

    const issues: (SecurityIssueType & {
      affectedTitles?: string[];
      onFix?: () => void;
    })[] = [];

    entries.forEach((entry) => {
      const strength = analyzePassword(entry.password);

      // Weak check
      if (strength.score <= 4) {
        weakCount++;
        issues.push({
          id: `weak-${entry.id}`,
          title: `Weak password on ${entry.title}`,
          description: `Password strength is ${strength.label}. Consider increasing length and variety.`,
          severity: strength.score <= 2 ? 'high' : 'medium',
          affectedTitles: [entry.title],
          onFix: () => setSelectedEntry(entry),
        });
      } else {
        strongCount++;
      }

      // Group for reuse check
      const group = passwordMap.get(entry.password) || [];
      group.push(entry);
      passwordMap.set(entry.password, group);
    });

    // Detect reuse
    let reusedCount = 0;
    passwordMap.forEach((group) => {
      if (group.length > 1) {
        reusedCount += group.length;
        const titles = group.map((e) => e.title);
        issues.push({
          id: `reuse-${titles.join('-')}`,
          title: `Password reused across ${group.length} items`,
          description:
            'Identical password detected across multiple accounts. Credential reuse is a primary security hazard.',
          severity: 'high',
          affectedTitles: titles,
          onFix: () => setSelectedEntry(group[0]),
        });
      }
    });

    const weakDeduction = Math.min(weakCount * 15, 50);
    const reuseDeduction = Math.min(reusedCount * 15, 50);
    const calculatedScore = Math.max(0, 100 - weakDeduction - reuseDeduction);

    return {
      score: calculatedScore,
      weakCount,
      reusedCount,
      strongCount,
      issues,
    };
  }, [entries, isUnlocked]);

  if (!isUnlocked) {
    return (
      <div className="win98-sunken p-8 bg-white text-center flex-1 flex flex-col items-center justify-center">
        <span className="text-3xl mb-2">🔒</span>
        <div className="font-bold text-[12px] text-black mb-1">
          Vault is Locked
        </div>
        <p className="text-[11px] text-neutral-600 max-w-xs">
          Unlock the vault to view security health audit metrics.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-3 min-w-0 text-left">
      {/* Score & Stats */}
      <SecurityScore
        score={securityAnalysis.score}
        totalEntries={entries.length}
      />

      <SecurityStats
        total={entries.length}
        weakCount={securityAnalysis.weakCount}
        reusedCount={securityAnalysis.reusedCount}
        strongCount={securityAnalysis.strongCount}
      />

      {/* Issues Groupbox */}
      <div className="win98-groupbox flex-1">
        <span className="win98-groupbox-legend">
          Detected Security Issues ({securityAnalysis.issues.length})
        </span>

        {securityAnalysis.issues.length === 0 ? (
          <div className="p-4 text-center">
            <span className="text-2xl">✅</span>
            <div className="font-bold text-[11px] text-black mt-1">
              No Issues Found
            </div>
            <p className="text-[10px] text-neutral-600">
              All credentials meet safety standards and no reuse was detected.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5 pt-1 max-h-[300px] overflow-y-auto">
            {securityAnalysis.issues.map((issue) => (
              <SecurityIssue key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </div>

      {/* Edit Entry Modal */}
      <EditEntryModal
        isOpen={selectedEntry !== null}
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
        onSave={async (id, updated) => {
          await editEntry(id, updated);
          setToastMessage('Item updated with stronger password');
        }}
      />

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
