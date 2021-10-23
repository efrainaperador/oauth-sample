const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    nombres: String,
    apellidos: String,
    rol: String,
    activado: Boolean
});

module.exports = userSchema;