import type { ReactNode } from 'react';

type AdminDataTableProps = {
  title: string;
  subtitle?: string;
  columns: string[];
  rows: Array<Array<ReactNode>>;
  emptyTitle: string;
  emptyText: string;
  actions?: ReactNode;
};

export function AdminDataTable({ title, subtitle, columns, rows, emptyTitle, emptyText, actions }: AdminDataTableProps) {
  return (
    <article className="card admin-data-card">
      <div className="admin-card-head">
        <div>
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {actions ? <div className="admin-card-actions">{actions}</div> : null}
      </div>
      {rows.length ? (
        <div className="admin-data-table" style={{ ['--cols' as string]: columns.length }}>
          <div className="admin-data-row admin-data-head">
            {columns.map((column) => <span key={column}>{column}</span>)}
          </div>
          {rows.map((row, index) => (
            <div className="admin-data-row" key={index}>
              {row.map((cell, cellIndex) => <span key={cellIndex}>{cell}</span>)}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state"><strong>{emptyTitle}</strong><span>{emptyText}</span></div>
      )}
    </article>
  );
}

export function StatusBadge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'success' | 'warning' | 'danger' | 'neutral' }) {
  return <span className={`status-badge status-${tone}`}>{children}</span>;
}
