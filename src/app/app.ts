import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, MenubarModule, CommonModule], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  items: MenuItem[] = [];

  constructor(public router: Router) {}

  ngOnInit() {
    this.items = [
      { label: 'لوحة التحكم', icon: 'pi pi-home', routerLink: '/dashboard' },
      { label: 'العمليات المالية', icon: 'pi pi-wallet', routerLink: '/transactions' },
      // 👇 زر نسخ التوكن لربط الآيفون
      { 
        label: 'ربط الآيفون (نسخ الرمز)', 
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

  // 👇 دالة نسخ التوكن مع رسالة توضيحية
  copyTokenForShortcut() {
    const token = localStorage.getItem('token');
    if (token) {
      navigator.clipboard.writeText(token).then(() => {
        alert('✅ تم نسخ رمز الربط (Token) بنجاح!\n\nاذهب إلى اختصار الآيفون، والصقه كالتالي:\nفي قسم Headers (الترويسات):\n- المفتاح: Authorization\n- القيمة: Bearer مسافة ثم الصق الرمز هنا');
      }).catch(err => {
        alert('حدث خطأ أثناء النسخ.');
      });
    } else {
      alert('⚠️ الرجاء تسجيل الدخول أولاً لنسخ الرمز.');
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthPage(): boolean {
    return this.router.url.includes('login') || this.router.url.includes('register');
  }
}