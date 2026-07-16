export type PaymentStatus = "paid" | "unpaid";
export type PaymentMethod = "cash" | "transfer" | "ewallet";

export interface Employee {
  id: string;
  name: string;
  dailySalary: number;
  workingDays: number;
  kasbon?: number;
  lembur?: number;
  status: PaymentStatus;
  catatan?: string; // free text, one line per point
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
  periodStartDate?: string; // ISO date
  periodEndDate?: string; // ISO date
  autoCalculatePeriod?: boolean;
}

export interface SignatureInfo {
  picName: string;
  picImage?: string; // dataURL
  repName: string;
  repImage?: string; // dataURL
}

export interface CompanySettings {
  companyName: string;
  companyAddress: string;
  companyPhone?: string;
  companyLogo?: string;
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
    kasbon?: number;
    workingDays?: number;
  }>;
  createdAt: number;
}
