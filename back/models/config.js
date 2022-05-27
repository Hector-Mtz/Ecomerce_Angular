'use strict'

//MODELO DE CONFIGURACIONES BASICAS DE LA PLATAFORMA
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfigSchema =  Schema({
    categorias:[{type:Object, required: true}], //sera un array
    titulo:{type:String, required: true},
    logo: {type:String, required:true},
    serie: {type:String, required:true}, 
    correlativo: {type:String, required:true},
});

module.exports = mongoose.model('config', ConfigSchema);