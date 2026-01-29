import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  History,
  Trash2,
  Eye,
  AlertTriangle,
  TrendingUp,
  X,
  Download,
  Info,
  Calculator,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import type { SalaryRecord } from '@/types/salary';
import { formatMoney } from '@/lib/salaryCalculator';

interface SalaryRecordsProps {
  records: SalaryRecord[];
  onDelete: (id: string) => void;
  onClear: () => void;
  onExport: () => void;
  isDark?: boolean;
}

export function SalaryRecords({ records, onDelete, onClear, onExport, isDark = true }: SalaryRecordsProps) {
  const [viewRecord, setViewRecord] = useState<SalaryRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const handleClear = () => {
    onClear();
    setShowClearDialog(false);
  };

  if (records.length === 0) {
    return (
      <>
        <Card className={`backdrop-blur-sm transition-colors mb-6 ${
          isDark
            ? 'bg-slate-800/80 border-slate-700/50 shadow-black/20'
            : 'bg-white/80 border-slate-200/50 shadow-slate-200/50'
        }`}>
          <CardHeader>
            <CardTitle className={`text-xl font-semibold flex items-center gap-2 ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`}>
              <History className="w-5 h-5 text-blue-500" />
              工资记录
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center">
            <div className={`text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>暂无工资记录</p>
              <p className="text-sm mt-1">计算并保存后将显示在这里</p>
            </div>
          </CardContent>
        </Card>

        {/* 计算说明板块 */}
        <Card className={`backdrop-blur-sm transition-colors ${
          isDark
            ? 'bg-slate-800/80 border-slate-700/50 shadow-black/20'
            : 'bg-white/80 border-slate-200/50 shadow-slate-200/50'
        }`}>
          <CardHeader>
            <CardTitle className={`text-xl font-semibold flex items-center gap-2 ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`}>
              <BookOpen className="w-5 h-5 text-blue-500" />
              计算说明
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              <AccordionItem value="item-1" className={`border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                <AccordionTrigger className={`hover:no-underline py-4 ${
                  isDark ? 'text-slate-200 hover:text-slate-100' : 'text-slate-700 hover:text-slate-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-500" />
                    <span>累计预扣法</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className={`space-y-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'} pb-4`}>
                    <p>
                      累计预扣法是指，扣缴义务人在一个纳税年度内，以截至当前月份累计支付的工资薪金所得收入额，减除累计基本减除费用、累计专项扣除、累计专项附加扣除和依法确定的累计其他扣除后的余额为累计预扣预缴应纳税所得额。
                    </p>
                    <div className={`rounded-lg p-3 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                      <p className="font-medium mb-2">计算公式：</p>
                      <p className="font-mono text-xs">
                        累计预扣预缴应纳税所得额 = 累计收入 - 累计免税收入 - 累计基本减除费用(5000元/月) - 累计专项扣除 - 累计专项附加扣除 - 累计其他扣除
                      </p>
                    </div>
                    <p>
                      适用累计预扣率计算累计应预扣预缴税额，再减除累计已预扣预缴税额，计算出本期应预扣预缴税额。
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className={`border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                <AccordionTrigger className={`hover:no-underline py-4 ${
                  isDark ? 'text-slate-200 hover:text-slate-100' : 'text-slate-700 hover:text-slate-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>速算扣除数</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className={`space-y-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'} pb-4`}>
                    <p>
                      速算扣除数是为了简化个人所得税计算而设定的常数。在超额累进税率下，按全额累进方法计算的税额与按超额累进方法计算的税额之差，就是速算扣除数。
                    </p>
                    <div className={`rounded-lg overflow-hidden ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className={`${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <th className="px-3 py-2 text-left">级数</th>
                            <th className="px-3 py-2 text-left">累计预扣预缴应纳税所得额</th>
                            <th className="px-3 py-2 text-left">预扣率</th>
                            <th className="px-3 py-2 text-left">速算扣除数</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td className="px-3 py-1.5">1</td><td className="px-3 py-1.5">不超过36,000元</td><td className="px-3 py-1.5">3%</td><td className="px-3 py-1.5">0</td></tr>
                          <tr className={`${isDark ? 'bg-slate-800/50' : 'bg-slate-100/50'}`}><td className="px-3 py-1.5">2</td><td className="px-3 py-1.5">超过36,000至144,000元</td><td className="px-3 py-1.5">10%</td><td className="px-3 py-1.5">2,520</td></tr>
                          <tr><td className="px-3 py-1.5">3</td><td className="px-3 py-1.5">超过144,000至300,000元</td><td className="px-3 py-1.5">20%</td><td className="px-3 py-1.5">16,920</td></tr>
                          <tr className={`${isDark ? 'bg-slate-800/50' : 'bg-slate-100/50'}`}><td className="px-3 py-1.5">4</td><td className="px-3 py-1.5">超过300,000至420,000元</td><td className="px-3 py-1.5">25%</td><td className="px-3 py-1.5">31,920</td></tr>
                          <tr><td className="px-3 py-1.5">5</td><td className="px-3 py-1.5">超过420,000至660,000元</td><td className="px-3 py-1.5">30%</td><td className="px-3 py-1.5">52,920</td></tr>
                          <tr className={`${isDark ? 'bg-slate-800/50' : 'bg-slate-100/50'}`}><td className="px-3 py-1.5">6</td><td className="px-3 py-1.5">超过660,000至960,000元</td><td className="px-3 py-1.5">35%</td><td className="px-3 py-1.5">85,920</td></tr>
                          <tr><td className="px-3 py-1.5">7</td><td className="px-3 py-1.5">超过960,000元</td><td className="px-3 py-1.5">45%</td><td className="px-3 py-1.5">181,920</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs italic">
                      注：本表所称全年应纳税所得额是指依照税法规定，居民个人取得综合所得以每一纳税年度收入额减除费用六万元以及专项扣除、专项附加扣除和依法确定的其他扣除后的余额。
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className={`border-0`}>
                <AccordionTrigger className={`hover:no-underline py-4 ${
                  isDark ? 'text-slate-200 hover:text-slate-100' : 'text-slate-700 hover:text-slate-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-500" />
                    <span>计算示例</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className={`space-y-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'} pb-4`}>
                    <p>
                      假设某员工2026年1-3月的月工资均为20,000元，每月减除费用5,000元，"三险一金"等专项扣除为3,000元，专项附加扣除为2,000元。
                    </p>
                    <div className={`rounded-lg p-3 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                      <p className="font-medium mb-2">1月份计算：</p>
                      <p className="text-xs space-y-1">
                        累计应纳税所得额 = 20,000 - 5,000 - 3,000 - 2,000 = 10,000元<br/>
                        适用税率3%，速算扣除数0<br/>
                        应预扣预缴税额 = 10,000 × 3% - 0 = 300元
                      </p>
                    </div>
                    <div className={`rounded-lg p-3 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                      <p className="font-medium mb-2">2月份计算：</p>
                      <p className="text-xs space-y-1">
                        累计应纳税所得额 = 40,000 - 10,000 - 6,000 - 4,000 = 20,000元<br/>
                        适用税率3%，速算扣除数0<br/>
                        累计应预扣预缴税额 = 20,000 × 3% - 0 = 600元<br/>
                        本期应预扣预缴税额 = 600 - 300 = 300元
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <Card className={`backdrop-blur-sm transition-colors mb-6 ${
        isDark
          ? 'bg-slate-800/80 border-slate-700/50 shadow-black/20'
          : 'bg-white/80 border-slate-200/50 shadow-slate-200/50'
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className={`text-xl font-semibold flex items-center gap-2 ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`}>
              <History className="w-5 h-5 text-blue-500" />
              工资记录
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-500">
                {records.length} 条
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10"
              >
                <Download className="w-4 h-4 mr-1" />
                导出CSV
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowClearDialog(true)}
                className={isDark ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-500 hover:text-red-500 hover:bg-red-50'}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                清空
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={`hover:bg-transparent ${isDark ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                  <TableHead className={isDark ? 'text-slate-400' : 'text-slate-500'}>年月</TableHead>
                  <TableHead className={`text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>基本工资</TableHead>
                  <TableHead className={`text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>应发工资</TableHead>
                  <TableHead className={`text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>五险一金/二金</TableHead>
                  <TableHead className={`text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>个税</TableHead>
                  <TableHead className={`text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>实发工资</TableHead>
                  <TableHead className={`text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow 
                    key={record.id}
                    className={`transition-colors ${
                      isDark 
                        ? 'border-slate-700/30 hover:bg-slate-700/30' 
                        : 'border-slate-200/30 hover:bg-slate-100'
                    }`}
                  >
                    <TableCell className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {record.monthLabel}
                    </TableCell>
                    <TableCell className={`text-right ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {formatMoney(record.baseSalary)}
                    </TableCell>
                    <TableCell className={`text-right ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {formatMoney(record.grossSalary)}
                    </TableCell>
                    <TableCell className="text-violet-500 text-right">
                      {formatMoney(record.totalInsurance)}
                    </TableCell>
                    <TableCell className="text-red-500 text-right">
                      {formatMoney(record.personalIncomeTax)}
                    </TableCell>
                    <TableCell className="text-emerald-500 text-right font-bold">
                      {formatMoney(record.netSalary)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewRecord(record)}
                          className="h-8 w-8 text-blue-500 hover:bg-blue-500/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(record.id)}
                          className="h-8 w-8 text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 查看详情对话框 */}
      <Dialog open={!!viewRecord} onOpenChange={() => setViewRecord(null)}>
        <DialogContent className={`max-w-md ${
          isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              {viewRecord?.monthLabel} 工资详情
            </DialogTitle>
          </DialogHeader>
          
          {viewRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className={`rounded-lg p-3 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                  <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>基本工资</p>
                  <p className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {formatMoney(viewRecord.baseSalary)}
                  </p>
                </div>
                <div className={`rounded-lg p-3 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                  <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>社保基数</p>
                  <p className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {formatMoney(viewRecord.socialSecurityBase)}
                  </p>
                </div>
              </div>

              <div className={`rounded-lg p-3 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                <p className={`text-xs mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>缴纳设置</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>住房公积金</span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{(viewRecord.housingFundRate * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>企业年金</span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{viewRecord.enterpriseAnnuity > 0 ? '已启用' : '未启用'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>工会费</span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{viewRecord.unionFee > 0 ? '已启用' : '未启用'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className={`flex justify-between py-2 border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>应发工资</span>
                  <span className="text-blue-500 font-semibold">{formatMoney(viewRecord.grossSalary)}</span>
                </div>
                <div className={`flex justify-between py-2 border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>五险一金/二金</span>
                  <span className="text-violet-500 font-semibold">{formatMoney(viewRecord.totalInsurance)}</span>
                </div>
                <div className={`flex justify-between py-2 border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>个人所得税</span>
                  <span className="text-red-500 font-semibold">{formatMoney(viewRecord.personalIncomeTax)}</span>
                </div>
                <div className="flex justify-between py-3 bg-emerald-500/10 rounded-lg px-3 mt-2">
                  <span className="text-emerald-500 font-medium">实发工资</span>
                  <span className="text-emerald-500 font-bold text-xl">{formatMoney(viewRecord.netSalary)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className={isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-500">
              <AlertTriangle className="w-5 h-5" />
              确认删除
            </DialogTitle>
            <DialogDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              确定要删除这条工资记录吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className={isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}
            >
              取消
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 计算说明板块 */}
      <Card className={`backdrop-blur-sm transition-colors ${
        isDark
          ? 'bg-slate-800/80 border-slate-700/50 shadow-black/20'
          : 'bg-white/80 border-slate-200/50 shadow-slate-200/50'
      }`}>
        <CardHeader>
          <CardTitle className={`text-xl font-semibold flex items-center gap-2 ${
            isDark ? 'text-slate-100' : 'text-slate-800'
          }`}>
            <BookOpen className="w-5 h-5 text-blue-500" />
            计算说明
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1" className={`border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
              <AccordionTrigger className={`hover:no-underline py-4 ${
                isDark ? 'text-slate-200 hover:text-slate-100' : 'text-slate-700 hover:text-slate-800'
              }`}>
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-500" />
                  <span>累计预扣法</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className={`space-y-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'} pb-4`}>
                  <p>
                    累计预扣法是指，扣缴义务人在一个纳税年度内，以截至当前月份累计支付的工资薪金所得收入额，减除累计基本减除费用、累计专项扣除、累计专项附加扣除和依法确定的累计其他扣除后的余额为累计预扣预缴应纳税所得额。
                  </p>
                  <div className={`rounded-lg p-3 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                    <p className="font-medium mb-2">计算公式：</p>
                    <p className="font-mono text-xs">
                      累计预扣预缴应纳税所得额 = 累计收入 - 累计免税收入 - 累计基本减除费用(5000元/月) - 累计专项扣除 - 累计专项附加扣除 - 累计其他扣除
                    </p>
                  </div>
                  <p>
                    适用累计预扣率计算累计应预扣预缴税额，再减除累计已预扣预缴税额，计算出本期应预扣预缴税额。
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className={`border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
              <AccordionTrigger className={`hover:no-underline py-4 ${
                isDark ? 'text-slate-200 hover:text-slate-100' : 'text-slate-700 hover:text-slate-800'
              }`}>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>速算扣除数</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className={`space-y-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'} pb-4`}>
                  <p>
                    速算扣除数是为了简化个人所得税计算而设定的常数。在超额累进税率下，按全额累进方法计算的税额与按超额累进方法计算的税额之差，就是速算扣除数。
                  </p>
                  <div className={`rounded-lg overflow-hidden ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className={`${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                          <th className="px-3 py-2 text-left">级数</th>
                          <th className="px-3 py-2 text-left">累计预扣预缴应纳税所得额</th>
                          <th className="px-3 py-2 text-left">预扣率</th>
                          <th className="px-3 py-2 text-left">速算扣除数</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td className="px-3 py-1.5">1</td><td className="px-3 py-1.5">不超过36,000元</td><td className="px-3 py-1.5">3%</td><td className="px-3 py-1.5">0</td></tr>
                        <tr className={`${isDark ? 'bg-slate-800/50' : 'bg-slate-100/50'}`}><td className="px-3 py-1.5">2</td><td className="px-3 py-1.5">超过36,000至144,000元</td><td className="px-3 py-1.5">10%</td><td className="px-3 py-1.5">2,520</td></tr>
                        <tr><td className="px-3 py-1.5">3</td><td className="px-3 py-1.5">超过144,000至300,000元</td><td className="px-3 py-1.5">20%</td><td className="px-3 py-1.5">16,920</td></tr>
                        <tr className={`${isDark ? 'bg-slate-800/50' : 'bg-slate-100/50'}`}><td className="px-3 py-1.5">4</td><td className="px-3 py-1.5">超过300,000至420,000元</td><td className="px-3 py-1.5">25%</td><td className="px-3 py-1.5">31,920</td></tr>
                        <tr><td className="px-3 py-1.5">5</td><td className="px-3 py-1.5">超过420,000至660,000元</td><td className="px-3 py-1.5">30%</td><td className="px-3 py-1.5">52,920</td></tr>
                        <tr className={`${isDark ? 'bg-slate-800/50' : 'bg-slate-100/50'}`}><td className="px-3 py-1.5">6</td><td className="px-3 py-1.5">超过660,000至960,000元</td><td className="px-3 py-1.5">35%</td><td className="px-3 py-1.5">85,920</td></tr>
                        <tr><td className="px-3 py-1.5">7</td><td className="px-3 py-1.5">超过960,000元</td><td className="px-3 py-1.5">45%</td><td className="px-3 py-1.5">181,920</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs italic">
                    注：本表所称全年应纳税所得额是指依照税法规定，居民个人取得综合所得以每一纳税年度收入额减除费用六万元以及专项扣除、专项附加扣除和依法确定的其他扣除后的余额。
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className={`border-0`}>
              <AccordionTrigger className={`hover:no-underline py-4 ${
                isDark ? 'text-slate-200 hover:text-slate-100' : 'text-slate-700 hover:text-slate-800'
              }`}>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-500" />
                  <span>计算示例</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className={`space-y-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'} pb-4`}>
                  <p>
                    假设某员工2026年1-3月的月工资均为20,000元，每月减除费用5,000元，"三险一金"等专项扣除为3,000元，专项附加扣除为2,000元。
                  </p>
                  <div className={`rounded-lg p-3 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                    <p className="font-medium mb-2">1月份计算：</p>
                    <p className="text-xs space-y-1">
                      累计应纳税所得额 = 20,000 - 5,000 - 3,000 - 2,000 = 10,000元<br/>
                      适用税率3%，速算扣除数0<br/>
                      应预扣预缴税额 = 10,000 × 3% - 0 = 300元
                    </p>
                  </div>
                  <div className={`rounded-lg p-3 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                    <p className="font-medium mb-2">2月份计算：</p>
                    <p className="text-xs space-y-1">
                      累计应纳税所得额 = 40,000 - 10,000 - 6,000 - 4,000 = 20,000元<br/>
                      适用税率3%，速算扣除数0<br/>
                      累计应预扣预缴税额 = 20,000 × 3% - 0 = 600元<br/>
                      本期应预扣预缴税额 = 600 - 300 = 300元
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* 清空确认对话框 */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent className={isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-500">
              <AlertTriangle className="w-5 h-5" />
              确认清空
            </DialogTitle>
            <DialogDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              确定要清空所有工资记录吗？此操作将删除 {records.length} 条记录，无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowClearDialog(false)}
              className={isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}
            >
              取消
            </Button>
            <Button
              onClick={handleClear}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <X className="w-4 h-4 mr-1" />
              清空全部
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
