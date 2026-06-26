export type PaymentStatus = "paid" | "unpaid";
export type PaymentMethod = "cash" | "transfer" | "ewallet";

export interface Employee {
  id: string;
  name: string;
  dailySalary: number;
  workingDays: number;
  status: PaymentStatus;
}

export interface InvoiceHeader {
  projectTitle: string;
  invoiceNumber: string;
  paymentDate: string; // ISO date
  personInCharge: string;
  paymentMethod: PaymentMethod;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  notes?: string;
}

export interface SignatureInfo {
  picName: string;
  picImage?: string; // dataURL
  repName: string;
  repImage?: string; // dataURL
}

export interface InvoiceProject {
  id: string;
  header: InvoiceHeader;
  employees: Employee[];
  signature: SignatureInfo;
  createdAt: number;
  updatedAt: number;
}

export interface WorkerTemplate {
  id: string;
  name: string;
  workers: Array<{
    name: string;
    dailySalary: number;
  }>;
  createdAt: number;
}
