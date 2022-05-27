'use strict'
//rutas de acceso
var express = require('express');
var clienteController =  require('../controllers/ClienteController');

var api =  express.Router();
var auth = require ('../middlewares/authenticate'); // llama la funcion authenticate para proteger la ruta  


api.post('/registro_cliente', clienteController.registro_cliente);

api.post('/login_cliente', clienteController.login_cliente); // va a gestionar el login_cliente que se encuentra en controlladores

api.get('/listar_clientes_filtro_admin/:tipo/:filtro?',auth.auth,clienteController.listar_clientes_filtro_admin); //se usa get porques es obtencion de registros

api.post('/registro_cliente_admin',auth.auth,clienteController.registro_cliente_admin); 

api.get('/obtener_cliente_admin/:id',auth.auth,clienteController.obtener_cliente_admin); 

api.put('/actualizar_cliente_admin/:id', auth.auth, clienteController.actualizar_cliente_admin); //como es metodo de actualziacion se utiliza put

api.delete('/eliminar_cliente_admin/:id',auth.auth, clienteController.eliminar_cliente_admin);
module.exports = api;    