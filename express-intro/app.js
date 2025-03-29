// Importaciones
require("dotenv").config(); // Cargar las variables de entorno desde .env
const express = require("express");
const path = require("path");

// Inicialización
const app = express();

// Configuraciones básicas
app.set("port", process.env.PORT || 3000); // Puerto de la aplicación
app.set("json spaces", 2); // Espacios para la respuesta JSON

// Middlewares básicos
app.use(express.json()); // Middleware para parsear JSON
app.use(express.urlencoded({ extended: false })); // Middleware para parsear URL-encoded

// Rutas
// GET
app.get("/api/usuarios", (req, res) => {
  res.json([
    { id: 1, nombre: "Ana" },
    { id: 2, nombre: "Carlos" },
  ]);
});

// POST
app.post("/api/usuarios", (req, res) => {
  const nuevoUsuario = req.body;
  // Lógica para guardar usuario
  res.status(201).json({ mensaje: "Usuario creado", usuario: nuevoUsuario });
});

// PUT
app.put("/api/usuarios/:id", (req, res) => {
  const id = req.params.id;
  // Lógica para actualizar usuario
  res.json({ mensaje: `Usuario ${id} actualizado` });
});

// DELETE
app.delete("/api/usuarios/:id", (req, res) => {
  const id = req.params.id;
  // Lógica para eliminar usuario
  res.json({ mensaje: `Usuario ${id} eliminado` });
});

// Iniciar el servidor
app.listen(app.get("port"), () => {
  console.log(`Servidor escuchando en http://localhost:${app.get("port")}`);
});