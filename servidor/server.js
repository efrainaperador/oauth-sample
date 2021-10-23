const express = require('express');
var cors = require('cors')
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '789011637624-7i7mvke7ke6rer0pc7e7f8dgha94igno.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
const mongoose = require('mongoose');
const mongodbUri = 'mongodb://127.0.0.1/ventas';
const userModel = require('./modelos/usuarioModel');

mongoose.connect(mongodbUri);
const db = mongoose.connection;
db.on('error', (error) => {
    console.error('Error conectandose a la base de datos', error);
})

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

async function verify(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        return userid;
    } catch (error) {
        console.error(error);
        return null;
    }
}

app.post('/login', async (req, res) => {
    let userid = await verify(req.body.token);
    if (userid) {
        userModel.crearUsuario({
            email: req.body.email,
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            activado: false
        }, (error, usuario) => {
            if (error) {
                res.status = 500;
                res.send({
                    error: true,
                    message: error
                });
                return;
            }

            res.send({
                success: true,
                message: 'El usuario es valido',
                usuario: usuario
            });
        });
    } else {
        res.status = 400;
        res.send({
            error: true,
            message: 'No se pudo validar el usuario'
        });
    }
});

app.post('/actualizarUsuario', async (req, res) => {
    let userid = await verify(req.headers.token);
    if (userid) {
        userModel.actualizarUsuario({
            email: req.body.email,
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            rol: req.body.rol
        }, (error, usuario) => {
            if (error) {
                res.status = 500;
                res.send({
                    error: true,
                    message: error
                });
                return;
            }

            res.send({
                success: true,
                message: 'El usuario fue actualizado',
                usuario: usuario
            });
        });
    } else {
        res.status = 400;
        res.send({
            error: true,
            message: 'No se pudo validar el usuario'
        });
    }
})

app.get('/usuarios', async (req, res) => {
    if (req.headers.token) {
        let userid = await verify(req.headers.token);
        if (userid) {
            userModel.cargarTodos((error, usuarios) => {
                if (error) {
                    res.status = 500;
                    res.send({
                        error: true,
                        message: 'Ocurrio un error en el servidor',
                        errorMessage: error
                    });
                    return;
                }

                res.send({
                    success: true,
                    usuarios: usuarios
                });

                return;
            });
        } else {

            res.status = 400;

            res.send({
                error: true,
                message: 'El TOKEN es invalido'
            });
        }
    } else {

        res.status = 400;

        res.send({
            error: true,
            message: 'El usuario no esta autorizado NO TOKEN'
        });
    }


})

app.listen(port, () => {
    console.log(`App listening in port ${port}`);
});