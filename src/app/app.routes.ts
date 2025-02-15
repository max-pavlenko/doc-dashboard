import { Routes } from '@angular/router';
import { authGuard } from '@feature/auth/guards/auth.guard';
import { unAuthGuard } from '@feature/auth/guards/unauth.guard';
import { userRoleMatcher } from '@feature/auth/matchers/user-role.matcher';
import { UserRole } from '@feature/auth/models/auth.model';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('@feature/home/ui/home/home.component'),
  },
  {
    path: 'log-in',
    loadComponent: () => import('@feature/auth/ui/log-in/log-in.component'),
    canActivate: [unAuthGuard],
  },
  {
    path: 'sign-up',
    loadComponent: () => import('@feature/auth/ui/sign-up/sign-up.component'),
    canActivate: [unAuthGuard],
  },
  {
    path: 'documents',
    canActivate: [authGuard],
    canMatch: [userRoleMatcher(UserRole.User)],
    loadComponent: () => import('@feature/documents/ui/user-role/documents/documents.component'),
  },
  {
    path: 'documents',
    canActivate: [authGuard],
    canMatch: [userRoleMatcher(UserRole.Reviewer)],
    loadComponent: () => import('@feature/documents/ui/reviewer-role/documents/documents.component'),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
