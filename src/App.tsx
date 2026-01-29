import { useEffect, useState } from 'react';
import { useSalaryCalculator } from '@/hooks/useSalaryCalculator';
import { SalaryInputForm } from '@/sections/SalaryInputForm';
import { SalaryResultDisplay } from '@/sections/SalaryResult';
import { SalaryChart } from '@/sections/SalaryChart';
import { SalaryRecords } from '@/sections/SalaryRecords';
import { SalaryTrend } from '@/sections/SalaryTrend';
import { StatisticsOverview } from '@/sections/StatisticsOverview';
import { YearlyStatisticsSection } from '@/sections/YearlyStatistics';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Calculator, 
  Github, 
  Heart, 
  Settings, 
  Moon, 
  Sun, 
  Hash
} from 'lucide-react';

function App() {
  const {
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
  } = useSalaryCalculator();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSave = () => {
    if (!result) return;
    saveRecord();
    toast.success('工资记录已保存', {
      description: `${result.yearMonth.year}年${result.yearMonth.month}月工资记录已保存`,
    });
  };

  const handleExport = () => {
    exportData();
    toast.success('数据导出成功', {
      description: 'CSV文件已下载',
    });
  };

  const setPrecision = (precision: 0 | 1 | 2) => {
    updateSettings({ precision });
    toast.success('精确度已更新', {
      description: `现在显示${precision === 0 ? '整数' : precision === 1 ? '1位小数' : '2位小数'}`,
    });
  };

  const isDark = settings.theme === 'dark';

  // 获取当前选中年的年度统计
  const currentYearStats = getYearlyStatistics(formData.year);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800' 
          : 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200'
      }`}>
        {/* 背景装饰 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${
            isDark ? 'bg-blue-500/5' : 'bg-blue-500/10'
          }`} />
          <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${
            isDark ? 'bg-violet-500/5' : 'bg-violet-500/10'
          }`} />
        </div>

        <div className="relative z-10">
          {/* 头部 */}
          <header className={`border-b backdrop-blur-sm transition-colors ${
            isDark ? 'border-slate-800/50' : 'border-slate-200/50'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div 
                className={`flex items-center justify-between transition-all duration-700 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl shadow-lg shadow-blue-500/20">
                    <Calculator className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                      智能工资计算器
                    </h1>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      累计预扣法 · 精准计算个税
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* 设置菜单 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className={isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}
                      >
                        <Settings className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}>
                      <DropdownMenuLabel className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                        精确度设置
                      </DropdownMenuLabel>
                      <DropdownMenuItem 
                        onClick={() => setPrecision(0)}
                        className={settings.precision === 0 ? 'bg-blue-500/20 text-blue-500' : ''}
                      >
                        <Hash className="w-4 h-4 mr-2" />
                        整数 (0位小数)
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setPrecision(1)}
                        className={settings.precision === 1 ? 'bg-blue-500/20 text-blue-500' : ''}
                      >
                        <Hash className="w-4 h-4 mr-2" />
                        1位小数
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setPrecision(2)}
                        className={settings.precision === 2 ? 'bg-blue-500/20 text-blue-500' : ''}
                      >
                        <Hash className="w-4 h-4 mr-2" />
                        2位小数
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator className={isDark ? 'bg-slate-700' : 'bg-slate-200'} />
                      
                      <DropdownMenuLabel className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                        主题
                      </DropdownMenuLabel>
                      <DropdownMenuItem onClick={toggleTheme}>
                        {isDark ? (
                          <>
                            <Sun className="w-4 h-4 mr-2" />
                            切换浅色模式
                          </>
                        ) : (
                          <>
                            <Moon className="w-4 h-4 mr-2" />
                            切换深色模式
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`hidden sm:flex items-center gap-2 transition-colors ${
                      isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Github className="w-5 h-5" />
                    <span className="text-sm">开源项目</span>
                  </a>
                </div>
              </div>
            </div>
          </header>

          {/* 主内容 */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* 统计概览 */}
            <div 
              className={`mb-8 transition-all duration-700 delay-100 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <StatisticsOverview records={records} isDark={isDark} />
            </div>

            {/* 输入和结果区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* 输入表单 */}
              <div 
                className={`transition-all duration-700 delay-200 ${
                  isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
              >
                <SalaryInputForm
                  formData={formData}
                  onUpdateField={updateField}
                  onUpdateYearMonth={updateYearMonth}
                  onCalculate={calculate}
                  isCalculating={isCalculating}
                  isDark={isDark}
                />
              </div>

              {/* 结果展示 */}
              <div 
                className={`transition-all duration-700 delay-300 ${
                  isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
              >
                <SalaryResultDisplay
                  result={result}
                  onSave={handleSave}
                  isDark={isDark}
                  precision={settings.precision}
                />
              </div>
            </div>

            {/* 图表区域 */}
            {result && (
              <div 
                className={`mb-8 transition-all duration-700 ${
                  isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                <SalaryChart result={result} isDark={isDark} />
              </div>
            )}

            {/* 趋势图表 */}
            {records.length > 0 && (
              <div className="mb-8">
                <SalaryTrend records={records} isDark={isDark} />
              </div>
            )}

            {/* 年度统计 - 默认折叠 */}
            {records.length > 0 && availableYears.length > 0 && (
              <div className="mb-8">
                <YearlyStatisticsSection 
                  statistics={currentYearStats} 
                  isDark={isDark} 
                />
              </div>
            )}

            {/* 历史记录 */}
            <div>
              <SalaryRecords
                records={records}
                onDelete={deleteRecord}
                onClear={clearRecords}
                onExport={handleExport}
                isDark={isDark}
              />
            </div>
          </main>

          {/* 页脚 */}
          <footer className={`border-t mt-12 ${isDark ? 'border-slate-800/50' : 'border-slate-200/50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 text-sm ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}>
                <p className="flex items-center gap-1">
                  用 <Heart className="w-4 h-4 text-red-500 fill-red-500" /> 打造
                </p>
                <p>
                  数据仅供参考，实际以当地政策为准 · 采用累计预扣法计算个税
                </p>
              </div>
            </div>
          </footer>
        </div>

        {/* Toast 通知 */}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: isDark ? '#1e293b' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(100, 116, 139, 0.3)' : 'rgba(200, 200, 200, 0.5)'}`,
              color: isDark ? '#f1f5f9' : '#1e293b',
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;
