import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { authGuard } from './guards/auth-guard';
import { Register } from './pages/auth/register/register';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  
  { 
    path: 'dashboard', 
    canActivate: [authGuard], 
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) 
  },
  { 
    path: 'transactions', 
    canActivate: [authGuard], 
    loadChildren: () => import('./pages/transactions/transactions.module').then(m => m.TransactionsModule) 
  },
  
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];