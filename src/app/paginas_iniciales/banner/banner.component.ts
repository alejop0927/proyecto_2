import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './banner.component.html',
  styleUrls: [] // ← Para Tailwind, dejar vacío o usar 'styles: []'
})
export class BannerComponent {
  bannerImage: string = 'assets/banner_principal.jpg';
  
  // Método opcional para manejar la navegación
  onExploreClick(): void {
    console.log('Explorar vehículos clickeado');
  }
}