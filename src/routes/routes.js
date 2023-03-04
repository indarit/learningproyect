const { Router } = require("express");
const {
  getAll,
  getModulos,
  getGrupos,
  getSemanas,
  createAlumno,
} = require("../controllers/controllers");

const router = Router();

router.get("/alumnos", getAll);
router.get("/modulos", getModulos);
router.get("/grupos", getGrupos);
router.get("/semanas", getSemanas);
router.post("/registro", createAlumno);
module.exports = router;
