import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import type { YearMonth } from '@/types/salary';

interface YearMonthPickerProps {
  value: YearMonth;
  onChange: (yearMonth: YearMonth) => void;
  isDark?: boolean;
}

export function YearMonthPicker({ value, onChange, isDark = true }: YearMonthPickerProps) {
  const [open, setOpen] = useState(false);
  const [tempYear, setTempYear] = useState(value.year);
  const [tempMonth, setTempMonth] = useState(value.month);

  useEffect(() => {
    setTempYear(value.year);
    setTempMonth(value.month);
  }, [value, open]);

  const handleConfirm = () => {
    onChange({ year: tempYear, month: tempMonth });
    setOpen(false);
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 动态生成年份列表：选中年份居中，显示前一年、当年、后一年
  const years = Array.from({ length: 3 }, (_, i) => tempYear - 1 + i);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 ${
          isDark 
            ? 'border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-800' 
            : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
        }`}
      >
        <Calendar className="w-4 h-4" />
        <span>{value.year}年{value.month}月</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={`sm:max-w-md ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-slate-100' : 'text-slate-800'}>
              选择年月
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* 年份选择 */}
            <div className="space-y-3">
              <div className={`flex items-center justify-between ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                <span className="text-sm font-medium">年份</span>
                <span className="text-lg font-bold text-blue-500">{tempYear}年</span>
              </div>
              <div className={`flex items-center gap-2 p-2 rounded-lg ${
                isDark ? 'bg-slate-900/50' : 'bg-slate-100'
              }`}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTempYear(y => y - 1)}
                  className={isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1 overflow-x-auto">
                  <div className="flex justify-center gap-1">
                    {years.map(year => (
                      <button
                        key={year}
                        onClick={() => setTempYear(year)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          year === tempYear
                            ? 'bg-blue-500 text-white'
                            : isDark 
                              ? 'text-slate-400 hover:bg-slate-800' 
                              : 'text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTempYear(y => y + 1)}
                  className={isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* 月份选择 */}
            <div className="space-y-3">
              <div className={`flex items-center justify-between ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                <span className="text-sm font-medium">月份</span>
                <span className="text-lg font-bold text-blue-500">{tempMonth}月</span>
              </div>
              <div className={`grid grid-cols-4 gap-2 p-2 rounded-lg ${
                isDark ? 'bg-slate-900/50' : 'bg-slate-100'
              }`}>
                {months.map(month => (
                  <button
                    key={month}
                    onClick={() => setTempMonth(month)}
                    className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                      month === tempMonth
                        ? 'bg-blue-500 text-white'
                        : isDark 
                          ? 'text-slate-400 hover:bg-slate-800' 
                          : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {month}月
                  </button>
                ))}
              </div>
            </div>

            {/* 确认按钮 */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className={`flex-1 ${
                  isDark 
                    ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                    : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                }`}
              >
                取消
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                确认
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
