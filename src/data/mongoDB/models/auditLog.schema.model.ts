import { Schema, model } from 'mongoose';
import { AuditLog } from '@data/models';

const AuditLogSchema: Schema<AuditLog> = new Schema(
  {
    auditType: { type: String, required: true, index: true },
    oldValue: {},
    newValue: {},
    modifiedBy: { type: String, required: true },
    invoiceId: { type: String, required: false, minLength: 10, maxLength: 36 },
  },
  { timestamps: true },
);

export const AuditLogModelSchema = model('AuditLog', AuditLogSchema);
