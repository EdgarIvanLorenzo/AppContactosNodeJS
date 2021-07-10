const mongoose=require('mongoose');
const app=require('./app');
const port=3709;
mongoose.Promise=global.Promise;
mongoose.connect("mongodb://localhost:27017/AppContactos")
    .then(()=>{
        console.log("Conectado a la base de datos");
        //Ejecutando el archivo app de tipo javascript el cual contiene las rutas y logica del programa 
        app.listen(port,'0.0.0.0',()=>{
            console.log("conectado con Express");
        })
    })
    .catch((error)=>{
        console.log(error);
    })