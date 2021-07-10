'use strict'
const controladores=require('../controllers/projects')
const express = require('express');
const rutas=express.Router();

//!Configuracion del midlegarre de connectMultiparty me permite conectar
//! con una ruta y definirle la ruta donde vamos a guardar la imagen
const multi=require('connect-multiparty');
//Aguardamos la imagen en una carpeta dentro del backend en la carpeta img 
const subirImagen=multi({uploadDir:'./img'});


rutas.post('/usersC',controladores.postUsers);
rutas.get('/getUsers/:usuario/:contra',controladores.buscarUsuario);
rutas.get('/Id/:id',controladores.buscarId);
rutas.delete('/eliminarUsers/:id',controladores.eliminarUsers);
rutas.put('/createContacts/:id',controladores.agregarContacto);
rutas.put('/createNote/:id',controladores.agregarNota);
rutas.get('/ObtenerNotes/:id',controladores.obtenerNotes);
rutas.put('/eliminarNote/:id',controladores.eliminarNote);
rutas.put('/eliminarContacts/:id1/:id2',controladores.eliminarContacto);
rutas.put('/actualizarContacts/:id/:id2',controladores.actualizarContacto);
//?Ruta para subir una imagen
rutas.post('/contactsPerfil/:id/:id2',subirImagen,controladores.subirImagen);
//Ruta para mostrar una imagen
rutas.get('/imagen/:nombreImagen',controladores.fotoGet);

module.exports =rutas;