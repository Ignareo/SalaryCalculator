import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Wallet, 
  PiggyBank, 
  Receipt,
  ChevronDown,
  ChevronUp,
  Save,
  Building2,
  Calculator,
} from 'lucide-react';
import { formatMoney, formatPercent } from '@/lib/salaryCalculator';
import type { SalaryResult as SalaryResultType } from '@/lib/salaryCalculator';

interface SalaryResultProps {
  result: SalaryResultType | null;
  onSave: () => void;
  isDark?: boolean;
  precision?: 0 | 1 | 2;
}

export function SalaryResultDisplay({ result, onSave, isDark = true, precision = 0 }: SalaryResultProps) {
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [showTaxCalcDetails, setShowTaxCalcDetails] = useState(true);

  if (!result) {
    return (
      <Card className={`backdrop-blur-sm h-full flex items-center justify-center min-h-[400px] transition-colors ${
        isDark 
          ? 'bg-slate-800/80 border-slate-700/50 shadow-black/20' 
          : 'bg-white/80 border-slate-200/50 shadow-slate-200/50'
      }`}>
        <div className={`text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <Wallet className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">输入参数并点击计算</p>
          <p className="text-sm mt-2">工资明细将在这里显示</p>
        </div>
      </Card>
    );
  }

  const formatAmount = (amount: number) => {
    return formatMoney(amount, precision);
  };

  // 判断是五险一金还是五险二金
  const insuranceTitle = result.enableEnterpriseAnnuity ? '五险二金' : '五险一金';

  const MetricCard = ({
    title,
    value,
    icon: Icon,
    colorClass,
    bgClass,
    suffix = '元',
  }: {
    title: string;
    value: number;
    icon: React.ElementType;
    colorClass: string;
    bgClass: string;
    suffix?: string;
  }) => (
    <div className={`${bgClass} rounded-xl p-4 border transition-colors ${
      isDark ? 'border-slate-700/50' : 'border-slate-200/50'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{title}</span>
        <Icon className={`w-5 h-5 ${colorClass}`} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${colorClass}`}>
          {formatAmount(value)}
        </span>
        <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{suffix}</span>
      </div>
    </div>
  );

  const DetailRow = ({
    label,
    value,
    rate,
    highlight = false,
  }: {
    label: string;
    value: number;
    rate?: string;
    highlight?: boolean;
  }) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
      <div className="flex items-center gap-2">
        {rate && (
          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{rate}</span>
        )}
        <span className={`font-medium ${highlight ? (isDark ? 'text-slate-200' : 'text-slate-700') : (isDark ? 'text-slate-300' : 'text-slate-600')}`}>
          {formatAmount(value)} 元
        </span>
      </div>
    </div>
  );

  return (
    <Card className={`backdrop-blur-sm overflow-hidden transition-colors ${
      isDark 
        ? 'bg-slate-800/80 border-slate-700/50 shadow-black/20' 
        : 'bg-white/80 border-slate-200/50 shadow-slate-200/50'
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`text-xl font-semibold flex items-center gap-2 ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`}>
              <Receipt className="w-5 h-5 text-emerald-500" />
              计算结果
            </CardTitle>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {result.yearMonth.year}年{result.yearMonth.month}月
            </p>
          </div>
          <Button
            onClick={onSave}
            variant="outline"
            size="sm"
            className="border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600"
          >
            <Save className="w-4 h-4 mr-1" />
            保存记录
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 关键指标 */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            title="实发工资"
            value={result.netSalary}
            icon={Wallet}
            colorClass="text-emerald-500"
            bgClass="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5"
          />
          <MetricCard
            title="应发工资"
            value={result.grossSalary}
            icon={TrendingUp}
            colorClass="text-blue-500"
            bgClass="bg-gradient-to-br from-blue-500/10 to-blue-600/5"
          />
          <MetricCard
            title="个人所得税"
            value={result.personalIncomeTax}
            icon={Receipt}
            colorClass="text-red-500"
            bgClass="bg-gradient-to-br from-red-500/10 to-red-600/5"
          />
          <MetricCard
            title={insuranceTitle}
            value={result.totalInsurance}
            icon={PiggyBank}
            colorClass="text-violet-500"
            bgClass="bg-gradient-to-br from-violet-500/10 to-violet-600/5"
          />
        </div>

        {/* 累计预扣计算详情 */}
        <div className={`rounded-xl p-4 border transition-colors ${
          isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-slate-50 border-slate-200/50'
        }`}>
          <button
            onClick={() => setShowTaxCalcDetails(!showTaxCalcDetails)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-500" />
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                累计预扣个税计算
              </span>
            </div>
            {showTaxCalcDetails ? (
              <ChevronUp className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            ) : (
              <ChevronDown className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            )}
          </button>

          <div className={`space-y-2 text-sm mt-3 transition-all duration-300 overflow-hidden ${showTaxCalcDetails ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex justify-between">
              <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>当月应纳税所得额</span>
              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{formatAmount(result.monthlyTaxableIncome)} 元</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>累计应纳税所得额</span>
              <span className="text-blue-500 font-medium">{formatAmount(result.accumulatedTaxableIncome)} 元</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>适用税率</span>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-500">
                {formatPercent(result.taxRate)}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>速算扣除数</span>
              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{formatAmount(result.quickDeduction)} 元</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>累计应纳税额</span>
              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{formatAmount(result.accumulatedTax)} 元</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>之前月份已交税</span>
              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{formatAmount(result.taxPaidBefore)} 元</span>
            </div>
            <div className={`flex justify-between py-2 border-t mt-2 ${isDark ? 'border-slate-600/50' : 'border-slate-200'}`}>
              <span className="text-red-500 font-medium">当月应交个税</span>
              <span className="text-red-500 font-bold">{formatAmount(result.personalIncomeTax)} 元</span>
            </div>
          </div>
        </div>

        {/* 实发工资计算 */}
        <div className={`rounded-xl p-4 border transition-colors ${
          isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
        }`}>
          <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
            实发工资计算
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>应发工资</span>
              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{formatAmount(result.grossSalary)} 元</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>- {insuranceTitle}</span>
              <span className="text-violet-500">{formatAmount(result.totalInsurance)} 元</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>- 个人所得税</span>
              <span className="text-red-500">{formatAmount(result.personalIncomeTax)} 元</span>
            </div>
            {result.enableUnionFee && (
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>- 工会费</span>
                <span className="text-amber-500">{formatAmount(result.unionFee)} 元</span>
              </div>
            )}
            <div className={`flex justify-between py-2 border-t mt-2 ${isDark ? 'border-emerald-500/30' : 'border-emerald-200'}`}>
              <span className="text-emerald-500 font-medium">实发工资</span>
              <span className="text-emerald-500 font-bold text-lg">{formatAmount(result.netSalary)} 元</span>
            </div>
          </div>
        </div>

        {/* 详细明细 */}
        <div className="space-y-3">
          {/* 个人缴纳明细 */}
          <button
            onClick={() => setShowPersonalDetails(!showPersonalDetails)}
            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
              isDark 
                ? 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50' 
                : 'bg-slate-50 border-slate-200/50 hover:bg-slate-100'
            }`}
          >
            <span className={`text-sm font-medium flex items-center gap-2 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              <PiggyBank className="w-4 h-4 text-violet-500" />
              {insuranceTitle}明细 (个人缴纳)
            </span>
            {showPersonalDetails ? (
              <ChevronUp className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            ) : (
              <ChevronDown className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            )}
          </button>

          <div className={`space-y-4 transition-all duration-300 overflow-hidden ${showPersonalDetails ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-900/30' : 'bg-slate-50'}`}>
              <div className="space-y-1">
                <DetailRow label="养老保险" value={result.insuranceDetail.personal.pension} rate="8%" />
                <DetailRow label="医疗保险" value={result.insuranceDetail.personal.medical} rate="2%" />
                <DetailRow label="失业保险" value={result.insuranceDetail.personal.unemployment} rate="0.5%" />
                <DetailRow 
                  label="住房公积金" 
                  value={result.insuranceDetail.personal.housingFund} 
                  rate={`${(result.housingFundRate * 100).toFixed(0)}%`}
                />
                {result.enableEnterpriseAnnuity && (
                  <DetailRow label="企业年金" value={result.insuranceDetail.personal.enterpriseAnnuity} rate="2%" />
                )}
                <div className={`flex items-center justify-between py-2 border-t mt-2 ${
                  isDark ? 'border-slate-600/50' : 'border-slate-200'
                }`}>
                  <span className="text-violet-500 font-medium">个人缴纳合计</span>
                  <span className="text-violet-500 font-bold">
                    {formatAmount(result.totalInsurance)} 元
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 企业缴纳明细 - 默认折叠 */}
          <button
            onClick={() => setShowCompanyDetails(!showCompanyDetails)}
            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
              isDark 
                ? 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50' 
                : 'bg-slate-50 border-slate-200/50 hover:bg-slate-100'
            }`}
          >
            <span className={`text-sm font-medium flex items-center gap-2 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              <Building2 className="w-4 h-4 text-blue-500" />
              {insuranceTitle}明细 (企业缴纳)
            </span>
            {showCompanyDetails ? (
              <ChevronUp className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            ) : (
              <ChevronDown className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            )}
          </button>

          <div className={`space-y-4 transition-all duration-300 overflow-hidden ${showCompanyDetails ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-900/30' : 'bg-slate-50'}`}>
              <div className="space-y-1">
                <DetailRow label="养老保险" value={result.insuranceDetail.company.pension} rate="16%" />
                <DetailRow label="医疗保险" value={result.insuranceDetail.company.medical} rate="10%" />
                <DetailRow label="失业保险" value={result.insuranceDetail.company.unemployment} rate="0.5%" />
                <DetailRow label="工伤保险" value={result.insuranceDetail.company.injury} rate="0.4%" />
                <DetailRow label="生育保险" value={result.insuranceDetail.company.maternity} rate="0.8%" />
                <DetailRow 
                  label="住房公积金" 
                  value={result.insuranceDetail.company.housingFund} 
                  rate={`${(result.housingFundRate * 100).toFixed(0)}%`}
                />
                {result.enableEnterpriseAnnuity && (
                  <DetailRow label="企业年金" value={result.insuranceDetail.company.enterpriseAnnuity} rate="8%" />
                )}
                <div className={`flex items-center justify-between py-2 border-t mt-2 ${
                  isDark ? 'border-slate-600/50' : 'border-slate-200'
                }`}>
                  <span className="text-blue-500 font-medium">企业缴纳合计</span>
                  <span className="text-blue-500 font-bold">
                    {formatAmount(
                      result.insuranceDetail.company.pension +
                      result.insuranceDetail.company.medical +
                      result.insuranceDetail.company.unemployment +
                      result.insuranceDetail.company.injury +
                      result.insuranceDetail.company.maternity +
                      result.insuranceDetail.company.housingFund +
                      result.insuranceDetail.company.enterpriseAnnuity
                    )} 元
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
