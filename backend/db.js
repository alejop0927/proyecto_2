import mysql from 'mysql2/promise';

export const dbConfig = {
  host: 'localhost',
  user: 'root',           // tu usuario de MySQL
  password: 'A0927lejop#',// tu contraseña
  database: 'proyecto_2',   // nombre de tu base de datos
};

export async function getConnection() {
  return await mysql.createConnection(dbConfig);
}
