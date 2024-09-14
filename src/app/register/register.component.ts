import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  registerError: string | null = null;
  private apiUrl = 'https://crud-productos-nestjs-production.up.railway.app/ansur/api/auth/register';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]]
    });
  }

  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get role() {
    return this.registerForm.get('role');
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, password, role } = this.registerForm.value;
      this.register(name, email, password, role).subscribe({
        next: (response) => {
          console.log('Registro exitoso', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.registerError = 'Error en el registro. Verifica tus datos.';
        }
      });
    }
  }

  private register(name: string, email: string, password: string, role: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(this.apiUrl, { name, email, password, role }, { headers }).pipe(
      tap(response => {
      }),
      catchError(error => {
        throw error;
      })
    );
  }
}
