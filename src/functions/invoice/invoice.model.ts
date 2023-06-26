export interface GetInvoiceOutput {
  _id: string;
  items: [id: string, price: number, qty: number];
  total: number;
  customerEmail: string;
  customerPhone: string;
}

export interface InvoiceItem {
  id: string;
  price: number;
  qty: number;
}

export interface AddInvoiceInput {
  items: InvoiceItem[];
  total: number;
  customerEmail: string;
  customerPhone: string;
}

export interface GetInvoicesSuccess {
  data: Invoices;
}

export interface GetInvoiceSuccess {
  data: Invoice;
}

export interface Invoices {
  invoices: object;
}

export interface CreateInvoiceSuccess {
  data: Invoice;
}

export interface Invoice {
  invoice: object;
}

export interface UpdateInvoiceInput {
  items: InvoiceItem[];
  total: number;
  customerEmail: string;
  customerPhone: string;
}

export interface DeleteInvoiceSuccess {
  data: Invoice;
}
