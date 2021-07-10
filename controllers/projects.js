"use strict";
const modelo = require("../models/project");
//Importacion de la dependencia para la encripatcion de los datos
const bcrytp = require("bcryptjs");
//Importacion para poder acceder a las rutas
const fs=require('fs');
//Importacion del path para poder mostrar la imagen 
const path = require('path');


//Controladores
const controlador = {

  //Conttrolador para subir un nuevo usuario en con un nuevo usuario
  postUsers: function (datos, respuesta) {
    let datosR = datos.body;
    let datos1 = modelo();
    datos1.nombre = datosR.nombre;
    datos1.usuario = datosR.usuario;
    let contrasena = bcrytp.hashSync(datosR.contrasena, 10);
    datos1.contraseña = contrasena;
    datos1.contactos = datosR.contactos;
    datos1.notas=datosR.notas;
    datos1.save((error, resolve) => {
      if (resolve) {
        respuesta.status(200).send(datos1);
      }
      if(error){
        respuesta.send(error);
      }
    });
  },

  //Controlador para poder buscar un usuario
  buscarUsuario: function (datos, respuesta) {
    let usuarioN=datos.params.usuario;
    let contrasena=datos.params.contra;
    modelo.find({usuario:usuarioN}).exec((error,resolve)=>{
      if(resolve){
          let antigua=resolve[0].contraseña;
          let compara=bcrytp.compareSync(contrasena,antigua);
          if(compara){
            respuesta.send(resolve);
          }else{
            respuesta.send('Error no coincide');
          }
      if(error){
        respuesta.send(error);
      }
      if(!resolve){
        respuesta.status(404).send("Error");
      }
    }
  })
  },
  buscarId:function(datos,respuesta){
    let id=datos.params.id;
    modelo.findById(id,(error,resolve)=>{
      if(error){
        respuesta.send(error);
      }
      if(resolve){
        respuesta.send(resolve);
      }
    })
  },
  //Eliminar un usuario
  eliminarUsers: function (datos, respuesta) {
    let id = datos.params.id;
    modelo.findByIdAndRemove(id, (error, resolve) => {
      if (resolve) {
        respuesta.send({ message: resolve });
      }
      if (error) {
        respuesta.send({ message: error });
      }
    });
  },


  //Controlador que me permite crear un nuevo contacto dentrod e la sesion del usuario
  agregarContacto: function (datos, respuesta) {
    let id = datos.params.id;
    let nuevosDatos = datos.body.contactos;
    modelo.findById(id, (error, resolve)=>{
      if(resolve){
        let arregloContactos=resolve.contactos;
        arregloContactos.push(nuevosDatos);
        modelo.findByIdAndUpdate(id,{contactos:arregloContactos},{new:true},(error,resolve)=>{
          if(resolve){
            respuesta.send(arregloContactos);
          }
        })
      } 
    })
  },
  agregarNota:function(datos,respuesta){
    let id=datos.params.id; //Extraigo el id
    let newNote=datos.body.note;
    modelo.findById(id,function(error,resolve){
      if(resolve){
        let notas1=resolve.notas;
        notas1.push(newNote);
        modelo.findByIdAndUpdate(id,{notas:notas1},{new:true},function(error,resolve){
          if(resolve){
            respuesta.send("Nota agregada");
          }
          if(error){
            respuesta.send("Error al guardar la nota");
          }
        })
      }
    });

  },
  obtenerNotes:function (datos, respuesta) {
    let id=datos.params.id;
    modelo.findById(id,function(error,resolve){
      if(resolve){
        respuesta.send(resolve.notas);
      }
      if(error){
        respuesta.send("Error");
      }
    })
  },
  eliminarNote(datos,respuesta){
    let id=datos.params.id;
    let notaEliminar=datos.body.id;
    console.log(notaEliminar);
    modelo.findById(id,(error,resolve)=>{
      if(resolve){
        let notas=resolve.notas;
        let posicion=notas.findIndex((elemento)=>{
          return elemento==notaEliminar;
        });
        notas.splice(posicion,1);
        modelo.findByIdAndUpdate(id,{notas:notas},{new:true},(error,resolve)=>{
          if(resolve){
            respuesta.send(resolve);
          }
          if(error){
            respuesta.send(error);
          }
        })
      }
      if(error){
        respuesta.send(error);
      }
    })
  },
  //!controlador para elminar un contacto de la lista 
  eliminarContacto:function(datos,respuesta){
    let id=datos.params.id1;
    let id2=datos.params.id2;
    modelo.findById(id,(error,resolve)=>{
      if(resolve){
        let contactosLista=resolve.contactos;
        let index=contactosLista.findIndex((elemento)=>{
          return elemento._id==id2;
        })
        contactosLista.splice(index,1); //Metodo splice que me permite indicar en que indice del arreglo eliminar y cuantas posiciones eliminar
        modelo.findByIdAndUpdate(id,{contactos:contactosLista},{new:true},(error,res)=>{
          if(res){
            respuesta.send(resolve);
          }
        })
      }
    })
  },
  actualizarContacto:function(datos,respuesta){
    let id=datos.params.id;
    let id2=datos.params.id2;
    let nuevosdatos=datos.body;
    modelo.findById(id,(error,resolve)=>{
      if(resolve){
        let contactos=resolve.contactos;
        let index=contactos.findIndex((elemento)=>{
          return elemento._id==id2;
        });
       contactos[index]._id=nuevosdatos._id;
       contactos[index].nombre=nuevosdatos.nombre;
       contactos[index].apellidos=nuevosdatos.apellidos;
       contactos[index].facebook=nuevosdatos.facebook;
       contactos[index].instagram=nuevosdatos.instagram;
       contactos[index].twitter=nuevosdatos.twitter;
       contactos[index].gmail=nuevosdatos.gmail;
       modelo.findOneAndUpdate(id,{contactos:contactos},{new:true},(error,resolve)=>{
         if(resolve){
           respuesta.send(resolve);
         }
       })
      }
    })
  },
  //*Ruta para subir una imagen en contactos
  subirImagen: function (datos, respuesta) {
    let id = datos.params.id;
    let id2 = datos.params.id2;
    if (datos.files) {
      //Acceso al la ruta de la imagen
      const file = datos.files.images.path;
      //Dividmos y tomamos el nombre de la imagen
      const url = file.split("/")[1];
      //Actualizacion de los datos del modelo
      modelo.findById(id, (error, resolve) => {
        if (resolve) {
          let contactos = resolve.contactos;
          let index = contactos.findIndex((elemento) => {
            return elemento._id == id2;
          });
          if (index != -1) {
            resolve.contactos[index].images=url;
            modelo.findByIdAndUpdate(id,resolve,{new:true},(error,resolve2)=>{
              if(resolve2){
                respuesta.send(resolve2);
              }
            })
          }
        } else {
          respuesta.send("Error Dato no existente");
        }
      });
    }
  },

  //Ruta para mostrar la imagen 
  fotoGet:function(datos,respuesta){
    let imagen=datos.params.nombreImagen;
    let ruta='./img/'+imagen;

    //REalizamos una comprobacion de los dato para saber si la ruta existe
    fs.exists(ruta,function(exists){
      if(exists){
        respuesta.sendFile(path.resolve(ruta));
      }else{
        respuesta.send({message:"Error la imagen no existe"});
      }
    })
  }
};

module.exports = controlador;
