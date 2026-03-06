import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    HttpClientModule, 
    RouterModule, // 👈 مهم للتنقل بين الصفحات
    CardModule, 
    InputTextModule, 
    ButtonModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const userData = this.registerForm.value;

    this.http.post<any>('https://finance-backend-nvkp.onrender.com/api/auth/register', userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'تم إنشاء الحساب بنجاح! جاري تحويلك لتسجيل الدخول...';
        
        // تحويل المستخدم لصفحة الدخول بعد ثانيتين
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 400) {
          this.errorMessage = err.error.error || 'حدث خطأ في البيانات المدخلة';
        } else {
          this.errorMessage = 'حدث خطأ في الاتصال بالخادم';
        }
      }
    });
  }
}