// form-auto.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-auto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">
        {{ esEdicion ? 'Editar' : 'Agregar' }} Vehículo
      </h2>

      <form (ngSubmit)="guardarAuto()" class="bg-white p-6 rounded-lg shadow space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" [(ngModel)]="auto.nombre" name="nombre" 
                   class="mt-1 block w-full border rounded px-3 py-2" required>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Modelo</label>
            <input type="text" [(ngModel)]="auto.modelo" name="modelo" 
                   class="mt-1 block w-full border rounded px-3 py-2" required>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Precio (USD)</label>
            <input type="number" [(ngModel)]="auto.precio_usd" name="precio" 
                   class="mt-1 block w-full border rounded px-3 py-2" required>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Color</label>
            <input type="text" [(ngModel)]="auto.color" name="color" 
                   class="mt-1 block w-full border rounded px-3 py-2" required>
          </div>
        </div>

        <div class="flex space-x-4 pt-4">
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {{ esEdicion ? 'Actualizar' : 'Guardar' }}
          </button>
          <button type="button" (click)="cancelar()" 
                  class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `
})
export class FormAutoComponent implements OnInit {
  auto: any = {
    nombre: '',
    modelo: '',
    precio_usd: 0,
    color: ''
  };
  esEdicion = false;
  autoId: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.autoId = this.route.snapshot.params['id'];
    if (this.autoId) {
      this.esEdicion = true;
      this.cargarAuto();
    }
  }

  cargarAuto() {
    this.http.get(`http://localhost:4000/api/autos/${this.autoId}`)
      .subscribe({
        next: (data: any) => this.auto = data,
        error: (error) => console.error('Error:', error)
      });
  }

  guardarAuto() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    if (this.esEdicion) {
      this.http.put(`http://localhost:4000/api/autos/${this.autoId}`, this.auto, { headers })
        .subscribe({
          next: () => {
            alert('Vehículo actualizado');
            this.router.navigate(['/autos/lista']);
          },
          error: (error) => console.error('Error:', error)
        });
    } else {
      this.http.post('http://localhost:4000/api/autos', this.auto)
        .subscribe({
          next: () => {
            alert('Vehículo agregado');
            this.router.navigate(['/autos/lista']);
          },
          error: (error) => console.error('Error:', error)
        });
    }
  }

  cancelar() {
    this.router.navigate(['/autos/lista']);
  }
}