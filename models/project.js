'use strict'
const mongoose=require('mongoose');
const schema=mongoose.Schema;

const users=schema({
    nombre:String,
    usuario:String,
    contraseña:String,
    contactos:[
        {nombre:String,apellidos:String,numero:String,facebook:String,instagram:String,twitter:String,gmail:String,images:String}
    ],
    notas:[
        {titulo:String,texto:String,fecha:String}
    ]
})

//Importacion del modelo tipo mongoose
module.exports=mongoose.model("contactos",users);