import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DashboardMenuComponent } from '../dashboard/menu/menu.component';

@Component({
  selector: 'app-lista-autos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, DashboardMenuComponent],
  templateUrl: './lista-autos.component.html',
})
export class ListaAutosComponent implements OnInit {
  autos: any[] = [];
  mensajeError = '';

  paginaActual = 1;
  autosPorPagina = 10;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarAutos();
  }

  cargarAutos() {
    this.http.get<any[]>('http://localhost:4000/api/autos').subscribe({
      next: (data) => this.autos = data,
      error: (err) => {
        console.error('Error al cargar autos:', err);
        this.mensajeError = 'Error al cargar autos 🚨';
      },
    });
  }

  get autosPaginados() {
    const start = (this.paginaActual - 1) * this.autosPorPagina;
    const end = start + this.autosPorPagina;
    return this.autos.slice(start, end);
  }

  totalPaginas() {
    return Math.ceil(this.autos.length / this.autosPorPagina);
  }

  siguientePagina() {
    if (this.paginaActual < this.totalPaginas()) {
      this.paginaActual++;
    }
  }

  anteriorPagina() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }
}
