import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import { get as idbGet, set as idbSet, del as idbDel } from "idb-keyval";
import type {
  Employee,
  InvoiceHeader,
  InvoiceProject,
  PaymentMethod,
  PaymentStatus,
  SignatureInfo,
  WorkerTemplate,
} from "./types";
import { generateInvoiceNumber, uid } from "./format";

const idbStorage: StateStorage = {
  getItem: async (name) => {
    try {
      const v = await idbGet(name);
      return (v as string) ?? null;
    } catch {
      return localStorage.getItem(name);
    }
  },
  setItem: async (name, value) => {
    try {
      await idbSet(name, value);
    } catch {
      localStorage.setItem(name, value);
    }
  },
  removeItem: async (name) => {
    try {
      await idbDel(name);
    } catch {
      localStorage.removeItem(name);
    }
  },
};

const emptyHeader = (): InvoiceHeader => ({
  projectTitle: "",
  invoiceNumber: generateInvoiceNumber(),
  paymentDate: new Date().toISOString().slice(0, 10),
  personInCharge: "",
  paymentMethod: "cash",
  notes: "",
  periodStartDate: "",
  periodEndDate: "",
  autoCalculatePeriod: false,
});

const emptySignature = (): SignatureInfo => ({
  picName: "",
  repName: "",
});

interface InvoiceState {
  header: InvoiceHeader;
  employees: Employee[];
  signature: SignatureInfo;
  drafts: InvoiceProject[];
  templates: WorkerTemplate[];
  lastSavedAt: number | null;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyLogo: string;

  // header
  updateHeader: (patch: Partial<InvoiceHeader>) => void;
  setPaymentMethod: (m: PaymentMethod) => void;

  // employees
  addEmployee: (e?: Partial<Employee>) => void;
  updateEmployee: (id: string, patch: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
  duplicateEmployee: (id: string) => void;
  clearEmployees: () => void;
  setEmployees: (list: Employee[]) => void;
  setStatus: (id: string, status: PaymentStatus) => void;

  // signature
  updateSignature: (patch: Partial<SignatureInfo>) => void;

  // project
  resetProject: () => void;
  loadProject: (p: InvoiceProject) => void;
  currentProject: () => InvoiceProject;

  // drafts
  saveDraft: () => void;
  deleteDraft: (id: string) => void;

  // templates
  saveTemplate: (name: string) => void;
  loadTemplate: (id: string) => void;
  renameTemplate: (id: string, name: string) => void;
  deleteTemplate: (id: string) => void;

  // company
  updateCompany: (patch: { companyName?: string; companyAddress?: string; companyPhone?: string; companyLogo?: string }) => void;
}

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set, get) => ({
      header: emptyHeader(),
      employees: [],
      signature: emptySignature(),
      drafts: [],
      templates: [],
      lastSavedAt: null,
      companyName: "Gaji Harian",
      companyAddress: "",
      companyPhone: "",
      companyLogo: "",

      updateHeader: (patch) =>
        set((s) => ({ header: { ...s.header, ...patch } })),

      setPaymentMethod: (m) =>
        set((s) => ({
          header: {
            ...s.header,
            paymentMethod: m,
            ...(m !== "transfer"
              ? { bankName: undefined, accountNumber: undefined, accountHolder: undefined }
              : {}),
          },
        })),

      addEmployee: (e) =>
        set((s) => ({
          employees: [
            ...s.employees,
            {
              id: uid(),
              name: e?.name ?? "",
              dailySalary: e?.dailySalary ?? 0,
              workingDays: e?.workingDays ?? 1,
              status: e?.status ?? "unpaid",
            },
          ],
        })),

      updateEmployee: (id, patch) =>
        set((s) => ({
          employees: s.employees.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),

      removeEmployee: (id) =>
        set((s) => ({ employees: s.employees.filter((e) => e.id !== id) })),

      duplicateEmployee: (id) =>
        set((s) => {
          const idx = s.employees.findIndex((e) => e.id === id);
          if (idx === -1) return s;
          const orig = s.employees[idx];
          const dup: Employee = { ...orig, id: uid() };
          const copy = [...s.employees];
          copy.splice(idx + 1, 0, dup);
          return { employees: copy };
        }),

      clearEmployees: () => set({ employees: [] }),
      setEmployees: (list) => set({ employees: list }),
      setStatus: (id, status) =>
        set((s) => ({
          employees: s.employees.map((e) => (e.id === id ? { ...e, status } : e)),
        })),

      updateSignature: (patch) =>
        set((s) => ({ signature: { ...s.signature, ...patch } })),

      resetProject: () =>
        set({
          header: emptyHeader(),
          employees: [],
          signature: emptySignature(),
        }),

      currentProject: () => {
        const s = get();
        return {
          id: uid(),
          header: s.header,
          employees: s.employees,
          signature: s.signature,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
      },

      loadProject: (p) =>
        set({
          header: p.header,
          employees: p.employees,
          signature: p.signature ?? emptySignature(),
        }),

      saveDraft: () =>
        set((s) => {
          if (!s.header.projectTitle && s.employees.length === 0) return s;
          const now = Date.now();
          const proj: InvoiceProject = {
            id: s.header.invoiceNumber,
            header: s.header,
            employees: s.employees,
            signature: s.signature,
            createdAt: now,
            updatedAt: now,
          };
          const existing = s.drafts.findIndex((d) => d.id === proj.id);
          const drafts = [...s.drafts];
          if (existing >= 0) drafts[existing] = { ...drafts[existing], ...proj, createdAt: drafts[existing].createdAt };
          else drafts.unshift(proj);
          return { drafts: drafts.slice(0, 50), lastSavedAt: now };
        }),

      deleteDraft: (id) =>
        set((s) => ({ drafts: s.drafts.filter((d) => d.id !== id) })),

      saveTemplate: (name) =>
        set((s) => {
          const tpl: WorkerTemplate = {
            id: uid(),
            name,
            workers: s.employees.map((e) => ({
              name: e.name,
              dailySalary: e.dailySalary,
              kasbon: e.kasbon,
              workingDays: e.workingDays,
            })),
            createdAt: Date.now(),
          };
          return { templates: [tpl, ...s.templates] };
        }),

      loadTemplate: (id) =>
        set((s) => {
          const tpl = s.templates.find((t) => t.id === id);
          if (!tpl) return s;
          return {
            employees: tpl.workers.map((w) => ({
              id: uid(),
              name: w.name,
              dailySalary: w.dailySalary,
              workingDays: w.workingDays ?? 1,
              kasbon: w.kasbon,
              status: "unpaid" as PaymentStatus,
            })),
          };
        }),

      renameTemplate: (id, name) =>
        set((s) => ({
          templates: s.templates.map((t) => (t.id === id ? { ...t, name } : t)),
        })),

      deleteTemplate: (id) =>
        set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),

      updateCompany: (patch) => set((s) => ({ ...s, ...patch })),
    }),
    {
      name: "gajian-harianku-store",
      storage: createJSONStorage(() => idbStorage),
      partialize: (s) => ({
        header: s.header,
        employees: s.employees,
        signature: s.signature,
        drafts: s.drafts,
        templates: s.templates,
        companyName: s.companyName,
        companyAddress: s.companyAddress,
        companyPhone: s.companyPhone,
        companyLogo: s.companyLogo,
      }),
    },
  ),
);

export const totalForEmployee = (e: Employee) =>
  (Number(e.dailySalary) || 0) * (Number(e.workingDays) || 0) - (Number(e.kasbon) || 0);

export const grandTotal = (list: Employee[]) =>
  list.reduce((sum, e) => sum + totalForEmployee(e), 0);

export const totalKasbon = (list: Employee[]) =>
  list.reduce((sum, e) => sum + (Number(e.kasbon) || 0), 0);

export const totalWorkingDays = (list: Employee[]) =>
  list.reduce((sum, e) => sum + (Number(e.workingDays) || 0), 0);
