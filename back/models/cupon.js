'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CuponSchema =  Schema({
    codigo: {type:String, required:true},
    tipo:{type:String, required:true}, //sera un valor en porcentaje o precio fijo
    valor:{type:Number, required:true},
    limite:{type:Number, required:true}, //la cantidad de cupones que habra total 
    createAt:{type:Date, default: Date.now, required:true} //Devuelce la fecha en la que fue creado
});

module.exports = mongoose.model('cupon', CuponSchema);