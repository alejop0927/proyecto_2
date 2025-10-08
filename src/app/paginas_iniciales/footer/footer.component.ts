import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Importar CommonModule
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ Agregar CommonModule aquí
  templateUrl: './footer.component.html',
  styles: []
})
export class FooterComponent {

  }

