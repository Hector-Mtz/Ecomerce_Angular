//rutas que manejaran el controlador de cupon

'use strict'
//rutas de acceso
var express = require('express');
var cuponController =  require('../controllers/CuponController');

var api =  express.Router();
var auth = require ('../middlewares/authenticate'); // llama la funcion authenticate para proteger la ruta  

api.post('/registro_cupon_admin',auth.auth,cuponController.registro_cupon_admin);
api.get('/listar_cupones_admin/:filtro?', auth.auth, cuponController.listar_cupones_admin);
api.get('/obtener_cupon_admin/:id',auth.auth, cuponController.obtener_cupon_admin);
api.put('/actualizar_cupon_admin/:id',auth.auth, cuponController.actualizar_cupon_admin);
api.delete('/eliminar_cupon_admin/:id',auth.auth, cuponController.eliminar_cupon_admin);

module.exports = api;    