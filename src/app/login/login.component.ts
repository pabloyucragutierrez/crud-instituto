import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Importa Router
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;
  private apiUrl = 'https://crud-productos-nestjs-production.up.railway.app/ansur/api/auth/login';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { // Inyecta Router
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.login(email, password).subscribe({
        next: (response) => {
          console.log('Inicio de sesión exitoso', response);
          localStorage.setItem('authToken', response.token);
          this.router.navigate(['/productos']);
        },
        error: (error) => {
          this.loginError = 'Error en el inicio de sesión. Verifica tus credenciales.';
        }
      });
    }
  }

  private login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap(response => {
      }),
      catchError(error => {
        throw error;
      })
    );
  }
}
