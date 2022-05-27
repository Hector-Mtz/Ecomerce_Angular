'use strict'

var jwt = require('jwt-simple'); //paquete para decodificar tokens

var moment = require('moment'); 

var secret = 'ecomerce'; // contraseña para encriptar tokens

exports.createToken = function (user){
    var payload= {
        sub:user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        role:user.rol,
        iat: moment().unix(), //fecha de inicializacion del token
        exp: moment().add(7,'days').unix(), // fecha de expiracion del token

    }

    return jwt.encode(payload,secret); //retorna los datos del usuario + la contraseña de encriptacion 
}