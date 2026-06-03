export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    paid: 'Pagado',
    pending_receipt: 'Pendiente de comprobante',
    receipt_uploaded: 'Comprobante en revisión',
    rejected: 'Comprobante rechazado',
    late: 'Vencido',
    confirmed: 'Confirmada',
    pending_deposit: 'Pendiente de depósito',
    cancelled: 'Cancelada',
    requested: 'Solicitada',
  };
  return labels[status] || status;
}

export function statusTone(status: string) {
  if (['paid', 'confirmed'].includes(status)) return 'good';
  if (['late', 'rejected', 'cancelled'].includes(status)) return 'danger';
  return 'warn';
}
