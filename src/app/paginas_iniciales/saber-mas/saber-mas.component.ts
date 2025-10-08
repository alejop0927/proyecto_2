import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component'; 
import { SliderComponent } from '../slider/slider.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-saber-mas',
  templateUrl: './saber-mas.component.html',
  styles: [],
  standalone: true,
  imports: [CommonModule, MenuComponent, SliderComponent, FooterComponent] 
})
export class SaberMasComponent {
  
  scrollToSlider() {
    const slider = document.getElementById('slider1');
    if (slider) {
      slider.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToAbout() {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}