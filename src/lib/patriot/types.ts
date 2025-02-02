import { z } from 'zod';

export const patriotConfig = z.object({
  apiKey: z.string(),
  companyId: z.string(),
  environment: z.enum(['sandbox', 'production']),
});

export type PatriotConfig = z.infer<typeof patriotConfig>;

export interface PatriotTransaction {
  id: string;
  date: string;
  type: 'revenue' | 'expense' | 'payroll';
  amount: number;
  description: string;
  category: string;
  reference?: string;
}

export interface PatriotEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  payRate: number;
  payType: 'hourly' | 'salary';
  department?: string;
}

export interface PatriotPayrollItem {
  employeeId: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  regularHours: number;
  overtimeHours: number;
  grossPay: number;
  deductions: Record<string, number>;
  netPay: number;
}

export interface PatriotInvoice {
  id: string;
  customerId: string;
  date: string;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'void';
}