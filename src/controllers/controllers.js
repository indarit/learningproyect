const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

// Sentences SQL
const _getAll = "SELECT * FROM alumno";
const get_sem =
  "select nombre_modulo, nombre_curso, numero_semana " +
  "from modulo " +
  "join curso c on modulo.curso_id = c.id " +
  "join semana s on modulo.id = s.modulo_id; ";
const inserAlumno =
  "INSERT INTO alumno (nombre_alumno, apellido_alumno, nro_identif, dir_email, dir_github, telefono, nacionalidad, fecha_nac, grupo_id, estado, password ) VALUES ($1 ,$2 ,$3 , $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *";
const getAll = async (req, res) => {
  try {
    await pool.query(get_sem, (error, result) => {
      res.json(result.rows);
    });
  } catch (error) {
    res.json({ error: error.message });
  }
};
const createAlumno = async (req, res) => {
  const {
    nombre,
    apellido,
    identificacion,
    email,
    github,
    telefono,
    nacionalidad,
    fechanac,
    grupo,
    estado,
    password,
  } = req.body;
  console.log(req.body);
  try {
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    let newUser = await pool.query(inserAlumno, [
      nombre,
      apellido,
      identificacion,
      email,
      github,
      telefono,
      nacionalidad,
      fechanac,
      grupo,
      estado,
      bcryptPassword,
    ]);

    const jwtToken = jwtGenerator(newUser.rows[0].id);
    return res.json({ jwtToken });
  } catch (error) {
    console.error(error.message);
    res.status(400).json(`this  already exist!`);
  }
};

module.exports = {
  getAll,
  createAlumno,
};
