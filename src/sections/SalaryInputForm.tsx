import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { YearMonthPicker } from '@/components/YearMonthPicker';
import { Calculator, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import type { SalaryFormData, YearMonth } from '@/types/salary';

interface SalaryInputFormProps {
  formData: SalaryFormData;
  onUpdateField: (field: keyof SalaryFormData, value: string | boolean | number) => void;
  onUpdateYearMonth: (year: number, month: number) => void;
  onCalculate: () => void;
  isCalculating: boolean;
  isDark?: boolean;
}

interface InputFieldProps {
  label: string;
  field: keyof SalaryFormData;
  value: string;
  placeholder?: string;
  suffix?: string;
  isDark: boolean;
  onNumberInput: (field: keyof SalaryFormData, value: string) => void;
}

interface OptionalFieldProps {
  label: string;
  field: keyof SalaryFormData;
  value: string;
  enabled: boolean;
  isDark: boolean;
  onToggle: (checked: boolean) => void;
  onNumberInput: (field: keyof SalaryFormData, value: string) => void;
}

interface ToggleFieldProps {
  label: string;
  description?: string;
  enabled: boolean;
  isDark: boolean;
  onToggle: (checked: boolean) => void;
}

const InputField = ({
  label,
  field,
  value,
  placeholder = '0',
  suffix,
  isDark,
  onNumberInput,
}: InputFieldProps) => (
  <div className="space-y-2">
    <Label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
      {label}
    </Label>
    <div className="relative">
      <Input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onNumberInput(field, e.target.value)}
        placeholder={placeholder}
        className={`h-11 pr-12 transition-all duration-200 ${
          isDark
            ? 'bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            : 'bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
        }`}
      />
      {suffix && (
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${
          isDark ? 'text-slate-500' : 'text-slate-400'
        }`}>
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const OptionalField = ({
  label,
  field,
  value,
  enabled,
  isDark,
  onToggle,
  onNumberInput,
}: OptionalFieldProps) => (
  <div className={`space-y-2 transition-opacity duration-200 ${enabled ? 'opacity-100' : 'opacity-50'}`}>
    <div className="flex items-center justify-between">
      <Label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
        {label}
      </Label>
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-blue-500"
      />
    </div>
    <Input
      type="text"
      inputMode="decimal"
      value={value}
      onChange={(e) => onNumberInput(field, e.target.value)}
      placeholder="0"
      disabled={!enabled}
      className={`h-11 transition-all duration-200 disabled:cursor-not-allowed ${
        isDark
          ? 'bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
          : 'bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
      }`}
    />
  </div>
);

const ToggleField = ({
  label,
  description,
  enabled,
  isDark,
  onToggle,
}: ToggleFieldProps) => (
  <div className={`flex items-center justify-between py-3 px-4 rounded-lg ${
    isDark ? 'bg-slate-900/30' : 'bg-slate-100'
  }`}>
    <div>
      <Label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
        {label}
      </Label>
      {description && (
        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {description}
        </p>
      )}
    </div>
    <Switch
      checked={enabled}
      onCheckedChange={onToggle}
      className="data-[state=checked]:bg-blue-500"
    />
  </div>
);

export function SalaryInputForm({
  formData,
  onUpdateField,
  onUpdateYearMonth,
  onCalculate,
  isCalculating,
  isDark = true,
}: SalaryInputFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleNumberInput = useCallback((field: keyof SalaryFormData, value: string) => {
    const sanitized = value.replace(/[^\d.]/g, '');
    const parts = sanitized.split('.');
    if (parts.length > 2) return;
    onUpdateField(field, sanitized);
  }, [onUpdateField]);

  const handleReset = () => {
    const current = new Date();
    onUpdateField('baseSalary', '10000');
    onUpdateField('socialSecurityBase', '15000');
    onUpdateField('quarterlyBonus', '');
    onUpdateField('performanceBonus', '');
    onUpdateField('yearEndBonus', '');
    onUpdateField('specialDeduction', '0');
    onUpdateField('housingFundRate', 12);
    onUpdateField('enableQuarterlyBonus', false);
    onUpdateField('enablePerformanceBonus', false);
    onUpdateField('enableYearEndBonus', false);
    onUpdateField('enableEnterpriseAnnuity', false);
    onUpdateField('enableUnionFee', true);
    onUpdateYearMonth(current.getFullYear(), current.getMonth() + 1);
  };

  const handleYearMonthChange = (ym: YearMonth) => {
    onUpdateYearMonth(ym.year, ym.month);
  };

  return (
    <Card className={`backdrop-blur-sm shadow-xl overflow-hidden transition-colors ${
      isDark 
        ? 'bg-slate-800/80 border-slate-700/50 shadow-black/20' 
        : 'bg-white/80 border-slate-200/50 shadow-slate-200/50'
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-xl font-semibold flex items-center gap-2 ${
            isDark ? 'text-slate-100' : 'text-slate-800'
          }`}>
            <Calculator className="w-5 h-5 text-blue-500" />
            工资参数
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className={isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            重置
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 年月选择 */}
        <div className="space-y-2">
          <Label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            计算月份
          </Label>
          <YearMonthPicker
            value={{ year: formData.year, month: formData.month }}
            onChange={handleYearMonthChange}
            isDark={isDark}
          />
          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            选择年月以计算累计预扣个税
          </p>
        </div>

        {/* 基础参数组 */}
        <div className="space-y-4">
          <h3 className={`text-sm font-medium uppercase tracking-wider ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            基础参数
          </h3>
          <div className="grid gap-4">
            <InputField
              label="基本工资"
              field="baseSalary"
              value={formData.baseSalary}
              suffix="元"
              isDark={isDark}
              onNumberInput={handleNumberInput}
            />
            <InputField
              label="社保基数"
              field="socialSecurityBase"
              value={formData.socialSecurityBase}
              suffix="元"
              isDark={isDark}
              onNumberInput={handleNumberInput}
            />
            
            {/* 住房公积金滑块 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  住房公积金缴纳比例
                </Label>
                <span className="text-blue-500 font-bold">{formData.housingFundRate}%</span>
              </div>
              <div className="px-1">
                <Slider
                  value={[formData.housingFundRate]}
                  onValueChange={(value) => onUpdateField('housingFundRate', value[0])}
                  min={5}
                  max={12}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className={`flex justify-between text-xs ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}>
                <span>5%</span>
                <span>7%</span>
                <span>12%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 固定扣款项 */}
        <div className="space-y-3">
          <h3 className={`text-sm font-medium uppercase tracking-wider ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            固定扣款项
          </h3>
          <ToggleField
            label="企业年金"
            description="个人缴纳2%，企业缴纳8%"
            enabled={formData.enableEnterpriseAnnuity}
            isDark={isDark}
            onToggle={(checked) => onUpdateField('enableEnterpriseAnnuity', checked)}
          />
          <ToggleField
            label="工会费"
            description="基本工资的0.5%（税后扣除）"
            enabled={formData.enableUnionFee}
            isDark={isDark}
            onToggle={(checked) => onUpdateField('enableUnionFee', checked)}
          />
        </div>

        {/* 附加参数组 */}
        <div className="space-y-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`w-full flex items-center justify-between text-sm font-medium uppercase tracking-wider transition-colors ${
              isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-600'
            }`}
          >
            <span>附加参数 (可选)</span>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          
          <div className={`space-y-4 transition-all duration-300 overflow-hidden ${showAdvanced ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            {/* 专项附加扣除 */}
            <InputField
              label="专项附加扣除"
              field="specialDeduction"
              value={formData.specialDeduction}
              suffix="元"
              isDark={isDark}
              onNumberInput={handleNumberInput}
            />
            
            <OptionalField
              label="季度奖"
              field="quarterlyBonus"
              value={formData.quarterlyBonus}
              enabled={formData.enableQuarterlyBonus}
              isDark={isDark}
              onToggle={(checked) => onUpdateField('enableQuarterlyBonus', checked)}
              onNumberInput={handleNumberInput}
            />
            <OptionalField
              label="绩效奖"
              field="performanceBonus"
              value={formData.performanceBonus}
              enabled={formData.enablePerformanceBonus}
              isDark={isDark}
              onToggle={(checked) => onUpdateField('enablePerformanceBonus', checked)}
              onNumberInput={handleNumberInput}
            />
            <OptionalField
              label="年终奖"
              field="yearEndBonus"
              value={formData.yearEndBonus}
              enabled={formData.enableYearEndBonus}
              isDark={isDark}
              onToggle={(checked) => onUpdateField('enableYearEndBonus', checked)}
              onNumberInput={handleNumberInput}
            />
          </div>
        </div>

        {/* 计算按钮 */}
        <Button
          onClick={onCalculate}
          disabled={isCalculating}
          className="w-full h-12 bg-gradient-to-r from-blue-500 to-violet-500 
                     hover:from-blue-400 hover:to-violet-400
                     text-white font-semibold text-lg rounded-xl
                     shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40
                     transition-all duration-300 transform hover:scale-[1.02]
                     disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isCalculating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              计算中...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              计算工资
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
