import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// استيراد مكونات PrimeNG المطلوبة للجدول
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DisplayComponent } from './display/display.component';
import { Transactions_ROUTES } from './transactions-router';
import { RouterModule } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(Transactions_ROUTES),
    TableModule,
    TagModule,
    ButtonModule,
    CardModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    SelectModule
  ],
  declarations: [DisplayComponent]
})
export class TransactionsModule { }