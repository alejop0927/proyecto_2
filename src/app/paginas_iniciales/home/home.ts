import { Component } from '@angular/core';
import { BannerComponent } from '../banner/banner.component'; // ← Agrega esta importación
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [BannerComponent,RouterModule], // ← Agrega BannerComponent aquí
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
