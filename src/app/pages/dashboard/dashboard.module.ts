import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayComponent } from './display/display.component';
import { DASHBOARD_ROUTES } from './dashboard-router';
import { RouterModule } from '@angular/router';

// استيراد المكونات
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart'; // أضفنا هذا السطر

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DASHBOARD_ROUTES),
    CardModule,
    ChartModule // وأضفناه هنا
  ],
  declarations: [DisplayComponent]
})
export class DashboardModule { }