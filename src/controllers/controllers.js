const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

// SQL
const get_Alunos = "SELECT * FROM alumno";
const get_Modulos = "select * from modulo";
const get_Grupos = "select * from grupo";
const get_semanas = "select  nombre_modulo, total_semanas from modulo m";
const inserAlumno =
  "INSERT INTO alumno (nombre_alumno, apellido_alumno, nro_identif, dir_email, dir_github, telefono, nacionalidad, fecha_nac, grupo_id, estado, password ) VALUES ($1 ,$2 ,$3 , $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *";

const getAll = async (req, res) => {
  try {
    await pool.query(get_Alunos, (error, result) => {
      res.json(result.rows);
    });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const getModulos = async (req, res) => {
  try {
    await pool.query(get_Modulos, (error, result) => {
      res.json(result.rows);
    });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const getGrupos = async (req, res) => {
  try {
    await pool.query(get_Grupos, (error, result) => {
      res.json(result.rows);
    });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const getSemanas = async (req, res) => {
  try {
    await pool.query(get_semanas, (error, result) => {
      res.json(result.rows);
    });
  } catch (error) {
    res.json({ error: error.message });
  }
};




async function createAlumno(req, res) {
  const {
    nombre, apellido, identificacion, email, github, telefono, nacionalidad, fechanac, grupo, estado, password,
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
}

module.exports = {
  getAll,
  createAlumno,
  getModulos,
  getGrupos,
  getSemanas,
};
