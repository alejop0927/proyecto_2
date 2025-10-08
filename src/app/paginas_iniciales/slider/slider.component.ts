import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Importar CommonModule
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ Agregar CommonModule aquí
  templateUrl: './slider.component.html',
  styles: []
})
export class SliderComponent {

}
