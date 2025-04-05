const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { id: 1, nombre: "Ana" },
    { id: 2, nombre: "Carlos" },
  ]);
});


router.post("/", (req, res) => {
  // Lógica para crear usuario
  res.status(201).json({ mensaje: "Usuario creado" });
});
