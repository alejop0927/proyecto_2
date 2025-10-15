import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface DatosIoT {
  id?: number;
  temperatura: number;
  humedad: number;
  calidad_aire: number;
  device_id: string;
  fecha?: string;
  timestamp?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class IotService {
  private apiUrl = 'http://localhost:4000/api/iot';
  private socket: Socket;
  private datosSubject = new BehaviorSubject<DatosIoT | null>(null);
  
  public datos$ = this.datosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:4000');
    
    this.socket.on('datos_iot', (data: DatosIoT) => {
      this.datosSubject.next(data);
    });
  }

  getEstadoActual(): Observable<DatosIoT> {
    return this.http.get<DatosIoT>(`${this.apiUrl}/estado`);
  }

  getHistorico(limite: number = 50): Observable<DatosIoT[]> {
    return this.http.get<DatosIoT[]>(`${this.apiUrl}/historico?limite=${limite}`);
  }
}