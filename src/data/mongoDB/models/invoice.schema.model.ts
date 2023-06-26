import { Schema, model } from 'mongoose';
import { Invoice } from '@data/models/invoice.model';

const invoiceSchema: Schema<Invoice> = new Schema(
  {
    items: [{
      id: { type: String, required: true, minLength: 10, maxLength: 36, index: true },
      price: { type: Number, required: true },
      qty: { type: Number, required: true },
    }],
    total: { type: Number, required: true },
    customerEmail: { type: String, required: true, minlength: 5, maxlength: 200 },
    customerPhone: { type: String, required: true, minlength: 5, maxlength: 200 },
    createdBy: { type: String, required: false, maxlength: 100 },
    updatedBy: { type: String, required: false, maxlength: 100 },
    deletedBy: { type: String, required: false, maxlength: 100 },
  },
  { timestamps: true },
);

export const InvoiceModelSchema = model('Invoice', invoiceSchema);
