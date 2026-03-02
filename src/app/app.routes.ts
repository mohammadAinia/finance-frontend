import { Routes } from '@angular/router';

export const routes: Routes = [
  // إعادة التوجيه الافتراضية إلى لوحة التحكم عند فتح التطبيق
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  
  // التحميل الكسول (Lazy Load) لقسم الـ Dashboard
  { 
    path: 'dashboard', 
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) 
  },
  
  // التحميل الكسول (Lazy Load) لقسم العمليات
  { 
    path: 'transactions', 
    loadChildren: () => import('./pages/transactions/transactions.module').then(m => m.TransactionsModule) 
  },

  // في حال أدخل المستخدم رابطاً غير موجود
  { path: '**', redirectTo: 'dashboard' }
];