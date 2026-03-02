import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  // هذا المتغير سيقرأ الرابط من ملف البيئة (محلي أو سحابي) تلقائياً
  private apiUrl = environment.apiUrl + '/transactions';

  transactions = signal<any[]>([]);

  constructor(private http: HttpClient) {
    this.loadTransactions();
  }

  // 1. جلب البيانات
  loadTransactions() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.transactions.set(data);
      },
      error: (err) => {
        console.error('❌ حدث خطأ أثناء جلب البيانات من الخادم:', err);
      }
    });
  }

  // 2. تعديل عملية
  updateTransaction(id: number, updatedTransaction: any) {
    this.http.put(`${this.apiUrl}/${id}`, updatedTransaction).subscribe({
      next: () => {
        this.transactions.update(txs => txs.map(t => t.Id === id ? { ...updatedTransaction, Id: id } : t));
        console.log('✅ تم التعديل بنجاح');
      },
      error: (err) => console.error('❌ خطأ في التعديل:', err)
    });
  }

  // 3. حذف عملية
  deleteTransaction(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.transactions.update(txs => txs.filter(t => t.Id !== id));
        console.log('✅ تم الحذف بنجاح');
      },
      error: (err) => console.error('❌ خطأ في الحذف:', err)
    });
  }

  // 4. إضافة عملية
  addTransaction(transaction: any) {
    this.http.post<any>(this.apiUrl, transaction).subscribe({
      next: (savedTransaction) => {
        this.transactions.update(currentTransactions => [savedTransaction, ...currentTransactions]);
        console.log('✅ تم حفظ العملية في قاعدة البيانات بنجاح:', savedTransaction);
      },
      error: (err) => {
        console.error('❌ حدث خطأ أثناء حفظ العملية في الخادم:', err);
      }
    });
  }

  // العمليات الحسابية
  totalIncome = computed(() => {
    return this.transactions()
      .filter(t => t.Type === 'income')
      .reduce((sum, current) => sum + Number(current.Amount), 0);
  });

  totalExpenses = computed(() => {
    return this.transactions()
      .filter(t => t.Type === 'expense')
      .reduce((sum, current) => sum + Number(current.Amount), 0);
  });

  totalBalance = computed(() => {
    return this.totalIncome() - this.totalExpenses();
  });
}