import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
// 1. استيراد مزود الاتصال بالإنترنت
import { provideHttpClient } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker'; 

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(), // 2. تفعيله هنا
        providePrimeNG({
            theme: {
                preset: Aura
            }
        }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })
    ]
};