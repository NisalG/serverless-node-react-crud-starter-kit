export interface Invoice {
  _id: string;
  items : InvoiceItem[];
  total: number;
  customerEmail: string;
  customerPhone: string;
  createdBy: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface InvoiceItem {
  id: string,
  price: number,
  qty: number,
}

export interface InvoiceQueryParam {
  page: number;
  pageSize: number;
}
