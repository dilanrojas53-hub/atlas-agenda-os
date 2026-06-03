import { statusLabel, statusTone } from '../domain/status';

export function StatusBadge({ status }: { status: string }) {
  return <span className={`status-badge ${statusTone(status)}`}>{statusLabel(status)}</span>;
}
