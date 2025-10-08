import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import fetch from "node-fetch";
import { getConnection } from "./db.js";

const app = express();
const PORT = 4000;

// ====================== MIDDLEWARES ======================
app.use(cors());
app.use(bodyParser.json());

// ====================== REGISTRO Y LOGIN ======================
app.post("/api/register", async (req, res) => {
  try {
    const { nombre, email, password, fechaNacimiento, celular, rol } = req.body;
    if (!nombre || !email || !password)
      return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });

    const conn = await getConnection();
    const [rows] = await conn.execute("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (rows.length > 0) {
      await conn.end();
      return res.status(400).json({ success: false, message: "El email ya está registrado" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await conn.execute(
      "INSERT INTO usuarios (nombre, email, password, fechaNacimiento, celular, rol, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [nombre, email, hashed, fechaNacimiento, celular, rol || "usuario"]
    );
    await conn.end();

    res.json({ success: true, message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("❌ Error en /api/register:", err);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Faltan email o contraseña" });

    const conn = await getConnection();
    const [rows] = await conn.execute("SELECT * FROM usuarios WHERE email = ?", [email]);
    await conn.end();

    if (rows.length === 0)
      return res.status(401).json({ success: false, message: "Usuario no encontrado" });

    const usuario = rows[0];
    const ok = await bcrypt.compare(password, usuario.password);
    if (!ok) return res.status(401).json({ success: false, message: "Contraseña incorrecta" });

    delete usuario.password;
    res.json({ success: true, user: usuario });
  } catch (err) {
    console.error("❌ Error en /api/login:", err);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

// ====================== CAMBIO DE CONTRASEÑA - NUEVO ENDPOINT ======================
app.post("/api/change-password", async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    // Validar campos requeridos
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos"
      });
    }

    // Validar longitud de nueva contraseña
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La nueva contraseña debe tener al menos 6 caracteres"
      });
    }

    const conn = await getConnection();
    
    // Buscar usuario por email
    const [rows] = await conn.execute("SELECT * FROM usuarios WHERE email = ?", [email]);
    
    if (rows.length === 0) {
      await conn.end();
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    const usuario = rows[0];

    // Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, usuario.password);
    if (!isCurrentPasswordValid) {
      await conn.end();
      return res.status(400).json({
        success: false,
        message: "Contraseña actual incorrecta"
      });
    }

    // Hashear nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña en la base de datos
    await conn.execute(
      "UPDATE usuarios SET password = ? WHERE email = ?",
      [hashedNewPassword, email]
    );
    
    await conn.end();

    res.json({
      success: true,
      message: "Contraseña actualizada exitosamente"
    });

  } catch (err) {
    console.error("❌ Error en /api/change-password:", err);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// ====================== GESTIÓN COMPLETA DE USUARIOS ======================
app.get("/api/usuarios", async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(
      "SELECT id, nombre, email, rol, celular, fechaNacimiento, created_at FROM usuarios"
    );
    await conn.end();
    res.json(rows);
  } catch (err) {
    console.error("❌ Error en GET /api/usuarios:", err);
    res.status(500).json({ success: false, message: "Error al cargar usuarios" });
  }
});

app.post("/api/usuarios", async (req, res) => {
  try {
    const { nombre, email, password, fechaNacimiento, celular, rol } = req.body;
    
    if (!nombre || !email || !password) {
      return res.status(400).json({ success: false, message: "Nombre, email y contraseña son obligatorios" });
    }

    const conn = await getConnection();
    
    // Verificar si el email ya existe
    const [existing] = await conn.execute("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (existing.length > 0) {
      await conn.end();
      return res.status(400).json({ success: false, message: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await conn.execute(
      "INSERT INTO usuarios (nombre, email, password, fechaNacimiento, celular, rol, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [nombre, email, hashedPassword, fechaNacimiento, celular, rol || "usuario"]
    );
    
    await conn.end();
    res.json({ success: true, message: "Usuario creado correctamente" });
    
  } catch (err) {
    console.error("❌ Error en POST /api/usuarios:", err);
    res.status(500).json({ success: false, message: "Error al crear usuario" });
  }
});

app.put("/api/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, fechaNacimiento, celular, rol } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({ success: false, message: "Nombre y email son obligatorios" });
    }

    const conn = await getConnection();
    
    // Verificar si el email ya existe en otro usuario
    const [existing] = await conn.execute(
      "SELECT * FROM usuarios WHERE email = ? AND id != ?", 
      [email, id]
    );
    
    if (existing.length > 0) {
      await conn.end();
      return res.status(400).json({ success: false, message: "El email ya está en uso por otro usuario" });
    }

    await conn.execute(
      "UPDATE usuarios SET nombre = ?, email = ?, fechaNacimiento = ?, celular = ?, rol = ? WHERE id = ?",
      [nombre, email, fechaNacimiento, celular, rol, id]
    );
    
    await conn.end();
    res.json({ success: true, message: "Usuario actualizado correctamente" });
    
  } catch (err) {
    console.error("❌ Error en PUT /api/usuarios/:id:", err);
    res.status(500).json({ success: false, message: "Error al actualizar usuario" });
  }
});

app.put("/api/usuarios/:id/rol", async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    const conn = await getConnection();
    await conn.execute("UPDATE usuarios SET rol = ? WHERE id = ?", [rol, id]);
    await conn.end();

    res.json({ success: true, message: "Rol actualizado correctamente" });
  } catch (err) {
    console.error("❌ Error en PUT /api/usuarios/:id/rol:", err);
    res.status(500).json({ success: false, message: "Error al actualizar rol" });
  }
});

app.delete("/api/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar token para evitar auto-eliminación
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = jwt.verify(token, 'tu_clave_secreta');
        if (decoded.id == id) {
          return res.status(400).json({ success: false, message: "No puedes eliminar tu propio usuario" });
        }
      } catch (jwtError) {
        console.log("Token no válido o expirado, continuando con eliminación");
      }
    }

    const conn = await getConnection();
    
    // Verificar si el usuario existe
    const [user] = await conn.execute("SELECT * FROM usuarios WHERE id = ?", [id]);
    if (user.length === 0) {
      await conn.end();
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    await conn.execute("DELETE FROM usuarios WHERE id = ?", [id]);
    await conn.end();

    res.json({ success: true, message: "Usuario eliminado correctamente" });
    
  } catch (err) {
    console.error("❌ Error en DELETE /api/usuarios/:id:", err);
    res.status(500).json({ success: false, message: "Error al eliminar usuario" });
  }
});

// ====================== AUTOS ======================
app.get("/api/autos", async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(
      "SELECT id, nombre AS Nombre, modelo AS Modelo, precio_usd AS Precio, color AS Color FROM vehiculos LIMIT 50"
    );
    await conn.end();
    res.json(rows);
  } catch (err) {
    console.error("❌ Error en GET /api/autos:", err);
    res.status(500).json({ success: false, message: "Error al cargar autos 🚨" });
  }
});

app.post("/api/autos", async (req, res) => {
  try {
    const { nombre, modelo, precio_usd, color } = req.body;

    const conn = await getConnection();
    await conn.execute(
      "INSERT INTO vehiculos (nombre, modelo, precio_usd, color) VALUES (?, ?, ?, ?)",
      [nombre, modelo, precio_usd, color]
    );
    await conn.end();

    res.json({ success: true, message: "Vehículo agregado correctamente" });
  } catch (err) {
    console.error("❌ Error en POST /api/autos:", err);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

app.put("/api/autos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, modelo, precio_usd, color } = req.body;

    const conn = await getConnection();
    await conn.execute(
      "UPDATE vehiculos SET nombre = ?, modelo = ?, precio_usd = ?, color = ? WHERE id = ?",
      [nombre, modelo, precio_usd, color, id]
    );
    await conn.end();

    res.json({ success: true, message: "Vehículo actualizado correctamente" });
  } catch (err) {
    console.error("❌ Error en PUT /api/autos/:id:", err);
    res.status(500).json({ success: false, message: "Error al actualizar vehículo" });
  }
});

app.delete("/api/autos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await getConnection();
    await conn.execute("DELETE FROM vehiculos WHERE id = ?", [id]);
    await conn.end();

    res.json({ success: true, message: "Vehículo eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error en DELETE /api/autos/:id:", err);
    res.status(500).json({ success: false, message: "Error al eliminar vehículo" });
  }
});

// ====================== COMPRAS - CORREGIDO ======================
app.post("/api/compras", async (req, res) => {
  try {
    const { usuario_id, vehiculo_id, estado } = req.body;

    if (!usuario_id || !vehiculo_id) {
      return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
    }

    // Validar y normalizar el estado
    const estadosValidos = ['pendiente', 'completado', 'cancelado', 'procesando'];
    let estadoNormalizado = 'pendiente'; // Valor por defecto
    
    if (estado && estadosValidos.includes(estado.toLowerCase())) {
      estadoNormalizado = estado.toLowerCase();
    } else if (estado) {
      // Si el estado no es válido, usar valor por defecto y mostrar advertencia
      console.warn(`⚠️ Estado no válido recibido: "${estado}". Usando "pendiente" por defecto.`);
    }

    const conn = await getConnection();
    
    // Verificar que el usuario y vehículo existen
    const [usuario] = await conn.execute("SELECT id FROM usuarios WHERE id = ?", [usuario_id]);
    const [vehiculo] = await conn.execute("SELECT id FROM vehiculos WHERE id = ?", [vehiculo_id]);
    
    if (usuario.length === 0) {
      await conn.end();
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }
    
    if (vehiculo.length === 0) {
      await conn.end();
      return res.status(404).json({ success: false, message: "Vehículo no encontrado" });
    }

    await conn.execute(
      "INSERT INTO compras (usuario_id, vehiculo_id, fecha, estado) VALUES (?, ?, NOW(), ?)",
      [usuario_id, vehiculo_id, estadoNormalizado]
    );
    await conn.end();

    res.json({ 
      success: true, 
      message: "Compra registrada correctamente",
      estado: estadoNormalizado
    });
  } catch (err) {
    console.error("❌ Error en POST /api/compras:", err);
    
    // Manejo específico del error de truncamiento de datos
    if (err.code === 'WARN_DATA_TRUNCATED' || err.errno === 1265) {
      return res.status(400).json({ 
        success: false, 
        message: "El estado proporcionado no es válido. Use: pendiente, completado, cancelado o procesando" 
      });
    }
    
    res.status(500).json({ success: false, message: "Error al registrar la compra" });
  }
});

app.get("/api/compras", async (req, res) => {
  try {
    const { usuario_id } = req.query;

    if (!usuario_id) {
      return res.status(400).json({ success: false, message: "Se requiere usuario_id" });
    }

    const conn = await getConnection();
    const [rows] = await conn.execute(`
      SELECT c.id, c.fecha, c.estado, v.nombre, v.modelo, v.precio_usd as precio, v.color
      FROM compras c
      JOIN vehiculos v ON c.vehiculo_id = v.id
      WHERE c.usuario_id = ?
      ORDER BY c.fecha DESC
    `, [usuario_id]);
    await conn.end();

    res.json(rows);
  } catch (err) {
    console.error("❌ Error en GET /api/compras:", err);
    res.status(500).json({ success: false, message: "Error al cargar compras" });
  }
});

// ====================== FAVORITOS ======================
app.post("/api/favoritos", async (req, res) => {
  try {
    const { usuario_id, vehiculo_id } = req.body;

    if (!usuario_id || !vehiculo_id) {
      return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
    }

    const conn = await getConnection();
    
    // Verificar si ya existe en favoritos
    const [existing] = await conn.execute(
      "SELECT * FROM favoritos WHERE usuario_id = ? AND vehiculo_id = ?",
      [usuario_id, vehiculo_id]
    );

    if (existing.length > 0) {
      await conn.end();
      return res.status(400).json({ success: false, message: "El vehículo ya está en favoritos" });
    }

    await conn.execute(
      "INSERT INTO favoritos (usuario_id, vehiculo_id, created_at) VALUES (?, ?, NOW())",
      [usuario_id, vehiculo_id]
    );
    await conn.end();

    res.json({ success: true, message: "Agregado a favoritos correctamente" });
  } catch (err) {
    console.error("❌ Error en POST /api/favoritos:", err);
    res.status(500).json({ success: false, message: "Error al agregar a favoritos" });
  }
});

app.get("/api/favoritos", async (req, res) => {
  try {
    const { usuario_id } = req.query;

    if (!usuario_id) {
      return res.status(400).json({ success: false, message: "Se requiere usuario_id" });
    }

    const conn = await getConnection();
    const [rows] = await conn.execute(`
      SELECT f.id, v.id as vehiculo_id, v.nombre, v.modelo, v.precio_usd as precio, v.color, 
             v.tipo_combustible, v.transmision, f.created_at
      FROM favoritos f
      JOIN vehiculos v ON f.vehiculo_id = v.id
      WHERE f.usuario_id = ?
      ORDER BY f.created_at DESC
    `, [usuario_id]);
    await conn.end();

    res.json(rows);
  } catch (err) {
    console.error("❌ Error en GET /api/favoritos:", err);
    res.status(500).json({ success: false, message: "Error al cargar favoritos" });
  }
});

app.delete("/api/favoritos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await getConnection();
    await conn.execute("DELETE FROM favoritos WHERE id = ?", [id]);
    await conn.end();

    res.json({ success: true, message: "Eliminado de favoritos correctamente" });
  } catch (err) {
    console.error("❌ Error en DELETE /api/favoritos/:id:", err);
    res.status(500).json({ success: false, message: "Error al eliminar de favoritos" });
  }
});

// ====================== VENTAS ======================
app.post("/api/ventas", async (req, res) => {
  try {
    const { usuario_id, auto_id, precio } = req.body;

    if (!usuario_id || !auto_id || !precio) {
      return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
    }

    const conn = await getConnection();
    await conn.execute(
      "INSERT INTO ventas (usuario_id, vehiculo_id, fecha, precio) VALUES (?, ?, NOW(), ?)",
      [usuario_id, auto_id, precio]
    );
    await conn.end();

    res.json({ success: true, message: "Venta registrada correctamente" });
  } catch (err) {
    console.error("❌ Error en POST /api/ventas:", err);
    res.status(500).json({ success: false, message: "Error al registrar la venta 🚨" });
  }
});

app.get("/api/reportes/ventas", async (req, res) => {
  try {
    const conn = await getConnection();
    const [ventas] = await conn.execute(`
      SELECT v.id, u.nombre as usuario, ve.nombre as vehiculo, v.precio, v.fecha 
      FROM ventas v 
      JOIN usuarios u ON v.usuario_id = u.id 
      JOIN vehiculos ve ON v.vehiculo_id = ve.id 
      ORDER BY v.fecha DESC
    `);
    await conn.end();
    res.json(ventas);
  } catch (err) {
    console.error("❌ Error en GET /api/reportes/ventas:", err);
    res.status(500).json({ success: false, message: "Error al cargar reportes" });
  }
});

// ====================== CHATBOT ======================
app.post("/chat", async (req, res) => {
  const { action, carData } = req.body;

  try {
    // Inicio de conversación
    if (!action) {
      return res.json({
        reply: "👋 ¡Hola! Soy tu asistente EasyDrive. ¿Qué deseas hacer?",
        options: [
          { label: "Ver autos disponibles", action: "listar_autos" },
          { label: "Predecir valor de un auto", action: "predecir_valor" }
        ]
      });
    }

    // Listar autos (simulado)
    if (action === "listar_autos") {
      return res.json({
        reply: "🚗 Aquí tienes algunos autos disponibles:",
        options: [
          { label: "AutoLux GT (2017 - Alemania)", action: "auto_AutoLux_GT" },
          { label: "RoadKing X1 (2009 - USA)", action: "auto_RoadKing_X1" },
          { label: "EcoDrive Eco (2020 - Japón)", action: "auto_EcoDrive_Eco" },
          { label: "Speedster GT (2010 - Francia)", action: "auto_Speedster_GT" },
          { label: "TurboMax Sport (2012 - Japón)", action: "auto_TurboMax_Sport" }
        ]
      });
    }

    // Mostrar datos del vehículo seleccionado
    if (action.startsWith("auto_")) {
      const autos = {
        auto_AutoLux_GT: { Velocidades: 7, RPM: 5079, Capacidad: 7, Puertas: 3, Consumo: 8.01, Emisiones: 128, Combustible: "Diesel", Transmision: "CVT", Carroceria: "Convertible", Pais: "Germany" },
        auto_RoadKing_X1: { Velocidades: 7, RPM: 6026, Capacidad: 6, Puertas: 3, Consumo: 5.37, Emisiones: 51, Combustible: "Hybrid", Transmision: "CVT", Carroceria: "Hatchback", Pais: "USA" },
        auto_EcoDrive_Eco: { Velocidades: 8, RPM: 7126, Capacidad: 4, Puertas: 3, Consumo: 5.59, Emisiones: 63, Combustible: "Hybrid", Transmision: "CVT", Carroceria: "Sedan", Pais: "Japan" },
        auto_Speedster_GT: { Velocidades: 8, RPM: 6025, Capacidad: 7, Puertas: 5, Consumo: 13.74, Emisiones: 137, Combustible: "Diesel", Transmision: "CVT", Carroceria: "Truck", Pais: "France" },
        auto_TurboMax_Sport: { Velocidades: 6, RPM: 5767, Capacidad: 4, Puertas: 5, Consumo: 14.11, Emisiones: 52, Combustible: "Electric", Transmision: "CVT", Carroceria: "SUV", Pais: "Japan" }
      };

      const selectedCar = autos[action];
      if (!selectedCar) {
        return res.json({ reply: "⚠️ No encontré ese vehículo." });
      }

      return res.json({
        reply: "ℹ️ Información del vehículo cargada. ¿Quieres predecir su valor?",
        options: [
          { label: "Predecir valor", action: "predecir_valor", carData: selectedCar }
        ]
      });
    }

    // Llamada al modelo de predicción
    if (action === "predecir_valor") {
      let inputCar = carData;

      // Si no viene carData, ponemos un ejemplo
      if (!inputCar) {
        inputCar = {
          Velocidades: 6,
          RPM: 7000,
          Capacidad: 5,
          Puertas: 4,
          Consumo: 7.5,
          Emisiones: 120,
          Combustible: "Gasolina",
          Transmision: "Manual",
          Carroceria: "Sedan",
          Pais: "Japón"
        };
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inputCar)
        });

        const data = await response.json();
        console.log("📡 Respuesta FastAPI:", data);

        if (data && data.precio_estimado) {
          return res.json({
            reply: `💰 El valor estimado del vehículo es: $${data.precio_estimado.toFixed(2)}`
          });
        } else {
          return res.json({ reply: "⚠️ El modelo no devolvió una predicción válida." });
        }
      } catch (error) {
        console.error("❌ Error llamando al modelo:", error);
        return res.json({ reply: "⚠️ Error al conectar con el modelo de predicción." });
      }
    }

    // Acción desconocida
    return res.json({ reply: "❓ No entendí esa opción." });

  } catch (error) {
    console.error("❌ Error en /chat:", error);
    return res.json({ reply: "⚠️ Error interno del servidor." });
  }
});

// ====================== START SERVER ======================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});