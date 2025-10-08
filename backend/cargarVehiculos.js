import mysql from 'mysql2/promise';
import fs from 'fs';
import csv from 'csv-parser';

async function cargarVehiculos() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'A0927lejop#',
    database: 'proyecto_2'
  });

  const rows = [];
  fs.createReadStream('./backend/car_data_clean.csv')
    .pipe(csv())
    .on('data', (row) => {
      rows.push([
        row['Nombre del Vehículo'],
        row['Modelo'],
        row['Fecha de Fabricación'],
        row['País de Fabricación'],
        parseFloat(row['Precio (USD)']),
        row['Especificaciones del Motor'],
        parseInt(row['Velocidades']),
        parseInt(row['RPM']),
        row['Tipo de Combustible'],
        row['Transmisión'],
        row['Color'],
        row['Tipo de Carrocería'],
        parseInt(row['Número de Puertas']),
        parseInt(row['Capacidad de Pasajeros']),
        parseFloat(row['Consumo (L/100km)']),
        parseInt(row['Emisiones CO2 (g/km)']),
        row['Imagen']
      ]);
    })
    .on('end', async () => {
      console.log(`Insertando ${rows.length} vehículos...`);
      const batchSize = 100; // insertar de 100 en 100 para no saturar memoria
      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize);
        const placeholders = batch.map(() => `(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).join(',');
        const flatValues = batch.flat();
        await connection.execute(
          `INSERT INTO vehiculos (
            nombre, modelo, fecha_fabricacion, pais_fabricacion, precio_usd,
            motor, velocidades, rpm, tipo_combustible, transmision, color,
            tipo_carroceria, num_puertas, capacidad_pasajeros, consumo, emisiones_co2, imagen
          ) VALUES ${placeholders}`,
          flatValues
        );
      }
      console.log("✅ Todos los vehículos fueron cargados en la base de datos");
      await connection.end();
    });
}

cargarVehiculos();
