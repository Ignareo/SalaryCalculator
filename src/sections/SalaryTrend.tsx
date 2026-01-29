import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { SalaryRecord } from '@/types/salary';
import { formatMoney } from '@/lib/salaryCalculator';

interface SalaryTrendProps {
  records: SalaryRecord[];
  isDark?: boolean;
}

interface TrendDataItem {
  month: string;
  netSalary: number;
  grossSalary: number;
  tax: number;
  insurance: number;
}

export function SalaryTrend({ records, isDark = true }: SalaryTrendProps) {
  const trendData: TrendDataItem[] = useMemo(() => {
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

  const statistics = useMemo(() => {
    if (records.length === 0) return null;

    const netSalaries = records.map(r => r.netSalary);
    const totalNet = netSalaries.reduce((sum, val) => sum + val, 0);
    const avgNet = totalNet / netSalaries.length;
    const maxNet = Math.max(...netSalaries);
    const minNet = Math.min(...netSalaries);

    // 计算环比变化
    let changePercent = 0;
    let changeDirection: 'up' | 'down' | 'same' = 'same';
    
    if (records.length >= 2) {
      const sorted = records
        .slice()
        .sort((a, b) => {
          if (a.yearMonth.year !== b.yearMonth.year) {
            return a.yearMonth.year - b.yearMonth.year;
          }
          return a.yearMonth.month - b.yearMonth.month;
        });
      const latest = sorted[sorted.length - 1].netSalary;
      const previous = sorted[sorted.length - 2].netSalary;
      changePercent = previous > 0 ? ((latest - previous) / previous) * 100 : 0;
      
      if (changePercent > 0) changeDirection = 'up';
      else if (changePercent < 0) changeDirection = 'down';
    }

    return {
      avgNet,
      maxNet,
      minNet,
      totalNet,
      changePercent: Math.abs(changePercent).toFixed(1),
      changeDirection,
    };
  }, [records]);

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

  if (records.length === 0) {
    return (
      <Card className={`backdrop-blur-sm transition-colors ${
        isDark 
          ? 'bg-slate-800/80 border-slate-700/50 shadow-black/20' 
          : 'bg-white/80 border-slate-200/50 shadow-slate-200/50'
      }`}>
        <CardHeader>
          <CardTitle className={`text-xl font-semibold flex items-center gap-2 ${
            isDark ? 'text-slate-100' : 'text-slate-800'
          }`}>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            工资趋势
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className={`text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>暂无趋势数据</p>
            <p className="text-sm mt-1">保存多条记录后将显示趋势图表</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`backdrop-blur-sm transition-colors ${
      isDark 
        ? 'bg-slate-800/80 border-slate-700/50 shadow-black/20' 
        : 'bg-white/80 border-slate-200/50 shadow-slate-200/50'
    }`}>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className={`text-xl font-semibold flex items-center gap-2 ${
            isDark ? 'text-slate-100' : 'text-slate-800'
          }`}>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            工资趋势
          </CardTitle>
          
          {statistics && records.length >= 2 && (
            <div className="flex items-center gap-2">
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>环比</span>
              <Badge 
                variant="secondary" 
                className={`
                  ${statistics.changeDirection === 'up' ? 'bg-emerald-500/20 text-emerald-500' : ''}
                  ${statistics.changeDirection === 'down' ? 'bg-red-500/20 text-red-500' : ''}
                  ${statistics.changeDirection === 'same' ? (isDark ? 'bg-slate-500/20 text-slate-400' : 'bg-slate-200 text-slate-600') : ''}
                `}
              >
                {statistics.changeDirection === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
                {statistics.changeDirection === 'down' && <TrendingDown className="w-3 h-3 mr-1" />}
                {statistics.changeDirection === 'same' && <Minus className="w-3 h-3 mr-1" />}
                {statistics.changePercent}%
              </Badge>
            </div>
          )}
        </div>

        {/* 统计卡片 */}
        {statistics && (
          <div className="grid grid-cols-4 gap-3 mt-4">
            <div className={`rounded-lg p-3 text-center ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
              <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>平均实发</p>
              <p className="text-lg font-bold text-emerald-500">
                {formatMoney(statistics.avgNet)}
              </p>
            </div>
            <div className={`rounded-lg p-3 text-center ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
              <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>最高实发</p>
              <p className="text-lg font-bold text-blue-500">
                {formatMoney(statistics.maxNet)}
              </p>
            </div>
            <div className={`rounded-lg p-3 text-center ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
              <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>最低实发</p>
              <p className="text-lg font-bold text-amber-500">
                {formatMoney(statistics.minNet)}
              </p>
            </div>
            <div className={`rounded-lg p-3 text-center ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
              <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>累计实发</p>
              <p className="text-lg font-bold text-violet-500">
                {formatMoney(statistics.totalNet)}
              </p>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDark ? 'rgba(100, 116, 139, 0.2)' : 'rgba(200, 200, 200, 0.5)'} 
              />
              <XAxis 
                dataKey="month" 
                stroke={isDark ? '#64748b' : '#94a3b8'}
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: isDark ? 'rgba(100, 116, 139, 0.3)' : 'rgba(200, 200, 200, 0.5)' }}
              />
              <YAxis 
                stroke={isDark ? '#64748b' : '#94a3b8'}
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: isDark ? 'rgba(100, 116, 139, 0.3)' : 'rgba(200, 200, 200, 0.5)' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{value}</span>}
              />
              <Line
                type="monotone"
                dataKey="netSalary"
                name="实发工资"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1000}
              />
              <Line
                type="monotone"
                dataKey="grossSalary"
                name="应发工资"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                animationDuration={1000}
              />
              <Line
                type="monotone"
                dataKey="tax"
                name="个人所得税"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                animationDuration={1000}
              />
              <Line
                type="monotone"
                dataKey="insurance"
                name="五险一金/二金"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
