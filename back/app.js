'use strict'
//DECLARACION DE RUTAS PARA QUE SE PUEDAN UTilizar
var express = require('express');
var app = express();    
var bodyparser = require('body-parser');
var mongoose  =  require('mongoose');
var port = process.env.PORT || 4201;

//MANDA A LLAMAR LAS RUTAS
var cliente_route = require('./routes/cliente');
var admin_route = require('./routes/admin');
var producto_route = require('./routes/producto');
var cupon_route = require ('./routes/cupon');
var config_route = require('./routes/config');


 mongoose.connect('mongodb://127.0.0.1:27017/tienda',{useUnifiedTopology:true, useNewUrlParser:true}, (err, res)=>{
     if(err)
     {
       console.log(err);
     }
     else
     {
       app.listen(port,function () {
         console.log('Servidor Corriendo en el puerto '+ port);
       });
     }
 }); //conexion a bd

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json({limit:'50mb', extended:true}));

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
}); //permite el comunicado entre el back y el front


//LAS RUTAS LAS MANDA A LLAMAR PARA DESPUES ENVIARLAS A LA API DE ANGULAR
app.use('/api',cliente_route);
app.use('/api',admin_route);
app.use('/api',producto_route);
app.use('/api',cupon_route);
app.use('/api',config_route);

 module.exports = app;