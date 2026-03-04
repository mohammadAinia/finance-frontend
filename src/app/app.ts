import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenubarModule], // أضفنا MenubarModule هنا
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  
    items = [
    { label: 'لوحة التحكم', icon: 'pi pi-home', routerLink: '/dashboard' },
    { label: 'العمليات المالية', icon: 'pi pi-wallet', routerLink: '/transactions' }
  ];

  ngOnInit() {
    // تجهيز عناصر القائمة العلوية مع ربطها بالمسارات التي أنشأتها
    this.items = [
      {
        label: 'لوحة التحكم',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
      },
      {
        label: 'العمليات المالية',
        icon: 'pi pi-wallet',
        routerLink: '/transactions'
      }
    ];
  }
}