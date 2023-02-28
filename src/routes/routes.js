const { Router } = require("express");
const { getAll, createAlumno } = require("../controllers/controllers");

const router = Router();

router.get("/alumnos", getAll);
router.post("/registro", createAlumno);
module.exports = router;
