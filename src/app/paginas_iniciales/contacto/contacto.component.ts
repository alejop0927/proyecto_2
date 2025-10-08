import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Importar CommonModule
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../menu/menu.component'; 
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, RouterModule,MenuComponent,FooterComponent], // ✅ Agregar CommonModule aquí
  templateUrl: './contacto.component.html',
  styles: []
})
export class ContactoComponent {

  }

