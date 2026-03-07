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

  constructor(public router: Router) { }

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

  // الدالة الفورية (تعمل على الآيفون بنسبة 100%)
  copyTokenForShortcut() {
    // نجلب التوكن الدائم المحفوظ مسبقاً عند تسجيل الدخول
    const longLivedToken = localStorage.getItem('mobileToken');

    if (!longLivedToken) {
      alert('⚠️ الرجاء تسجيل الخروج والدخول مرة أخرى لتفعيل هذه الميزة.');
      return;
    }

    // النسخ اللحظي الفوري بدون انتظار (وهذا ما يحبه نظام iOS)
    navigator.clipboard.writeText(longLivedToken).then(() => {

      alert('✅ تم نسخ الرمز السري بنجاح!\n\nسيتم الآن توجيهك لتحميل الاختصار.\nعندما يطلب منك الآيفون الرمز، فقط اضغط "لصق".');

      // توجيه المستخدم إلى رابط الاختصار الموحد
      const icloudShortcutLink = 'https://www.icloud.com/shortcuts/afa59b2c3e2b4e3e9de04ef0ceac1e57';
      window.open(icloudShortcutLink, '_blank');

    }).catch(err => {
      alert('حدث خطأ أثناء النسخ، حاول من متصفح سفاري.');
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('mobileToken'); // مسح التوكن الدائم من المتصفح عند الخروج
    this.router.navigate(['/login']);
  }



  isAuthPage(): boolean {
    return this.router.url.includes('login') || this.router.url.includes('register');
  }
}