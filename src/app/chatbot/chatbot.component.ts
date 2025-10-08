import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [NgFor, NgClass, NgIf],
  templateUrl: './chatbot.component.html'
})
export class ChatbotComponent {
  messages: { text: string, sender: 'Usuario' | 'Bot', options?: {label: string, action: string, carData?: any}[] }[] = [];
  isOpen: boolean = false;

  // 🔹 Base de autos (simulación de dataset)
  autos = [
    {
      Nombre: "AutoLux", Modelo: "GT", Año: 2017, Pais: "Germany",
      Velocidades: 7, RPM: 5079, Combustible: "Diesel", Transmision: "CVT",
      Carroceria: "Convertible", Puertas: 3, Capacidad: 7, Consumo: 8.01, Emisiones: 128
    },
    {
      Nombre: "RoadKing", Modelo: "X1", Año: 2009, Pais: "USA",
      Velocidades: 7, RPM: 6026, Combustible: "Hybrid", Transmision: "CVT",
      Carroceria: "Hatchback", Puertas: 3, Capacidad: 6, Consumo: 5.37, Emisiones: 51
    },
    {
      Nombre: "EcoDrive", Modelo: "Eco", Año: 2020, Pais: "Japan",
      Velocidades: 8, RPM: 7126, Combustible: "Hybrid", Transmision: "CVT",
      Carroceria: "Sedan", Puertas: 3, Capacidad: 4, Consumo: 5.59, Emisiones: 63
    },
    {
      Nombre: "AutoLux", Modelo: "X1", Año: 2001, Pais: "Germany",
      Velocidades: 6, RPM: 6664, Combustible: "Gasoline", Transmision: "CVT",
      Carroceria: "Sedan", Puertas: 5, Capacidad: 3, Consumo: 14.13, Emisiones: 246
    },
    {
      Nombre: "TurboMax", Modelo: "Sport", Año: 2012, Pais: "Japan",
      Velocidades: 6, RPM: 5767, Combustible: "Electric", Transmision: "CVT",
      Carroceria: "SUV", Puertas: 5, Capacidad: 4, Consumo: 14.11, Emisiones: 52
    }
  ];

  constructor(private http: HttpClient) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.startChat();
    }
  }

  startChat() {
    this.messages.push({
      sender: 'Bot',
      text: '🚗 Bienvenido a EasyDrive. Selecciona un auto:',
      options: this.autos.map((auto, i) => ({
        label: `${auto.Nombre} ${auto.Modelo} (${auto.Pais})`,
        action: `auto_${i}`,
        carData: auto
      }))
    });
  }

  handleOption(opt: { label: string, action: string, carData?: any }) {
    this.messages.push({ sender: 'Usuario', text: opt.label });

    if (opt.action.startsWith("auto_")) {
      const car = opt.carData;

      this.messages.push({
        sender: 'Bot',
        text: `📋 ${car.Nombre} ${car.Modelo} (${car.Año}, ${car.Pais})\n⚙️ ${car.Velocidades} Vel., ${car.RPM} RPM, ${car.Combustible}, ${car.Transmision}, ${car.Carroceria}`,
        options: [
          { label: "🔮 Predecir valor", action: "predecir_valor", carData: car },
          { label: "⬅ Volver", action: "volver" }
        ]
      });
    }

    if (opt.action === "predecir_valor" && opt.carData) {
      this.http.post<any>("http://localhost:4000/chat", { action: "predecir_valor", carData: opt.carData })
        .subscribe(res => {
          this.messages.push({
            sender: 'Bot',
            text: res.reply
          });
        });
    }

    if (opt.action === "volver") {
      this.startChat();
    }
  }
}
