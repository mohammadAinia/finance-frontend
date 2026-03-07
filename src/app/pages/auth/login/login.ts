import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

// استيراد مكونات PrimeNG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    CardModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './login.html', /* تأكد من امتداد الملف لديك، قد يكون .component.html */
  styleUrls: ['./login.css']   /* تأكد من امتداد الملف لديك، قد يكون .component.css */
})
export class Login {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = this.loginForm.value;

    // استبدل 3000 بمنفذ الباك إند الخاص بك إذا كان مختلفاً
    this.http.post<any>('https://finance-backend-nvkp.onrender.com/api/auth/login', credentials).subscribe({
      next: (response) => {
        // حفظ التوكن المؤقت للموقع
        localStorage.setItem('token', response.token);

        // 👇 حفظ التوكن الدائم لاختصارات الجوال
        localStorage.setItem('mobileToken', response.mobileToken);

        // التوجيه إلى لوحة التحكم
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'اسم المستخدم أو كلمة المرور غير صحيحة';
        } else {
          this.errorMessage = 'حدث خطأ في الاتصال بالخادم، تأكد من تشغيل الباك إند';
        }
      }
    });
  }
}