'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InventarioSchema =  Schema({
    producto:{type: Schema.ObjectId , ref:'producto' , required: true}, // hara referencia a la coleccion de productos para poder hacer la vinculacion
    cantidad: {type: Number, require:true },
    admin:{type: Schema.ObjectId , ref:'admin' , required: true}, 
    proveedor: {type:String, required:true},
    createAt:{type:Date, default: Date.now, required:true} //Devuelce la fecha en la que fue creado
});

module.exports = mongoose.model('inventario', InventarioSchema);