import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './productos/productos.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: 'productos',
    component: ProductosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registrate',
    component: RegisterComponent,
  },
  {
    path: '**', 
    redirectTo: '/productos',
    pathMatch: 'full',
  }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
