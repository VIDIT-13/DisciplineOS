import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Upload,
  Smartphone,
  Share2,
  Sparkles,
  RefreshCw,
  Cloud,
  CheckCircle2,
} from 'lucide-react';

interface DeviceSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportJson: () => string;
  importJson: (json: string) => boolean;
  onStartFresh: () => void;
  onRestoreDemo: () => void;
  isCleanSlate: boolean;
  syncUserId: string;
  onUpdateSyncUserId: (id: string) => void;
  onManualSync: () => void;
  lastSyncTime: Date;
}

export const DeviceSyncModal: React.FC<DeviceSyncModalProps> = ({
  isOpen,
  onClose,
  exportJson,
  importJson,
  onStartFresh,
  onRestoreDemo,
  isCleanSlate,
  syncUserId,
  onUpdateSyncUserId,
  onManualSync,
  lastSyncTime,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showConfirmFresh, setShowConfirmFresh] = useState(false);
  const [editSyncId, setEditSyncId] = useState(syncUserId);
  const [syncSavedMessage, setSyncSavedMessage] = useState(false);
  const [isSyncingNow, setIsSyncingNow] = useState(false);

  if (!isOpen) return null;

  // Base app URL
  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://ais-pre-ma6wt2xaybxbufvhejjo22-810374431499.asia-east1.run.app';

  // Direct sync URL with user identifier
  const syncUrl = `${baseUrl}?user=${encodeURIComponent(syncUserId)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(syncUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveSyncId = (e: React.FormEvent) => {
    e.preventDefault();
    if (editSyncId.trim()) {
      onUpdateSyncUserId(editSyncId.trim());
      setSyncSavedMessage(true);
      setTimeout(() => setSyncSavedMessage(false), 2500);
    }
  };

  const handleForceSync = async () => {
    setIsSyncingNow(true);
    await onManualSync();
    setTimeout(() => setIsSyncingNow(false), 800);
  };

  const handleCopyBackup = () => {
    const json = exportJson();
    navigator.clipboard.writeText(json);
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 2000);
  };

  const handleDownloadBackup = () => {
    const json = exportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discipline_os_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const success = importJson(importText.trim());
    if (success) {
      setImportStatus('Data successfully imported and cloud-synced!');
      setImportText('');
      setTimeout(() => setImportStatus(null), 3000);
    } else {
      setImportStatus('Invalid backup format. Please verify the JSON.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-[#1C2822] bg-[#111916] p-6 text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A2620] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A3828] text-[#22C55E] border border-[#22C55E]/30">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Cross-Device Cloud Sync</h3>
              <p className="text-xs text-neutral-400">Keep iPhone, Safari, and PC in continuous lockstep</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6">
          {/* Section 1: Active Cloud Sync Status */}
          <div className="rounded-2xl border border-[#22C55E]/40 bg-gradient-to-br from-[#0F261B] to-[#0A1711] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#86EFAC]">
                  Automated Cloud Synchronization Active
                </span>
              </div>
              <button
                onClick={handleForceSync}
                disabled={isSyncingNow}
                className="flex items-center gap-1.5 rounded-lg bg-[#22C55E] px-2.5 py-1 text-[11px] font-bold text-[#090D0B] hover:bg-[#16A34A] transition active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${isSyncingNow ? 'animate-spin' : ''}`} />
                <span>{isSyncingNow ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>
            <p className="mt-2 text-xs text-neutral-300 leading-relaxed">
              Every time you tap <strong className="text-white">YES, COMPLETED</strong>, it instantly saves to the cloud. When you open Safari on your phone, it immediately loads your latest tasks.
            </p>
            <div className="mt-2 text-[10px] font-mono text-neutral-400">
              Account Sync ID: <strong className="text-[#86EFAC]">{syncUserId}</strong> · Last synced: {lastSyncTime.toLocaleTimeString()}
            </div>
          </div>

          {/* Section 2: Direct Safari & Phone Sync Link */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase text-neutral-300">
                1. Your Safari & Phone Direct Sync Link
              </span>
              <span className="text-[10px] text-[#22C55E] font-mono">Real-Time Cloud</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Open this link on your iPhone Safari. It connects directly to your cloud data:
            </p>
            <div className="flex items-center gap-2 rounded-xl border border-[#1C2822] bg-[#090D0B] p-2">
              <input
                type="text"
                readOnly
                value={syncUrl}
                className="w-full bg-transparent px-2 text-xs font-mono text-neutral-300 outline-none select-all truncate"
              />
              <button
                onClick={handleCopyLink}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#22C55E] px-3 py-1.5 text-xs font-semibold text-[#090D0B] hover:bg-[#16A34A] transition active:scale-95"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Section 3: Change Cloud Sync ID if needed */}
          <form onSubmit={handleSaveSyncId} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase text-neutral-300">
                2. Connect Another Device / Change Sync Key
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editSyncId}
                onChange={(e) => setEditSyncId(e.target.value)}
                placeholder="Enter Sync ID (e.g. viditallen4)"
                className="flex-1 rounded-xl border border-[#1C2822] bg-[#090D0B] px-3 py-2 text-xs font-mono text-neutral-200 outline-none focus:border-[#22C55E]"
              />
              <button
                type="submit"
                className="rounded-xl border border-[#22C55E]/40 bg-[#14261D] px-3 py-2 text-xs font-semibold text-[#86EFAC] hover:bg-[#1B3629] transition"
              >
                Update
              </button>
            </div>
            {syncSavedMessage && (
              <p className="text-[11px] font-mono text-[#86EFAC]">
                Sync ID updated! Connected to cloud account.
              </p>
            )}
          </form>

          {/* Section 4: iOS Safari Tips */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase text-neutral-300">
              3. iPhone Safari & Home Screen Sync Note
            </span>
            <div className="rounded-xl border border-[#1C2822] bg-[#0E1713] p-3 text-xs text-neutral-300 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Smartphone className="h-4 w-4 text-[#86EFAC]" />
                <span>Seamless Sync across Browser & Home Screen</span>
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Because DisciplineOS now saves directly to our cloud backend, your completions synchronize whether you open the link in Safari tabs or tap the Home Screen app icon!
              </p>
            </div>
          </div>

          {/* Section 5: Manual Backup / Clean Slate */}
          <div className="space-y-3 pt-2 border-t border-[#1A2620]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase text-neutral-300">
                4. Data Backup & Reset Controls
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyBackup}
                className="flex items-center gap-1.5 rounded-lg border border-[#1C2822] bg-[#16251E] px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white transition"
              >
                {copiedBackup ? <Check className="h-3.5 w-3.5 text-[#22C55E]" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedBackup ? 'Copied' : 'Copy JSON Backup'}</span>
              </button>

              <button
                onClick={handleDownloadBackup}
                className="flex items-center gap-1.5 rounded-lg border border-[#1C2822] bg-[#16251E] px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white transition"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download .JSON</span>
              </button>

              {!isCleanSlate ? (
                <button
                  onClick={() => setShowConfirmFresh(true)}
                  className="rounded-lg border border-red-500/30 bg-red-950/20 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-950/40 transition"
                >
                  Start Fresh Clean Slate
                </button>
              ) : (
                <button
                  onClick={onRestoreDemo}
                  className="flex items-center gap-1.5 rounded-lg border border-[#1C2822] bg-[#16251E] px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white transition"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Restore Sample Data</span>
                </button>
              )}
            </div>

            {/* Paste import */}
            <div className="mt-2 space-y-1.5">
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste backup JSON here to restore..."
                rows={2}
                className="w-full rounded-xl border border-[#1C2822] bg-[#090D0B] p-2.5 text-xs font-mono text-neutral-300 placeholder:text-neutral-600 outline-none focus:border-[#22C55E]"
              />
              {importText.trim() && (
                <button
                  onClick={handleImport}
                  className="flex items-center gap-1.5 rounded-lg bg-[#22C55E] px-3 py-1.5 text-xs font-bold text-[#090D0B] hover:bg-[#16A34A] transition"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Restore & Sync</span>
                </button>
              )}
              {importStatus && (
                <p className="text-xs font-mono text-[#86EFAC]">{importStatus}</p>
              )}
            </div>
          </div>
        </div>

        {/* Clean Slate Confirmation */}
        {showConfirmFresh && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-sm rounded-2xl border border-[#22C55E]/40 bg-[#111916] p-6 text-white shadow-2xl">
              <h4 className="text-base font-bold text-white">Reset Everything to Clean Slate?</h4>
              <p className="mt-2 text-xs text-neutral-300 leading-relaxed">
                This will clear all records and start fresh at 0% across both this device and the cloud.
              </p>
              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowConfirmFresh(false)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onStartFresh();
                    setShowConfirmFresh(false);
                  }}
                  className="rounded-lg bg-[#22C55E] px-4 py-2 text-xs font-bold text-[#090D0B] hover:bg-[#16A34A] transition"
                >
                  Yes, Start Fresh
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
