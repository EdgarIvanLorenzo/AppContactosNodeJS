const express=require('express');
const app=express()
const body_parser=require('body-parser');
const rutas=require('./router/project');



app.use(body_parser.urlencoded({extended:true}));
app.use(body_parser.json());

//!Corns
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/',rutas);

module.exports=app;