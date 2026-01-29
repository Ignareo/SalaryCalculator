import { useState, useCallback, useEffect, useMemo } from 'react';
import { calculateSalary, setPrecision, exportToCSV, getYearlyAccumulatedData } from '@/lib/salaryCalculator';
import type { SalaryInput, SalaryResult, YearMonth, MonthlyTaxRecord } from '@/lib/salaryCalculator';
import type { SalaryRecord, SalaryFormData, AppSettings, YearlyStatistics } from '@/types/salary';

const STORAGE_KEY = 'salary_records_v2';
const SETTINGS_KEY = 'salary_settings';

// 获取当前年月
const getCurrentYearMonth = (): YearMonth => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
};

// 默认表单数据
const defaultFormData: SalaryFormData = {
  baseSalary: '10000',
  socialSecurityBase: '15000',
  quarterlyBonus: '',
  performanceBonus: '',
  yearEndBonus: '',
  specialDeduction: '0',
  housingFundRate: 12,
  year: getCurrentYearMonth().year,
  month: getCurrentYearMonth().month,
  enableQuarterlyBonus: false,
  enablePerformanceBonus: false,
  enableYearEndBonus: false,
  enableEnterpriseAnnuity: false,
  enableUnionFee: true,
};

// 默认设置
const defaultSettings: AppSettings = {
  precision: 0,
  theme: 'dark',
};

export function useSalaryCalculator() {
  const [formData, setFormData] = useState<SalaryFormData>(defaultFormData);
  const [result, setResult] = useState<SalaryResult | null>(null);
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isCalculating, setIsCalculating] = useState(false);

  // 从 localStorage 加载记录和设置
  useEffect(() => {
    const savedRecords = localStorage.getItem(STORAGE_KEY);
    if (savedRecords) {
      try {
        const parsed = JSON.parse(savedRecords);
        setRecords(parsed);
      } catch (e) {
        console.error('Failed to parse salary records:', e);
      }
    }

    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        setPrecision(parsed.precision);
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
  }, []);

  // 保存记录到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  // 保存设置到 localStorage
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setPrecision(settings.precision);
  }, [settings]);

  // 获取历史记录用于累计预扣计算
  const getHistoryRecords = useCallback((): MonthlyTaxRecord[] => {
    return records.map(r => ({
      yearMonth: r.yearMonth,
      taxableIncome: r.monthlyTaxableIncome,
      taxPaid: r.personalIncomeTax,
    }));
  }, [records]);

  // 更新表单字段
  const updateField = useCallback((field: keyof SalaryFormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // 更新年月
  const updateYearMonth = useCallback((year: number, month: number) => {
    setFormData(prev => ({ ...prev, year, month }));
  }, []);

  // 更新设置
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // 切换主题
  const toggleTheme = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  // 计算工资 - 累计预扣法
  const calculate = useCallback(() => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const yearMonth: YearMonth = {
        year: formData.year,
        month: formData.month,
      };

      const input: SalaryInput = {
        baseSalary: Number(formData.baseSalary) || 0,
        socialSecurityBase: Number(formData.socialSecurityBase) || 0,
        quarterlyBonus: formData.enableQuarterlyBonus ? Number(formData.quarterlyBonus) || 0 : 0,
        performanceBonus: formData.enablePerformanceBonus ? Number(formData.performanceBonus) || 0 : 0,
        yearEndBonus: formData.enableYearEndBonus ? Number(formData.yearEndBonus) || 0 : 0,
        specialDeduction: Number(formData.specialDeduction) || 0,
        enableEnterpriseAnnuity: formData.enableEnterpriseAnnuity,
        enableUnionFee: formData.enableUnionFee,
        housingFundRate: formData.housingFundRate / 100,
        yearMonth,
      };

      const historyRecords = getHistoryRecords();
      const calculated = calculateSalary(input, historyRecords);
      setResult(calculated);
      setIsCalculating(false);
    }, 300);
  }, [formData, getHistoryRecords]);

  // 保存当前计算结果到记录
  const saveRecord = useCallback(() => {
    if (!result) return;

    const newRecord: SalaryRecord = {
      id: Date.now().toString(),
      yearMonth: result.yearMonth,
      monthLabel: `${result.yearMonth.year}年${result.yearMonth.month}月`,
      baseSalary: result.baseSalary,
      socialSecurityBase: result.socialSecurityBase,
      specialDeduction: result.specialDeduction,
      quarterlyBonus: result.quarterlyBonus,
      performanceBonus: result.performanceBonus,
      yearEndBonus: result.yearEndBonus,
      enterpriseAnnuity: result.enterpriseAnnuity,
      unionFee: result.unionFee,
      housingFundRate: result.housingFundRate,
      grossSalary: result.grossSalary,
      totalInsurance: result.totalInsurance,
      monthlyTaxableIncome: result.monthlyTaxableIncome,
      accumulatedTaxableIncome: result.accumulatedTaxableIncome,
      personalIncomeTax: result.personalIncomeTax,
      taxPaidBefore: result.taxPaidBefore,
      netSalary: result.netSalary,
      createdAt: Date.now(),
    };

    setRecords(prev => {
      // 检查是否已存在同年同月的记录，如果存在则替换
      const existingIndex = prev.findIndex(
        r => r.yearMonth.year === newRecord.yearMonth.year && 
             r.yearMonth.month === newRecord.yearMonth.month
      );
      
      if (existingIndex >= 0) {
        const newRecords = [...prev];
        newRecords[existingIndex] = newRecord;
        return newRecords;
      }
      
      return [newRecord, ...prev];
    });
  }, [result]);

  // 删除记录
  const deleteRecord = useCallback((id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  }, []);

  // 清空所有记录
  const clearRecords = useCallback(() => {
    setRecords([]);
  }, []);

  // 导出数据
  const exportData = useCallback(() => {
    const data = records.map(r => ({
      yearMonth: r.yearMonth,
      baseSalary: r.baseSalary,
      grossSalary: r.grossSalary,
      totalInsurance: r.totalInsurance,
      personalIncomeTax: r.personalIncomeTax,
      unionFee: r.unionFee,
      netSalary: r.netSalary,
    }));
    
    const csv = exportToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `工资记录_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, [records]);

  // 获取年度统计
  const getYearlyStatistics = useCallback((year: number): YearlyStatistics => {
    const data = records.map(r => ({
      yearMonth: r.yearMonth,
      taxableIncome: r.monthlyTaxableIncome,
      taxPaid: r.personalIncomeTax,
      netSalary: r.netSalary,
    }));
    
    const stats = getYearlyAccumulatedData(year, data);
    
    return {
      year,
      totalMonths: stats.totalMonths,
      totalTaxableIncome: stats.totalTaxableIncome,
      totalTaxPaid: stats.totalTaxPaid,
      totalNetSalary: stats.totalNetSalary,
      avgTaxableIncome: stats.avgTaxableIncome,
      avgTaxPaid: stats.avgTaxPaid,
    };
  }, [records]);

  // 获取可用年份列表
  const availableYears = useMemo(() => {
    const years = new Set(records.map(r => r.yearMonth.year));
    return Array.from(years).sort((a, b) => b - a);
  }, [records]);

  // 获取趋势数据
  const getTrendData = useCallback(() => {
    return records
      .slice()
      .sort((a, b) => {
        if (a.yearMonth.year !== b.yearMonth.year) {
          return a.yearMonth.year - b.yearMonth.year;
        }
        return a.yearMonth.month - b.yearMonth.month;
      })
      .map(record => ({
        month: record.monthLabel,
        netSalary: record.netSalary,
        grossSalary: record.grossSalary,
        tax: record.personalIncomeTax,
        insurance: record.totalInsurance,
      }));
  }, [records]);

  // 获取统计数据
  const getStatistics = useCallback(() => {
    if (records.length === 0) {
      return {
        totalNetSalary: 0,
        totalTax: 0,
        totalInsurance: 0,
        avgNetSalary: 0,
        recordCount: 0,
      };
    }

    const totalNetSalary = records.reduce((sum, r) => sum + r.netSalary, 0);
    const totalTax = records.reduce((sum, r) => sum + r.personalIncomeTax, 0);
    const totalInsurance = records.reduce((sum, r) => sum + r.totalInsurance, 0);

    return {
      totalNetSalary,
      totalTax,
      totalInsurance,
      avgNetSalary: totalNetSalary / records.length,
      recordCount: records.length,
    };
  }, [records]);

  return {
    formData,
    result,
    records,
    settings,
    availableYears,
    isCalculating,
    updateField,
    updateYearMonth,
    updateSettings,
    toggleTheme,
    calculate,
    saveRecord,
    deleteRecord,
    clearRecords,
    exportData,
    getYearlyStatistics,
    getTrendData,
    getStatistics,
    formatMoney: (amount: number) => {
      return amount.toLocaleString('zh-CN', {
        minimumFractionDigits: settings.precision,
        maximumFractionDigits: settings.precision,
      });
    },
  };
}
