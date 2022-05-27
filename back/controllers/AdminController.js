'use strict'

var Admin = require ('../models/admin');
var bcrypt = require('bcrypt-nodejs');
var jwt = require ('../helpers/jwt');

const registro_admin = async function(req,res){
    //

    var data=req.body;
    var admins_arr = [];
    admins_arr = await Admin.find({email:data.email});

    if(admins_arr.length==0)
    {
   // REGISTRO
        if(data.password)
        {
          bcrypt.hash(data.password, null, null, async function(err,hash){
              if(hash)
              {
                data.password =  hash;
                var reg = await Admin.create(data);
                res.status(200).send({data: reg});
              }
              else
              {
                res.status(200).send({message:'ErrorServer', data:undefined});     
              }
          }); //ENCRIPTA LA CONTRASEÑA DEL CLIENTE
        }
        else
        {
            res.status(200).send({message:'No hay una contraseña', data:undefined});      
        }
    
    }
    else
    {
        res.status(200).send({message:'El Correo Ya Existe En La Base De Datos', data:undefined});   
    }
   
} 

const login_admin = async function (req,res){
  var data = req.body; 
  var admin_arr = [];

  admin_arr = await Admin.find({email:data.email});

  if(admin_arr.length==0)
  {
   res.status(200).send({message:'No se encontro el correo', data:undefined}) //Si no hay un correo en la base de datos igual al ingresado, manda este mensaje
  }
  else
  {
   //LOGIN 
   let user = admin_arr [0]; //Guarda el primer indice del array que seria el usuario
   bcrypt.compare(data.password, user.password, async function(error, check){
     if(check) // si las contraseñas son iguales mandara un true y ejecutara la primer funcion, sino pasara al else
     {
       res.status(200).send({
         data:user,
         token: jwt.createToken(user) 
        }); // Devuelve el objeto completo del usuario que tenga el mismo correo en la base de datos
     }
     else
     {
       res.status(200).send({message:'Contraseña no coincide', data:undefined}) //Si no hay un correo en la base de datos igual al ingresado, manda este mensaje
     }
   });  
  }
}

module.exports = {
    registro_admin,
    login_admin
}