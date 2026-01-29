import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { formatMoney } from '@/lib/salaryCalculator';
import type { SalaryResult } from '@/lib/salaryCalculator';

interface SalaryChartProps {
  result: SalaryResult | null;
  isDark?: boolean;
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

export function SalaryChart({ result, isDark = true }: SalaryChartProps) {
  const chartData: ChartDataItem[] = useMemo(() => {
    if (!result) return [];

    const items: ChartDataItem[] = [
      {
        name: '实发工资',
        value: result.composition.netSalary,
        color: '#10b981',
      },
      {
        name: '个人所得税',
        value: result.composition.tax,
        color: '#ef4444',
      },
      {
        name: result.enableEnterpriseAnnuity ? '五险二金' : '五险一金',
        value: result.composition.insurance,
        color: '#8b5cf6',
      },
    ];

    if (result.enableUnionFee && result.composition.unionFee > 0) {
      items.push({
        name: '工会费',
        value: result.composition.unionFee,
        color: '#f59e0b',
      });
    }

    return items.filter(item => item.value > 0);
  }, [result]);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: ChartDataItem }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = chartData.reduce((sum, item) => sum + item.value, 0);
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0';
      
      return (
        <div className={`rounded-lg p-3 shadow-xl border ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <p className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{data.name}</p>
          <p className="text-lg font-bold" style={{ color: data.color }}>
            {formatMoney(data.value)} 元
          </p>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>占比 {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: { payload?: Array<{ value: string; payload: ChartDataItem }> }) => {
    if (!payload) return null;
    
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => {
          const item = entry.payload;
          const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
          
          return (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <div className="text-sm">
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{item.name}</span>
                <span className={`ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!result) {
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
            <PieChartIcon className="w-5 h-5 text-violet-500" />
            工资构成
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className={isDark ? 'text-slate-500' : 'text-slate-400'}>计算后显示图表</p>
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
        <CardTitle className={`text-xl font-semibold flex items-center gap-2 ${
          isDark ? 'text-slate-100' : 'text-slate-800'
        }`}>
          <PieChartIcon className="w-5 h-5 text-violet-500" />
          工资构成
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)'}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* 汇总信息 */}
        <div className={`mt-4 pt-4 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>应发工资</p>
              <p className={`text-lg font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {formatMoney(result.grossSalary)}
              </p>
            </div>
            <div>
              <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>扣除合计</p>
              <p className="text-lg font-bold text-red-500">
                {formatMoney(result.totalInsurance + result.personalIncomeTax + result.unionFee)}
              </p>
            </div>
            <div>
              <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>实发工资</p>
              <p className="text-lg font-bold text-emerald-500">
                {formatMoney(result.netSalary)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
