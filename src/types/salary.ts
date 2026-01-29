// 年月类型
export interface YearMonth {
  year: number;
  month: number;
}

// 工资记录类型
export interface SalaryRecord {
  id: string;
  yearMonth: YearMonth;       // 年月
  monthLabel: string;         // 显示月份 (2024年1月)
  baseSalary: number;
  socialSecurityBase: number;
  specialDeduction: number;
  quarterlyBonus: number;
  performanceBonus: number;
  yearEndBonus: number;
  enterpriseAnnuity: number;
  unionFee: number;
  housingFundRate: number;
  grossSalary: number;
  totalInsurance: number;
  monthlyTaxableIncome: number;   // 当月应纳税所得额
  accumulatedTaxableIncome: number; // 累计应纳税所得额
  personalIncomeTax: number;
  taxPaidBefore: number;          // 之前月份已交税
  netSalary: number;
  createdAt: number;
}

// 图表数据类型
export interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

export interface TrendDataItem {
  month: string;
  netSalary: number;
  grossSalary: number;
  tax: number;
  insurance: number;
}

// 表单输入类型
export interface SalaryFormData {
  baseSalary: string;
  socialSecurityBase: string;
  quarterlyBonus: string;
  performanceBonus: string;
  yearEndBonus: string;
  specialDeduction: string;     // 专项附加扣除
  housingFundRate: number;      // 公积金比例 (5, 7, 12)
  year: number;                 // 年份
  month: number;                // 月份
  enableQuarterlyBonus: boolean;
  enablePerformanceBonus: boolean;
  enableYearEndBonus: boolean;
  enableEnterpriseAnnuity: boolean;
  enableUnionFee: boolean;
}

// 应用设置
export interface AppSettings {
  precision: 0 | 1 | 2;
  theme: 'dark' | 'light';
}

// 年度统计数据
export interface YearlyStatistics {
  year: number;
  totalMonths: number;
  totalTaxableIncome: number;
  totalTaxPaid: number;
  totalNetSalary: number;
  avgTaxableIncome: number;
  avgTaxPaid: number;
}

// 计算结果类型
export type { SalaryResult, InsuranceDetail, MonthlyTaxRecord } from '@/lib/salaryCalculator';
