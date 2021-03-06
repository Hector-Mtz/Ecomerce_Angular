'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema =  Schema({
    titulo:{type:String, required: true},
    slug:{type:String, required: true},
    galeria: [{type:Object,required: false}],
    portada: {type:String, required: true},
    precio: {type:Number, required: true},
    descripcion:{type:String, required: true},
    contenido: {type:String, required: true},
    stock: {type:Number, required: true},
    nventas:{type:Number,default:0, required: true},
    npuntos:{type:Number,default:0, required: true},
    categoria:{type:String, required: true},
    variedades:[{type:Object,required: false}],
    titulo_variedad:{type:String, required: true},
    estado: {type:String, default: 'Edicion' ,required: true},
    createAt:{type:Date, default: Date.now, required:true} //Devuelce la fecha en la que fue creado
});

module.exports = mongoose.model('producto', ProductoSchema);