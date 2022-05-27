'use strict'

var Cliente = require('../models/cliente');
var bcrypt = require('bcrypt-nodejs');
var jwt = require ('../helpers/jwt');

const registro_cliente = async function(req,res){
    //

    var data=req.body;
    var clientes_arr = [];
    clientes_arr = await Cliente.find({email:data.email});

    if(clientes_arr.length==0)
    {
   // REGISTRO
        if(data.password)
        {
          bcrypt.hash(data.password, null, null, async function(err,hash){
              if(hash)
              {
                data.password =  hash;
                var reg = await Cliente.create(data);
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

const login_cliente = async function (req,res){
   var data = req.body; 
   var cliente_arr = [];

   cliente_arr = await Cliente.find({email:data.email});

   if(cliente_arr.length==0)
   {
    res.status(200).send({message:'No se encontro el correo', data:undefined}) //Si no hay un correo en la base de datos igual al ingresado, manda este mensaje
   }
   else
   {
    //LOGIN 
    let user = cliente_arr [0]; //Guarda el primer indice del array que seria el usuario
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


const listar_clientes_filtro_admin = async function(req,res) {
  console.log(req.user);
  if(req.user)
  {
     if(req.user.role == 'admin') //si el usuario tiene rol de admin pasara a ejecutar el if
     {
      let tipo=req.params['tipo'];
      let filtro=req.params['filtro'];
      console.log(tipo);
    
      if(tipo==null || tipo== 'null')
      {
        //SI ES NULO LISTA TODOS LOS CLIENTES
        let reg = await Cliente.find();
        res.status(200).send({data:reg});
      }
      else
      {
        //FILTRO 
         if(tipo=='apellidos') //busca por filtro si es que se utiliza el form filtro
         {
           let reg = await Cliente.find({apellidos:new RegExp(filtro,'i')});
           res.status(200).send({data:reg});
         }
         else if(tipo=='correo') //sino tambien se busca por el form de correo
         {
          let reg = await Cliente.find({email:new RegExp(filtro,'i')});
          res.status(200).send({data:reg});
         }
      }
    
     }
     else
     {
       res.status(500).send({message:'NoAccess'});
     }
  }
  else
  {
    res.status(500).send({message:'NoAccess'});
  }

}


const registro_cliente_admin = async function(req,res){
 if(req.user){
  if(req.user.role == 'admin')
  {
   var data= req.body;

   bcrypt.hash('123456789',null,null, async function(err,hash)
   {
     if(hash)
     {
       data.password = hash;
      let reg = await Cliente.create(data);
      res.status(200).send({data:reg})
     }
     else
     {
      res.status(200).send({message:'Hubo un error en el servidor', data:undefined}) 
     }
   });
  }
  else
     {
       res.status(500).send({message:'NoAccess'});
     }
  }
  else
  {
    res.status(500).send({message:'NoAccess'});
  }
}

const obtener_cliente_admin = async function(req,res){

  if(req.user)
  {
     if(req.user.role == 'admin') 
     {
        var id = req.params['id'];
        try  //si el id tiene el idenfiticador mandara lo que esta dentro
        {
          var reg  =  await Cliente.findById({_id:id});
          res.status(200).send({data:reg})
        }
         catch (error) //si encuentra un error en el identificador manda un objeto vacio
        {
          res.status(200).send({data:undefined})
        }
     }
     else
     {
       res.status(500).send({message:'NoAccess'});
     }
  }
  else
  {
    res.status(500).send({message:'NoAccess'});
  }
}

const actualizar_cliente_admin = async function(req, res){
  
  if(req.user)
  {
     if(req.user.role == 'admin') 
     {
        var id = req.params['id'];

        var data = req.body; //el cuerpo de los datos se alamacena en data

        console.log(req.files)
       
        var reg = await Cliente.findByIdAndUpdate({_id:id},{ // aqui va a tener los datos del registro a actualizar
          nombres: data.nombres,
          apellidos: data.apellidos,
          email: data.email,
          telefono: data.telefono,
          f_nacimiento: data.f_nacimiento,
          dni: data.dni,
          genero : data.genero
        }); 

        res.status(200).send({data:reg})
     }
     else
     {
       res.status(500).send({message:'NoAccess'});
     }
  }
  else
  {
    res.status(500).send({message:'NoAccess'});
  }
}
  
const eliminar_cliente_admin = async function(req,res){
  if(req.user)
  {
     if(req.user.role == 'admin') 
     {
      var id = req.params['id']; // recibe la id que le esta enviando por la ruta de cliente .js

      let reg = await Cliente.findByIdAndRemove({_id:id});
      res.status(200).send({data:reg});
     }
     else
     {
       res.status(500).send({message:'NoAccess'});
     }
  }
  else
  {
    res.status(500).send({message:'NoAccess'});
  }
}


module.exports=  //exportacion de las funciones
{
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin,
    registro_cliente_admin,
    obtener_cliente_admin,
    actualizar_cliente_admin,
    eliminar_cliente_admin
        
} 