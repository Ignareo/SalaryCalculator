# 工资计算器

一款功能全面的中国工资计算器，采用累计预扣法计算个人所得税，支持五险一金/五险二金、企业年金、各类奖金等复杂场景。

---

## 功能特性

- **累计预扣法个税计算** - 严格按照中国税法累计预扣法计算个人所得税
- **五险一金/五险二金** - 支持标准五险一金及企业年金（五险二金）计算
- **多种奖金类型** - 支持季度奖、绩效奖、年终奖
- **专项附加扣除** - 支持专项附加扣除
- **数据持久化** - 使用 localStorage 本地存储，数据不丢失
- **图表可视化** - 饼图展示工资构成，折线图展示工资趋势
- **记录管理** - 保存、查看、删除历史工资记录
- **计算说明** - 内置累计预扣法、速算扣除数说明及计算示例
- **CSV导出** - 支持导出数据为CSV格式，方便在Excel中查看
- **年度统计** - 自动汇总年度工资、个税、五险一金数据

---

## 技术栈

| Category | Technology | Version |
|----------|------------|---------|
| **Frontend Framework** | React | ^19.2.0 |
| **Build Tool** | Vite | ^7.2.4 |
| **Language** | TypeScript | ~5.9.3 |
| **Styling** | Tailwind CSS | ^3.4.19 |
| **UI Components** | shadcn/ui (New York style) | - |
| **Component Primitives** | Radix UI | ^1.x |
| **Charts** | Recharts | ^2.15.4 |
| **Icons** | Lucide React | ^0.562.0 |
| **Form Validation** | Zod | ^4.3.5 |
| **Form Handling** | React Hook Form | ^7.70.0 |
| **Notifications** | Sonner | ^2.0.7 |
| **Date Utilities** | date-fns | ^4.1.0 |

---

## 架构

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ SalaryInput │ │ SalaryResult│ │ Charts & Statistics │   │
│  │    Form     │ │   Display   │ │                     │   │
│  └──────┬──────┘ └──────┬──────┘ └─────────────────────┘   │
└─────────┼───────────────┼───────────────────────────────────┘
          │               │
          ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│              useSalaryCalculator Hook                        │
│         (State Management & LocalStorage Sync)               │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              salaryCalculator.ts (Core Logic)                │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   Insurance  │  │ Accumulated  │  │   Tax Brackets  │   │
│  │  Calculation │  │  Tax Method  │  │   (2024 Standard)│   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 核心模块

| Module | File Path | Description |
|--------|-----------|-------------|
| **Types** | `src/types/salary.ts` | TypeScript type definitions |
| **Calculator Engine** | `src/lib/salaryCalculator.ts` | Salary calculation, tax calculation, CSV export |
| **State Management** | `src/hooks/useSalaryCalculator.ts` | Form state, record management, localStorage sync |
| **UI Sections** | `src/sections/*.tsx` | Feature section components |
| **Base Components** | `src/components/ui/*.tsx` | shadcn/ui base components |

---

## 存储机制

This application uses **localStorage** for data persistence:

| Key | Data | Description |
|-----|------|-------------|
| `salary_records_v2` | SalaryRecord[] | All salary calculation records |
| `salary_settings` | AppSettings | App settings (precision, theme) |

### 数据结构

```typescript
interface SalaryRecord {
  id: string;
  yearMonth: { year: number; month: number };
  monthLabel: string;           // e.g., "2024年1月"
  baseSalary: number;           // 基本工资
  socialSecurityBase: number;   // 社保基数
  specialDeduction: number;     // 专项附加扣除
  quarterlyBonus: number;       // 季度奖
  performanceBonus: number;     // 绩效奖
  yearEndBonus: number;         // 年终奖
  enterpriseAnnuity: number;    // 企业年金
  unionFee: number;             // 工会费
  housingFundRate: number;      // 公积金比例
  grossSalary: number;          // 应发工资
  totalInsurance: number;       // 五险一金总额
  monthlyTaxableIncome: number; // 当月应纳税所得额
  accumulatedTaxableIncome: number; // 累计应纳税所得额
  personalIncomeTax: number;    // 个人所得税
  taxPaidBefore: number;        // 之前月份已交税
  netSalary: number;            // 实发工资
  createdAt: number;            // 创建时间戳
}
```

---

## Windows 本地部署

### 前置要求

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 (comes with Node.js)

### 部署步骤

1. **Clone or download the project**
   ```powershell
   # Using Git
   git clone <repository-url>
   cd 工资计算器
   
   # Or download and extract the ZIP file, then navigate to the folder
   cd D:\Programming\SelfProgram\Kimi_Agent_工资计算器
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Start development server**
   ```powershell
   npm run dev
   ```
   Open http://localhost:5173 in your browser.

4. **Build for production**
   ```powershell
   npm run build
   ```
   The built files will be in the `dist/` directory.

5. **Preview production build**
   ```powershell
   npm run preview
   ```

### 构建输出

After building, the `dist/` folder contains:
- `index.html` - Entry HTML file
- `assets/` - JS and CSS bundles

These are static files that can be served by any web server.

---

## GitHub Pages 部署

This project can be deployed on GitHub Pages.

The project is already configured for GitHub Pages deployment:

- `vite.config.ts` uses `base: './'` for relative paths
- The build outputs static files in `dist/` folder

### 部署步骤

1. **Push code to GitHub repository**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/salary-calculator.git
   git push -u origin main
   ```

2. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `main` (depending on your setup)
   - Folder: `/dist` (if using GitHub Actions) or `/` (root)

3. **Option A: Manual deployment to `gh-pages` branch**
   ```powershell
   # Build the project
   npm run build
   
   # Deploy dist folder to gh-pages branch
   npx gh-pages -d dist
   ```

4. **Option B: GitHub Actions (Recommended)**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: '20'
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

5. **Access your site**
   - URL: `https://username.github.io/salary-calculator/`
   - Available within a few minutes after deployment

---

## 开发指南

### 项目结构

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   └── YearMonthPicker.tsx
├── hooks/
│   └── useSalaryCalculator.ts
├── lib/
│   ├── salaryCalculator.ts  # Core calculation logic
│   └── utils.ts
├── sections/            # Page sections
│   ├── SalaryChart.tsx
│   ├── SalaryInputForm.tsx
│   ├── SalaryRecords.tsx
│   ├── SalaryResult.tsx
│   ├── SalaryTrend.tsx
│   ├── StatisticsOverview.tsx
│   └── YearlyStatistics.tsx
├── types/
│   └── salary.ts        # Type definitions
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

---

### 增加/编辑参数

#### 1. 添加类型定义

Edit `src/types/salary.ts`:

```typescript
// Add to SalaryFormData interface (for form inputs)
export interface SalaryFormData {
  // ... existing fields
  yourNewField: string;  // Form input (string for input handling)
  enableYourNewField: boolean;  // Optional: toggle switch
}

// Add to SalaryRecord interface (for saved records)
export interface SalaryRecord {
  // ... existing fields
  yourNewField: number;  // Stored as number
}
```

#### 2. 添加计算逻辑

Edit `src/lib/salaryCalculator.ts`:

```typescript
// Add to SalaryInput interface (calculator input)
export interface SalaryInput {
  // ... existing fields
  yourNewField?: number;
}

// Add to SalaryResult interface (calculator output)
export interface SalaryResult {
  // ... existing fields
  yourNewField: number;
}

// Modify calculateSalary function
export function calculateSalary(
  input: SalaryInput,
  historyRecords: MonthlyTaxRecord[] = []
): SalaryResult {
  const {
    // ... existing destructuring
    yourNewField = 0,  // Add default value
  } = input;

  // Add your calculation logic here
  // ...

  return {
    // ... existing returns
    yourNewField,
  };
}
```

#### 3. 添加表单输入

Edit `src/sections/SalaryInputForm.tsx`:

```typescript
// Add form field
<div className="space-y-2">
  <Label htmlFor="yourNewField">新参数名称</Label>
  <Input
    id="yourNewField"
    type="number"
    value={formData.yourNewField}
    onChange={(e) => handleChange('yourNewField', e.target.value)}
    placeholder="请输入金额"
  />
</div>
```

#### 4. 添加结果显示

Edit `src/sections/SalaryResult.tsx`:

```typescript
// Add display for the new parameter
<div className="flex justify-between">
  <span>新参数:</span>
  <span>{formatMoney(result.yourNewField)}</span>
</div>
```

---

### 税前与税后参数

Understanding where to place your parameter is crucial:

#### 税前参数

**These affect the taxable income calculation:**

| Parameter | Location | Effect on Calculation |
|-----------|----------|----------------------|
| `baseSalary` | Pre-tax | Added to gross salary, affects tax |
| `quarterlyBonus` | Pre-tax | Added to gross salary, affects tax |
| `performanceBonus` | Pre-tax | Added to gross salary, affects tax |
| `yearEndBonus` | Pre-tax | Added to gross salary, affects tax |
| `specialDeduction` | Pre-tax | Deducted from taxable income |
| `socialInsurance` | Pre-tax | Deducted from taxable income |
| `housingFund` | Pre-tax | Deducted from taxable income |
| `enterpriseAnnuity` | Pre-tax | Deducted from taxable income |

**Formula position:**
```
应纳税所得额 = 应发工资 - 5000 - 五险一金 - 专项附加扣除
```

添加税前参数：

Edit `src/lib/salaryCalculator.ts`:

```typescript
// 1. Add to calculation
const monthlyTaxableIncome = Math.max(
  0,
  grossSalary - TAX_THRESHOLD - totalInsurance - specialDeduction - yourNewPreTaxDeduction
);

// 2. Subtract from net salary
const netSalary = grossSalary - totalInsurance - personalIncomeTax - unionFee - yourNewPreTaxDeduction;
```





#### 税后参数

**These are deducted after tax calculation:**

| Parameter | Location | Effect on Calculation |
|-----------|----------|----------------------|
| `unionFee` | Post-tax | Deducted from net salary, no tax impact |

**Formula position:**
```
实发工资 = 应发工资 - 五险一金 - 个税 - 工会费
```

添加税后参数：

Edit `src/lib/salaryCalculator.ts`:

```typescript
// Add after tax calculation (no effect on taxable income)
const netSalary = grossSalary - totalInsurance - personalIncomeTax - unionFee - yourNewPostTaxDeduction;
```

**For Income additions (收入增加):**

Edit `src/lib/salaryCalculator.ts`:

```typescript
// Add to gross salary
const grossSalary = baseSalary + quarterlyBonus + performanceBonus + yearEndBonus + yourNewIncome;
```

---

### 税率表配置

Edit `src/lib/salaryCalculator.ts` to modify tax brackets:

```typescript
const TAX_BRACKETS = [
  { limit: 36000, rate: 0.03, deduction: 0 },      // 3%
  { limit: 144000, rate: 0.10, deduction: 2520 },  // 10%
  { limit: 300000, rate: 0.20, deduction: 16920 }, // 20%
  { limit: 420000, rate: 0.25, deduction: 31920 }, // 25%
  { limit: 660000, rate: 0.30, deduction: 52920 }, // 30%
  { limit: 960000, rate: 0.35, deduction: 85920 }, // 35%
  { limit: Infinity, rate: 0.45, deduction: 181920 }, // 45%
];
```

### 社保比例配置

Edit `src/lib/salaryCalculator.ts`:

```typescript
// Personal contribution rates
const SOCIAL_SECURITY_RATES = {
  pension: 0.08,      // 养老保险
  medical: 0.02,      // 医疗保险
  unemployment: 0.005, // 失业保险
};

// Company contribution rates
const COMPANY_RATES = {
  pension: 0.16,
  medical: 0.10,
  unemployment: 0.005,
  injury: 0.004,
  maternity: 0.008,
};
```

---

## 可用命令

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (http://localhost:5173) |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

---

## 计算公式

### 1. 五险一金/二金计算
```
社保 = 社保基数 × (8% + 2% + 0.5%) = 社保基数 × 10.5%
公积金 = 社保基数 × 公积金比例 (5%-12%)
企业年金 = 社保基数 × 2% (如启用)
```

### 2. 应发工资
```
应发工资 = 基本工资 + 季度奖 + 绩效奖 + 年终奖
```

### 3. 当月应纳税所得额
```
当月应纳税所得额 = 应发工资 - 5000 - 五险一金/二金 - 专项附加扣除
```

### 4. 累计预扣法计算个税
```
累计应纳税所得额 = 当月应纳税所得额 + 之前月份应纳税所得额
累计应纳税额 = 累计应纳税所得额 × 税率 - 速算扣除数
当月应交个税 = 累计应纳税额 - 之前月份已交税
```

### 5. 实发工资
```
实发工资 = 应发工资 - 五险一金/二金 - 个税 - 工会费
```

---

## License | 许可证

MIT License

---

## Disclaimer | 免责声明

This calculator is for reference only. The calculation results are based on standard tax rates and may not reflect your actual salary due to regional policies, company-specific policies, or other factors. Please consult your HR department for exact figures.

本计算器仅供参考。计算结果基于标准税率，可能因地区政策、公司政策或其他因素与实际工资有差异。具体金额请咨询贵公司人事部门。
