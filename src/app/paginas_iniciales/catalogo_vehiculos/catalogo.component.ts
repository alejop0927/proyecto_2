import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component'; 
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ Importar RouterModule

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,       // ✅ Agregar aquí para que routerLink funcione
    MenuComponent,
    FooterComponent,
  ],
  templateUrl: './catalogo.component.html',
  styles: []
})
export class CatalogoComponent { }
