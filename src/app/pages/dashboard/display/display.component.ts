import { Component, OnInit, effect } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service'; // تأكد من المسار

@Component({
  selector: 'app-display',
  standalone: false,
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {

  // متغيرات رسم الدونات (المصروفات)
  chartData: any;
  chartOptions: any;

  // متغيرات الرسم الخطي (التدفق المالي)
  lineChartData: any;
  lineChartOptions: any;

  // حقن الخدمة لربطها بالواجهة
  constructor(public transactionService: TransactionService) { 
    // استخدام effect لمراقبة البيانات: كلما تغيرت، نحدث الرسم البياني تلقائياً!
    effect(() => {
      this.updateChartData();
    });
  }

  ngOnInit() {
    // إعداد الخيارات لرسم الدونات
    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057', 
            font: { family: 'inherit' }
          }
        }
      }
    };

    // إعداد الخيارات للرسم الخطي (Line Chart)
    this.lineChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: '#495057',
            font: { family: 'inherit' }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#495057' },
          grid: { color: '#ebedef' }
        },
        y: {
          ticks: { color: '#495057' },
          grid: { color: '#ebedef' }
        }
      }
    };
  }

  // دالة ذكية لتجميع البيانات من قاعدة البيانات ورسمها
  updateChartData() {
    const txs = this.transactionService.transactions();
    
    // ==================================================
    // 1. حساب بيانات رسم الدونات (توزيع المصروفات)
    // ==================================================
    const expenses = txs.filter(t => t.Type === 'expense');
    const expensesByCategory = expenses.reduce((acc: any, current: any) => {
      if (!acc[current.Category]) {
        acc[current.Category] = 0;
      }
      acc[current.Category] += Number(current.Amount);
      return acc;
    }, {});

    this.chartData = {
      labels: Object.keys(expensesByCategory),
      datasets: [
        {
          data: Object.values(expensesByCategory),
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#AB47BC', '#EF5350'],
          hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#4DD0E1', '#BA68C8', '#E57373']
        }
      ]
    };

    // ==================================================
    // 2. حساب بيانات الرسم الخطي (التدفق المالي الزمني)
    // ==================================================
    const flowData: any = {};

    // تجميع المبالغ حسب كل تاريخ
    txs.forEach(t => {
      // استخراج التاريخ فقط (YYYY-MM-DD)
      const date = new Date(t.TransactionDate).toISOString().split('T')[0]; 
      
      if (!flowData[date]) {
        flowData[date] = { income: 0, expense: 0 };
      }

      if (t.Type === 'income') {
        flowData[date].income += Number(t.Amount);
      } else if (t.Type === 'expense') {
        flowData[date].expense += Number(t.Amount);
      }
    });

    // ترتيب التواريخ من الأقدم للأحدث
    const sortedDates = Object.keys(flowData).sort();
    
    // استخراج مصفوفات الدخل والمصروفات بنفس ترتيب التواريخ
    const incomeData = sortedDates.map(date => flowData[date].income);
    const expenseData = sortedDates.map(date => flowData[date].expense);

    // تعبئة البيانات للرسم الخطي
    this.lineChartData = {
      labels: sortedDates, // التواريخ على المحور السيني
      datasets: [
        {
          label: 'الدخل',
          data: incomeData,
          fill: false,
          borderColor: '#66BB6A', // لون أخضر
          tension: 0.4 // لجعل الخط منحنياً قليلاً بدلاً من زوايا حادة
        },
        {
          label: 'المصروفات',
          data: expenseData,
          fill: false,
          borderColor: '#EF5350', // لون أحمر
          tension: 0.4
        }
      ]
    };
  }
}