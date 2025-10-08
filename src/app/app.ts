import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, ChatbotComponent, NgIf],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('easy-drive');
  showChat = false;  // 👈 ahora es un boolean normal

  // rutas donde debe mostrarse el chat
  allowedRoutes = ['/saber-mas', '/contacto', '/catalogo'];

  constructor(private router: Router) {
    // Escuchar navegación
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showChat = this.allowedRoutes.includes(event.url);
      });
  }
}
