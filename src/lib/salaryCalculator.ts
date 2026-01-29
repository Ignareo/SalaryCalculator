// 工资计算器核心逻辑 - 累计预扣法

// 个税累进税率表 (2024年标准)
const TAX_BRACKETS = [
  { limit: 36000, rate: 0.03, deduction: 0 },
  { limit: 144000, rate: 0.10, deduction: 2520 },
  { limit: 300000, rate: 0.20, deduction: 16920 },
  { limit: 420000, rate: 0.25, deduction: 31920 },
  { limit: 660000, rate: 0.30, deduction: 52920 },
  { limit: 960000, rate: 0.35, deduction: 85920 },
  { limit: Infinity, rate: 0.45, deduction: 181920 },
];

// 社保缴纳比例 (固定)
const SOCIAL_SECURITY_RATES = {
  pension: 0.08,      // 养老保险 8%
  medical: 0.02,      // 医疗保险 2%
  unemployment: 0.005, // 失业保险 0.5%
};

// 企业社保缴纳比例 (固定)
const COMPANY_RATES = {
  pension: 0.16,      // 养老保险 16%
  medical: 0.10,      // 医疗保险 10%
  unemployment: 0.005, // 失业保险 0.5%
  injury: 0.004,      // 工伤保险 0.4%
  maternity: 0.008,   // 生育保险 0.8%
};

// 企业年金比例
const ANNUITY_RATES = {
  personal: 0.02,  // 个人 2%
  company: 0.08,   // 企业 8%
};

// 工会费比例
const UNION_FEE_RATE = 0.005; // 0.5%

// 个税起征点
const TAX_THRESHOLD = 5000;

// 全局精确度设置
let globalPrecision: 0 | 1 | 2 = 0;

export function setPrecision(precision: 0 | 1 | 2) {
  globalPrecision = precision;
}

export function getPrecision(): 0 | 1 | 2 {
  return globalPrecision;
}

// 年月接口
export interface YearMonth {
  year: number;
  month: number;
}

export interface SalaryInput {
  baseSalary: number;           // 基本工资
  socialSecurityBase: number;   // 社保基数
  quarterlyBonus?: number;      // 季度奖
  performanceBonus?: number;    // 绩效奖
  yearEndBonus?: number;        // 年终奖
  specialDeduction?: number;    // 专项附加扣除
  enableEnterpriseAnnuity?: boolean; // 是否启用企业年金
  enableUnionFee?: boolean;     // 是否启用工会费
  housingFundRate?: number;     // 公积金缴纳比例 (0.05, 0.07, 0.12)
  yearMonth: YearMonth;         // 所属年月
}

// 历史记录月份数据（用于累计预扣计算）
export interface MonthlyTaxRecord {
  yearMonth: YearMonth;
  taxableIncome: number;        // 当月应纳税所得额
  taxPaid: number;              // 当月已交税
}

export interface InsuranceDetail {
  pension: number;              // 养老保险
  medical: number;              // 医疗保险
  unemployment: number;         // 失业保险
  injury: number;               // 工伤保险
  maternity: number;            // 生育保险
  housingFund: number;          // 住房公积金
  enterpriseAnnuity: number;    // 企业年金
}

export interface SalaryResult {
  // 输入项
  baseSalary: number;
  socialSecurityBase: number;
  specialDeduction: number;
  quarterlyBonus: number;
  performanceBonus: number;
  yearEndBonus: number;
  enterpriseAnnuity: number;    // 企业年金金额
  unionFee: number;             // 工会费金额
  housingFundRate: number;      // 公积金比例
  enableEnterpriseAnnuity: boolean;
  enableUnionFee: boolean;
  yearMonth: YearMonth;         // 所属年月
  
  // 计算结果
  grossSalary: number;          // 应发工资 (税前)
  socialInsurance: number;      // 社保总额 (个人) - 五险
  housingFund: number;          // 公积金 (个人)
  enterpriseAnnuityAmount: number; // 企业年金 (个人)
  totalInsurance: number;       // 五险一金/五险二金总额 (个人)
  
  // 累计预扣计算
  monthlyTaxableIncome: number; // 当月应纳税所得额
  accumulatedTaxableIncome: number; // 累计应纳税所得额
  taxRate: number;              // 适用税率
  quickDeduction: number;       // 速算扣除数
  accumulatedTax: number;       // 累计应纳税额
  taxPaidBefore: number;        // 之前月份已交税
  personalIncomeTax: number;    // 当月应交个税
  
  netSalary: number;            // 实发工资 (税后)
  
  // 明细
  insuranceDetail: {
    personal: InsuranceDetail;
    company: InsuranceDetail;
  };
  
  // 工资构成
  composition: {
    netSalary: number;          // 实发
    tax: number;                // 个税
    insurance: number;          // 五险/二金
    unionFee: number;           // 工会费
  };
}

// 根据精确度格式化数字
function formatByPrecision(value: number): number {
  if (globalPrecision === 0) {
    return Math.round(value);
  }
  return Number(value.toFixed(globalPrecision));
}

// 计算五险一金/五险二金
function calculateInsurance(
  base: number,
  housingFundRate: number,
  hasAnnuity: boolean
): { personal: InsuranceDetail; company: InsuranceDetail } {
  const personal: InsuranceDetail = {
    pension: formatByPrecision(base * SOCIAL_SECURITY_RATES.pension),
    medical: formatByPrecision(base * SOCIAL_SECURITY_RATES.medical),
    unemployment: formatByPrecision(base * SOCIAL_SECURITY_RATES.unemployment),
    injury: 0,
    maternity: 0,
    housingFund: formatByPrecision(base * housingFundRate),
    enterpriseAnnuity: hasAnnuity ? formatByPrecision(base * ANNUITY_RATES.personal) : 0,
  };

  const company: InsuranceDetail = {
    pension: formatByPrecision(base * COMPANY_RATES.pension),
    medical: formatByPrecision(base * COMPANY_RATES.medical),
    unemployment: formatByPrecision(base * COMPANY_RATES.unemployment),
    injury: formatByPrecision(base * COMPANY_RATES.injury),
    maternity: formatByPrecision(base * COMPANY_RATES.maternity),
    housingFund: formatByPrecision(base * housingFundRate),
    enterpriseAnnuity: hasAnnuity ? formatByPrecision(base * ANNUITY_RATES.company) : 0,
  };

  return { personal, company };
}

// 计算累计预扣个税
function calculateAccumulatedTax(
  monthlyTaxableIncome: number,
  historyRecords: MonthlyTaxRecord[],
  currentYearMonth: YearMonth
): {
  accumulatedTaxableIncome: number;
  taxRate: number;
  quickDeduction: number;
  accumulatedTax: number;
  taxPaidBefore: number;
  currentMonthTax: number;
} {
  // 计算之前月份的累计应纳税所得额（同一年度）
  let accumulatedTaxableIncome = monthlyTaxableIncome;
  let taxPaidBefore = 0;

  for (const record of historyRecords) {
    if (record.yearMonth.year === currentYearMonth.year) {
      // 只累加当前年度且月份小于等于当前月的记录
      if (record.yearMonth.month < currentYearMonth.month) {
        accumulatedTaxableIncome += record.taxableIncome;
        taxPaidBefore += record.taxPaid;
      }
    }
  }

  // 根据累计应纳税所得额查找税率
  let taxRate = 0.45;
  let quickDeduction = 181920;
  
  for (const bracket of TAX_BRACKETS) {
    if (accumulatedTaxableIncome <= bracket.limit) {
      taxRate = bracket.rate;
      quickDeduction = bracket.deduction;
      break;
    }
  }

  // 累计应纳税额 = 累计应纳税所得额 × 税率 - 速算扣除数
  const accumulatedTax = formatByPrecision(accumulatedTaxableIncome * taxRate - quickDeduction);
  
  // 当月应交税 = 累计应纳税额 - 之前月份已交税
  const currentMonthTax = formatByPrecision(Math.max(0, accumulatedTax - taxPaidBefore));

  return {
    accumulatedTaxableIncome,
    taxRate,
    quickDeduction,
    accumulatedTax,
    taxPaidBefore,
    currentMonthTax,
  };
}

// 主计算函数 - 累计预扣法
export function calculateSalary(
  input: SalaryInput,
  historyRecords: MonthlyTaxRecord[] = []
): SalaryResult {
  const {
    baseSalary,
    socialSecurityBase,
    quarterlyBonus = 0,
    performanceBonus = 0,
    yearEndBonus = 0,
    specialDeduction = 0,
    enableEnterpriseAnnuity = false,
    enableUnionFee = true,
    housingFundRate = 0.12,
    yearMonth,
  } = input;

  // 计算五险一金/五险二金
  const insuranceDetail = calculateInsurance(
    socialSecurityBase,
    housingFundRate,
    enableEnterpriseAnnuity
  );
  
  const personalInsurance = insuranceDetail.personal;
  
  // 社保（五险）
  const socialInsurance = 
    personalInsurance.pension +
    personalInsurance.medical +
    personalInsurance.unemployment;
  
  // 公积金
  const housingFund = personalInsurance.housingFund;
  
  // 企业年金（个人部分）
  const enterpriseAnnuityAmount = personalInsurance.enterpriseAnnuity;
  
  // 五险一金/五险二金总额（用于个税计算）
  const totalInsurance = socialInsurance + housingFund + enterpriseAnnuityAmount;

  // 应发工资 = 基本工资 + 各项奖金
  const grossSalary = baseSalary + quarterlyBonus + performanceBonus + yearEndBonus;

  // 当月应纳税所得额 = 应发工资 - 5000 - 五险一金/二金 - 专项附加扣除
  const monthlyTaxableIncome = Math.max(
    0,
    grossSalary - TAX_THRESHOLD - totalInsurance - specialDeduction
  );

  // 计算累计预扣个税
  const {
    accumulatedTaxableIncome,
    taxRate,
    quickDeduction,
    accumulatedTax,
    taxPaidBefore,
    currentMonthTax,
  } = calculateAccumulatedTax(monthlyTaxableIncome, historyRecords, yearMonth);

  const personalIncomeTax = currentMonthTax;

  // 工会费 = 基本工资 × 0.5%（税后扣除）
  const unionFee = enableUnionFee ? formatByPrecision(baseSalary * UNION_FEE_RATE) : 0;

  // 实发工资 = 应发工资 - 五险一金/二金 - 个税 - 工会费
  const netSalary = grossSalary - totalInsurance - personalIncomeTax - unionFee;

  return {
    baseSalary,
    socialSecurityBase,
    specialDeduction,
    quarterlyBonus,
    performanceBonus,
    yearEndBonus,
    enterpriseAnnuity: enterpriseAnnuityAmount,
    unionFee,
    housingFundRate,
    enableEnterpriseAnnuity,
    enableUnionFee,
    yearMonth,
    grossSalary,
    socialInsurance,
    housingFund,
    enterpriseAnnuityAmount,
    totalInsurance,
    monthlyTaxableIncome,
    accumulatedTaxableIncome,
    taxRate,
    quickDeduction,
    accumulatedTax,
    taxPaidBefore,
    personalIncomeTax,
    netSalary,
    insuranceDetail,
    composition: {
      netSalary,
      tax: personalIncomeTax,
      insurance: totalInsurance,
      unionFee,
    },
  };
}

// 格式化金额 (千分位 + 精确度)
export function formatMoney(amount: number, precision?: 0 | 1 | 2): string {
  const p = precision !== undefined ? precision : globalPrecision;
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: p,
    maximumFractionDigits: p,
  });
}

// 格式化百分比
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

// 获取年度累计数据
export function getYearlyAccumulatedData(
  year: number,
  records: { yearMonth: YearMonth; taxableIncome: number; taxPaid: number; netSalary: number }[]
) {
  const yearRecords = records.filter(r => r.yearMonth.year === year);
  
  return {
    totalMonths: yearRecords.length,
    totalTaxableIncome: yearRecords.reduce((sum, r) => sum + r.taxableIncome, 0),
    totalTaxPaid: yearRecords.reduce((sum, r) => sum + r.taxPaid, 0),
    totalNetSalary: yearRecords.reduce((sum, r) => sum + r.netSalary, 0),
    avgTaxableIncome: yearRecords.length > 0 
      ? yearRecords.reduce((sum, r) => sum + r.taxableIncome, 0) / yearRecords.length 
      : 0,
    avgTaxPaid: yearRecords.length > 0 
      ? yearRecords.reduce((sum, r) => sum + r.taxPaid, 0) / yearRecords.length 
      : 0,
  };
}

// 导出数据为CSV
export function exportToCSV(records: {
  yearMonth: YearMonth;
  baseSalary: number;
  grossSalary: number;
  totalInsurance: number;
  personalIncomeTax: number;
  unionFee: number;
  netSalary: number;
}[]): string {
  const headers = ['年月', '基本工资', '应发工资', '五险一金/二金', '个人所得税', '工会费', '实发工资'];
  const rows = records.map(r => [
    `${r.yearMonth.year}年${r.yearMonth.month}月`,
    r.baseSalary,
    r.grossSalary,
    r.totalInsurance,
    r.personalIncomeTax,
    r.unionFee,
    r.netSalary,
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');
  
  return '\ufeff' + csvContent; // BOM for Excel
}
