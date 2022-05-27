'use strict'

var jwt = require('jwt-simple'); //paquete para decodificar tokens

var moment = require('moment'); 

var secret = 'ecomerce'; // contraseña para encriptar tokens  

exports.auth = function(req,res,next)
{

  if(!req.headers.authorization)
  {
    return res.status(403).send({message:'NoHeadersError'});
  }

  var token = req.headers.authorization.replace(/['"]+/g,'');

  var segment = token.split('.'); //divide el token en partes

 // console.log(token); // imprime el token completo en consola

  //console.log(segment); //imprime los segmentos del token

  if(segment.lenght ==3 )
  {
    return res.status(403).send({message: 'InvalidToken'});
  }
  else
  {
   try 
   {
      var payload = jwt.decode(token, secret); //decodificacion del token
      if(payload.exp <= moment().unix()) //verifica la expiracion del token
      {
        return res.status(403).send({message: 'TokenExpirado'});
      }
   } 
   catch (error) 
   {
    return res.status(403).send({message: 'InvalidToken'});
   }
  }

  req.user = payload;
  next();
}