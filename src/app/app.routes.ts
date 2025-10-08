import { Routes } from '@angular/router';
import { BannerComponent } from './paginas_iniciales/banner/banner.component';
import { SaberMasComponent } from './paginas_iniciales/saber-mas/saber-mas.component';
import { CatalogoComponent } from './paginas_iniciales/catalogo_vehiculos/catalogo.component';
import { DashboardComponent } from './dashboard/dasboard/dasboard.component';
import { ContactoComponent } from './paginas_iniciales/contacto/contacto.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormularioAutoComponent } from './autos/formulario-auto.component';
import { RegistroVentaComponent } from './autos/formulario-venta.component';
import { ListaAutosComponent } from './autos/lista-autos.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { GestionUsuariosComponent } from './components/gestion-usuarios/gestion-usuarios.component';
import { CatalogoMejoradoComponent } from './components/catalogo-mejorado/catalogo-mejorado.component';
import { FavoritosComponent } from './components/favoritos/favoritos.component';

// 🔹 Nuevo componente de financiación
import { FinanciacionComponent } from './financiacion/financiacion.component';

// 🔹 Nuevo componente para cambiar contraseña
import { ChangePasswordComponent } from './cambio_contraseña/cambio-contraseña.component';

export const routes: Routes = [
  { path: '', component: BannerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'saber-mas', component: SaberMasComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'dashboard', component: DashboardComponent },

  // 🔹 Funcionalidades principales
  { path: 'autos/nuevo', component: FormularioAutoComponent },
  { path: 'ventas/registrar', component: RegistroVentaComponent },
  { path: 'autos/lista', component: ListaAutosComponent },

  // 🔹 Nuevos módulos
  { path: 'catalogo-mejorado', component: CatalogoMejoradoComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'gestionar-usuarios', component: GestionUsuariosComponent },

  // 🔹 NUEVO: Simulador de Financiación
  { path: 'financiacion', component: FinanciacionComponent },

  // 🔹 NUEVO: Cambio de contraseña
  { path: 'cambiar-contraseña', component: ChangePasswordComponent },

  { path: '**', redirectTo: '', pathMatch: 'full' }
];
