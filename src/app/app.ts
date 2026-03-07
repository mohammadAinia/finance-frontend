import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { HttpClient, HttpHeaders } from '@angular/common/http'; // 👈 أضفنا استيراد HttpClient

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, MenubarModule, CommonModule], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  items: MenuItem[] = [];
  
  // 👈 حقن HttpClient للتواصل مع الباك إند
  private http = inject(HttpClient);

  constructor(public router: Router) {}

  ngOnInit() {
    this.items = [
      { label: 'لوحة التحكم', icon: 'pi pi-home', routerLink: '/dashboard' },
      { label: 'العمليات المالية', icon: 'pi pi-wallet', routerLink: '/transactions' },
      { 
        label: 'ربط الآيفون (نسخ الرمز الدائم)', 
        icon: 'pi pi-mobile', 
        command: () => this.copyTokenForShortcut(),
        styleClass: 'mobile-btn' 
      },
      { 
        label: 'تسجيل الخروج', 
        icon: 'pi pi-sign-out', 
        command: () => this.logout(),
        styleClass: 'logout-btn'
      }
    ];
  }

  // 👇 الدالة المحدثة لجلب التوكن الدائم
  copyTokenForShortcut() {
    const webToken = localStorage.getItem('token');
    
    if (!webToken) {
      alert('⚠️ الرجاء تسجيل الدخول أولاً لإنشاء الرمز.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${webToken}`
    });

    // ⚠️ تأكد أن هذا هو رابط الباك إند المرفوع الخاص بك
    const apiUrl = 'https://finance-backend-nvkp.onrender.com/api/auth/mobile-token';

    this.http.get<any>(apiUrl, { headers }).subscribe({
      next: (res) => {
        const longLivedToken = res.mobileToken;
        
        navigator.clipboard.writeText(longLivedToken).then(() => {
          alert('✅ تم إنشاء ونسخ رمز الربط الدائم بنجاح!\n\nهذا الرمز صالح لسنوات ولن يتأثر بتسجيل الخروج من الموقع.\n\nاذهب إلى اختصار الآيفون، والصقه كالتالي:\nفي قسم Headers (الترويسات):\n- المفتاح: Authorization\n- القيمة: Bearer مسافة ثم الصق الرمز هنا');
        }).catch(err => {
          alert('حدث خطأ أثناء النسخ التلقائي، حاول مرة أخرى.');
        });
      },
      error: (err) => {
        console.error(err);
        alert('❌ حدث خطأ أثناء الاتصال بالخادم لإنشاء الرمز.');
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthPage(): boolean {
    return this.router.url.includes('login') || this.router.url.includes('register');
  }
}