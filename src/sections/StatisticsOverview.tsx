import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  PiggyBank, 
  Receipt, 
  TrendingUp,
} from 'lucide-react';
import type { SalaryRecord } from '@/types/salary';
import { formatMoney } from '@/lib/salaryCalculator';

interface StatisticsOverviewProps {
  records: SalaryRecord[];
  isDark?: boolean;
}

export function StatisticsOverview({ records, isDark = true }: StatisticsOverviewProps) {
  const stats = useMemo(() => {
    if (records.length === 0) {
      return {
        totalNet: 0,
        totalTax: 0,
        totalInsurance: 0,
        avgNet: 0,
        recordCount: 0,
      };
    }

    const totalNet = records.reduce((sum, r) => sum + r.netSalary, 0);
    const totalTax = records.reduce((sum, r) => sum + r.personalIncomeTax, 0);
    const totalInsurance = records.reduce((sum, r) => sum + r.totalInsurance, 0);

    return {
      totalNet,
      totalTax,
      totalInsurance,
      avgNet: totalNet / records.length,
      recordCount: records.length,
    };
  }, [records]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    colorClass,
    bgClass,
    badge,
  }: {
    title: string;
    value: number;
    icon: React.ElementType;
    colorClass: string;
    bgClass: string;
    badge?: string;
  }) => (
    <Card className={`backdrop-blur-sm overflow-hidden transition-colors ${
      isDark 
        ? `${bgClass} border-slate-700/30` 
        : 'bg-white/80 border-slate-200/50'
    }`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{title}</span>
              {badge && (
                <Badge variant="secondary" className={isDark ? 'bg-slate-700/50 text-slate-300 text-xs' : 'bg-slate-100 text-slate-600 text-xs'}>
                  {badge}
                </Badge>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-bold ${colorClass}`}>
                {formatMoney(value)}
              </span>
              <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>元</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl ${isDark ? bgClass.replace('/10', '/20').replace('/5', '/10') : 'bg-slate-100'}`}>
            <Icon className={`w-6 h-6 ${colorClass}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (records.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="累计实发工资"
        value={stats.totalNet}
        icon={Wallet}
        colorClass="text-emerald-500"
        bgClass="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5"
        badge={`${stats.recordCount}个月`}
      />
      <StatCard
        title="累计缴纳个税"
        value={stats.totalTax}
        icon={Receipt}
        colorClass="text-red-500"
        bgClass="bg-gradient-to-br from-red-500/10 to-red-600/5"
      />
      <StatCard
        title="累计五险一金/二金"
        value={stats.totalInsurance}
        icon={PiggyBank}
        colorClass="text-violet-500"
        bgClass="bg-gradient-to-br from-violet-500/10 to-violet-600/5"
      />
      <StatCard
        title="月均实发工资"
        value={stats.avgNet}
        icon={TrendingUp}
        colorClass="text-blue-500"
        bgClass="bg-gradient-to-br from-blue-500/10 to-blue-600/5"
      />
    </div>
  );
}
