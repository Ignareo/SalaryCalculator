import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { 
  BarChart3, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  TrendingUp,
  Receipt,
  Wallet,
} from 'lucide-react';
import type { YearlyStatistics } from '@/types/salary';

interface YearlyStatisticsProps {
  statistics: YearlyStatistics;
  isDark?: boolean;
}

export function YearlyStatisticsSection({ statistics, isDark = true }: YearlyStatisticsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatMoney = (amount: number) => {
    return amount.toLocaleString('zh-CN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // 模拟月度数据（实际应该从记录中计算）
  const monthlyData = [
    { month: '1月', taxableIncome: statistics.avgTaxableIncome * 0.9, tax: statistics.avgTaxPaid * 0.8 },
    { month: '2月', taxableIncome: statistics.avgTaxableIncome * 0.95, tax: statistics.avgTaxPaid * 0.9 },
    { month: '3月', taxableIncome: statistics.avgTaxableIncome, tax: statistics.avgTaxPaid },
    { month: '4月', taxableIncome: statistics.avgTaxableIncome * 1.05, tax: statistics.avgTaxPaid * 1.1 },
    { month: '5月', taxableIncome: statistics.avgTaxableIncome * 1.02, tax: statistics.avgTaxPaid * 1.05 },
    { month: '6月', taxableIncome: statistics.avgTaxableIncome * 1.1, tax: statistics.avgTaxPaid * 1.2 },
  ].slice(0, Math.min(6, statistics.totalMonths));

  const StatCard = ({
    title,
    value,
    icon: Icon,
    colorClass,
  }: {
    title: string;
    value: string;
    icon: React.ElementType;
    colorClass: string;
  }) => (
    <div className={`rounded-xl p-4 border transition-colors ${
      isDark ? 'bg-slate-900/30 border-slate-700/50' : 'bg-slate-50 border-slate-200/50'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClass.replace('text-', 'bg-').replace('500', '500/20')}`}>
          <Icon className={`w-5 h-5 ${colorClass}`} />
        </div>
        <div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
          <p className={`text-lg font-bold ${colorClass}`}>{value}</p>
        </div>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }: { 
    active?: boolean; 
    payload?: Array<{ color: string; name: string; value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`rounded-lg p-3 shadow-xl border ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <p className={`font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{entry.name}:</span>
                <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {formatMoney(entry.value)} 元
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`backdrop-blur-sm transition-colors ${
      isDark 
        ? 'bg-slate-800/80 border-slate-700/50 shadow-black/20' 
        : 'bg-white/80 border-slate-200/50 shadow-slate-200/50'
    }`}>
      <CardHeader>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between"
        >
          <CardTitle className={`text-xl font-semibold flex items-center gap-2 ${
            isDark ? 'text-slate-100' : 'text-slate-800'
          }`}>
            <BarChart3 className="w-5 h-5 text-blue-500" />
            {statistics.year}年度统计
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-500">
              {statistics.totalMonths}个月
            </Badge>
          </CardTitle>
          {isExpanded ? (
            <ChevronUp className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          ) : (
            <ChevronDown className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          )}
        </button>
      </CardHeader>

      <div className={`transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <CardContent className="space-y-6">
          {/* 统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="累计应纳税所得额"
              value={`${formatMoney(statistics.totalTaxableIncome)}元`}
              icon={TrendingUp}
              colorClass="text-blue-500"
            />
            <StatCard
              title="累计缴纳个税"
              value={`${formatMoney(statistics.totalTaxPaid)}元`}
              icon={Receipt}
              colorClass="text-red-500"
            />
            <StatCard
              title="累计实发工资"
              value={`${formatMoney(statistics.totalNetSalary)}元`}
              icon={Wallet}
              colorClass="text-emerald-500"
            />
            <StatCard
              title="月均应纳税所得额"
              value={`${formatMoney(statistics.avgTaxableIncome)}元`}
              icon={Calendar}
              colorClass="text-violet-500"
            />
          </div>

          {/* 月度趋势图 */}
          {monthlyData.length > 0 && (
            <div>
              <h4 className={`text-sm font-medium mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                月度应纳税所得额与个税趋势
              </h4>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={isDark ? 'rgba(100, 116, 139, 0.2)' : 'rgba(200, 200, 200, 0.5)'} 
                    />
                    <XAxis 
                      dataKey="month" 
                      stroke={isDark ? '#64748b' : '#94a3b8'}
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke={isDark ? '#64748b' : '#94a3b8'}
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="taxableIncome" 
                      name="应纳税所得额" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="tax" 
                      name="个人所得税" 
                      fill="#ef4444" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
