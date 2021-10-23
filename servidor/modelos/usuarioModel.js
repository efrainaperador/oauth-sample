const mongoose = require('mongoose');
const userSchema = require('./schemes/usuario');
const model = mongoose.model;

const userModel = model('usuario', userSchema);
const userTools = ()=>{
    this.crearUsuario = (user, callback)=>{
        this.cargarUsuario({email: user.email}, (error, usuarioBD)=>{
            if(error) {
                callback(error, {});
            } else {
                if(!usuarioBD) {
                    user.rol = "Pendiente";
                    userModel.create(user, callback);
                } else {
                    user.rol = usuarioBD.rol;
                    this.actualizarUsuario(user, callback);
                }
            }
        });
    };

    this.actualizarUsuario = (user, callback)=> {
        userModel.findOneAndUpdate({email:user.email}, user, callback);
    };

    this.cargarUsuario = (user, callback)=>{
        userModel.findOne(user, callback);
    };

    this.cargarTodos = (callback)=>{
        userModel.find({}, callback);
    };

    return {
        crearUsuario: this.crearUsuario,
        actualizarUsuario: this.actualizarUsuario,
        cargarUsuario: this.cargarUsuario,
        cargarTodos: this.cargarTodos,
    }
};

module.exports = userTools();