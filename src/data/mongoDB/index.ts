import { dbConnection } from './dbConnection';
import { InvoiceModelSchema } from './models/invoice.schema.model';
import { AuditLogModelSchema } from '../mongoDB/models/auditLog.schema.model';


const MongoDbCon = dbConnection;
export {
    MongoDbCon,
    InvoiceModelSchema,
    AuditLogModelSchema,
};
