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
      { label: 'العمليات المالية', icon: 'pi pi-wallet', routerLink: '/transactions' }
    ];
  }

  // 👇 الدالة المحدثة: تخفي الهيدر في كل من صفحة الدخول والتسجيل
  isAuthPage(): boolean {
    return this.router.url.includes('login') || this.router.url.includes('register');
  }
}