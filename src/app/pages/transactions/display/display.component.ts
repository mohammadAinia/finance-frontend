import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../../services/transaction.service'; // تأكد من صحة المسار

@Component({
  selector: 'app-display',
  standalone: false,
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {

  // متغيرات النموذج والنافذة
  displayDialog: boolean = false;
  transactionForm!: FormGroup;
  isEditMode: boolean = false;
  currentEditId: number | null = null;


  // خيارات القوائم المنسدلة
  categoryOptions = [
    { label: 'دخل (راتب/مكافأة)', value: 'دخل' },
    { label: 'مواصلات', value: 'مواصلات' },
    { label: 'صيانة', value: 'صيانة' },
    { label: 'مطاعم', value: 'مطاعم' },
    { label: 'تقنية', value: 'تقنية' }
  ];

  typeOptions = [
    { label: 'دخل', value: 'income' },
    { label: 'مصروف', value: 'expense' }
  ];

  // حقن FormBuilder و TransactionService
  // لاحظ أننا جعلنا transactionService بـ public لكي نتمكن من استخدامه في HTML
  constructor(private fb: FormBuilder, public transactionService: TransactionService) { }

  ngOnInit() {
    // تم حذف البيانات الوهمية من هنا لأن الخدمة تقوم بجلبها تلقائياً من MySQL!

    // تهيئة النموذج التفاعلي
    this.transactionForm = this.fb.group({
      description: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      date: [null, Validators.required],
      category: ['', Validators.required],
      type: ['expense', Validators.required]
    });
  }

  // دالة إظهار النافذة وتصفير النموذج
  showDialog() {
    this.isEditMode = false;
    this.currentEditId = null;
    this.transactionForm.reset({ type: 'expense' });
    this.displayDialog = true;
  }
  editTransaction(tx: any) {
    this.isEditMode = true;
    this.currentEditId = tx.Id;

    this.transactionForm.patchValue({
      description: tx.Description,
      amount: tx.Amount,
      date: new Date(tx.TransactionDate), // تحويل النص إلى تاريخ ليفهمه الـ DatePicker
      category: tx.Category,
      type: tx.Type
    });

    this.displayDialog = true;
  }
  deleteTransaction(id: number) {
    if (confirm('هل أنت متأكد من حذف هذه العملية نهائياً؟')) {
      this.transactionService.deleteTransaction(id);
    }
  }
  // دالة حفظ العملية الجديدة
  saveTransaction() {
    if (this.transactionForm.valid) {
      const formValues = this.transactionForm.value;
      let formattedDate = formValues.date;
      if (formattedDate instanceof Date) {
        formattedDate = formattedDate.toISOString().split('T')[0];
      }

      const txData = {
        Description: formValues.description,
        Amount: formValues.amount,
        TransactionDate: formattedDate,
        Category: formValues.category,
        Type: formValues.type
      };

      if (this.isEditMode && this.currentEditId) {
        // إرسال طلب التعديل مع إضافة subscribe
        this.transactionService.updateTransaction(this.currentEditId, txData).subscribe({
          next: (res) => {
            console.log('تم التعديل بنجاح', res);
            this.displayDialog = false;
          },
          error: (err) => console.error('خطأ في التعديل:', err)
        });
      } else {
        // إرسال طلب الإضافة مع إضافة subscribe
        this.transactionService.addTransaction(txData).subscribe({
          next: (res) => {
            console.log('تمت الإضافة بنجاح', res);
            this.displayDialog = false;
          },
          error: (err) => console.error('خطأ في الإضافة:', err)
        });
      }

      this.displayDialog = false;
    }
  }

  // دالة مساعدة لتحديد لون الوسم
  getSeverity(type: string): 'success' | 'danger' | 'info' | 'warn' | 'secondary' | 'contrast' {
    switch (type) {
      case 'income':
        return 'success';
      case 'expense':
        return 'danger';
      default:
        return 'info';
    }
  }
}