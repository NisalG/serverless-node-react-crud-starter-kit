import { AuditLogModelSchema, MongoDbCon } from "../../data/mongoDB";
import { AuditInput } from '@data/models/auditLog.model';
import { AUDIT_SERVICE } from 'src/constants/commonConstants';
import { Logger } from '@common/logger';

export const auditLog = async (auditInput: AuditInput) => {
  const logger = new Logger(AUDIT_SERVICE);
  logger.Info({ message: `Saving audit logs` });

  const uri = process.env.MONGODB_URL;
  await MongoDbCon(uri);

  const auditLog = new AuditLogModelSchema({
    auditType: auditInput.auditType,
    oldValue: auditInput.oldValue,
    newValue: auditInput.newValue,
    modifiedBy: auditInput.modifiedBy,
    invoiceId: auditInput.invoiceId,
  });
  await auditLog.save();
  return auditLog;
};
