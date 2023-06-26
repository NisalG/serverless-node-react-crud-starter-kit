export enum AuditType {
  INVOICE_ADD = 'INVOICE_ADD',
  INVOICE_EDIT = 'INVOICE_EDIT',
  INVOICE_DELETE = 'INVOICE_DELETE',
}

export interface AuditLog {
  auditType: AuditType;
  oldValue: unknown;
  newValue: unknown;
  modifiedBy: string;
  invoiceId?: string;
}

export interface AuditInput {
  auditType: AuditType;
  oldValue: unknown;
  newValue: unknown;
  modifiedBy: string;
  invoiceId?: string;
}