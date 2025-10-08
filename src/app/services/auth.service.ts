import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';

export interface User {
  id?: number;
  nombre: string;
  email: string;
  password?: string;
  fechaNacimiento?: string;
  celular?: string;
  rol?: string;
  created_at?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api';
  private readonly userKey = 'user';

  constructor(private http: HttpClient) {}

  register(user: User): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/register`,
      user
    ).pipe(
      catchError(err => {
        console.error('❌ Error al registrar:', err);
        return of({ success: false, message: 'Error en el servidor' });
      })
    );
  }

  login(email: string, password: string): Observable<{ success: boolean; user?: User; token?: string; message?: string }> {
    return this.http.post<{ success: boolean; user?: User; token?: string; message?: string }>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap(res => {
        if (res.success && res.user && res.token) {
          this.setUser(res.user, res.token);
        }
      }),
      catchError(err => {
        console.error('❌ Error en login:', err);
        return of({ success: false, message: 'Error en el servidor' });
      })
    );
  }

  private setUser(user: User, token: string): void {
    localStorage.setItem(this.userKey, JSON.stringify({ ...user, token }));
  }

  getUser(): User | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    const user = this.getUser();
    return user ? (user as any).token || null : null;
  }

  logout(): void {
    localStorage.removeItem(this.userKey);
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.rol || null : null;
  }

  /** Método actualizado para cambiar contraseña con email */
  changePassword(email: string, currentPassword: string, newPassword: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/change-password`,
      { email, currentPassword, newPassword }
    ).pipe(
      catchError(err => {
        console.error('❌ Error al cambiar contraseña:', err);
        return of({ success: false, message: 'Error en el servidor' });
      })
    );
  }
}