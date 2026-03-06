import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);

  // تأكد من المنفذ أنه 3001 كما هو في الباك إند
  private apiUrl = 'https://finance-backend-nvkp.onrender.com/api/transactions';

  // Signals لتحديث الواجهة تلقائياً
  transactions = signal<any[]>([]);
  totalBalance = signal<number>(0);
  totalIncome = signal<number>(0);
  totalExpenses = signal<number>(0);

  constructor() {
    // جلب البيانات أول ما يشتغل السيرفيس
    this.loadTransactions();
  }

  // 👇 دالة مساعدة لجلب التوكن من المتصفح ووضعه في الـ Headers
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // 1. جلب العمليات المالية من الباك إند
  loadTransactions() {
    this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.transactions.set(data);
        this.calculateKPIs(data); // تحديث الأرقام العلوية (الكروت)
      },
      error: (err) => console.error('❌ خطأ في جلب البيانات:', err)
    });
  }

  // 2. إضافة عملية جديدة
  addTransaction(transaction: any) {
    return this.http.post<any>(this.apiUrl, transaction, { headers: this.getHeaders() }).pipe(
      tap(() => {
        this.loadTransactions(); // إعادة جلب البيانات لتحديث الجدول بعد الإضافة
      })
    );
  }

  // 3. تحديث عملية
  updateTransaction(id: number, transaction: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, transaction, { headers: this.getHeaders() }).pipe(
      tap(() => this.loadTransactions())
    );
  }

  // 4. حذف عملية
  deleteTransaction(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(() => this.loadTransactions())
    );
  }

  // 👇 دالة حساب الإجماليات وعرضها في كروت الفخامة العلوية
  private calculateKPIs(data: any[]) {
    let income = 0;
    let expenses = 0;

    data.forEach(t => {
      // التأكد من تحويل المبلغ لرقم لتجنب الأخطاء
      const amount = Number(t.Amount);
      if (t.Type === 'income') {
        income += amount;
      } else if (t.Type === 'expense') {
        expenses += amount;
      }
    });

    this.totalIncome.set(income);
    this.totalExpenses.set(expenses);
    this.totalBalance.set(income - expenses);
  }
}