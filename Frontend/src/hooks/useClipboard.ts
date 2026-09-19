import { useState, useCallback, useRef, useEffect } from 'react';

interface UseClipboardOptions {
  clearTimeoutMs?: number;
}

export function useClipboard({ clearTimeoutMs = 30000 }: UseClipboardOptions = {}) {
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCopiedTextRef = useRef<string | null>(null);

  const copyToClipboard = useCallback(
    async (text: string, isSensitive = false) => {
      try {
        await navigator.clipboard.writeText(text);
        lastCopiedTextRef.current = text;
        setCopied(true);

        if (isSensitive) {
          setStatusMessage('Password copied to clipboard (will auto-clear in 30s)');

          if (clearTimerRef.current) {
            clearTimeout(clearTimerRef.current);
          }

          clearTimerRef.current = setTimeout(async () => {
            try {
              // Read current clipboard to only clear if it still matches what was copied
              const current = await navigator.clipboard.readText();
              if (current === lastCopiedTextRef.current) {
                await navigator.clipboard.writeText('');
                setStatusMessage('Clipboard cleared for security');
              }
            } catch {
              // If read permission denied, overwrite with empty string
              await navigator.clipboard.writeText('');
              setStatusMessage('Clipboard cleared for security');
            } finally {
              setCopied(false);
              lastCopiedTextRef.current = null;
              if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
              messageTimerRef.current = setTimeout(() => setStatusMessage(null), 3500);
            }
          }, clearTimeoutMs);
        } else {
          setStatusMessage('Copied to clipboard');
          if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
          messageTimerRef.current = setTimeout(() => {
            setCopied(false);
            setStatusMessage(null);
          }, 3000);
        }

        return true;
      } catch (err) {
        console.error('Failed to copy to clipboard', err);
        setStatusMessage('Failed to copy');
        return false;
      }
    },
    [clearTimeoutMs]
  );

  useEffect(() => {
    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, []);

  return {
    copied,
    statusMessage,
    copyToClipboard,
    clearStatus: () => setStatusMessage(null),
  };
}
