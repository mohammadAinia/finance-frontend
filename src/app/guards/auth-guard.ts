import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // التحقق من وجود التوكن في المتصفح
  const token = localStorage.getItem('token');

  if (token) {
    return true; // السماح بالدخول
  } else {
    // إذا لم يكن مسجلاً، اطرده إلى صفحة الدخول!
    router.navigate(['/login']);
    return false;
  }
};