var Cupon = require('../models/cupon'); //con esto se inicia el controlador a partir del modelo

const registro_cupon_admin = async function(req, res)
{
  if(req.user) //valida que haya un suer decodificado
  {
    if(req.user.role == 'admin')
    {
      let data = req.body;

      console.log(data);

      let reg = await Cupon.create(data);

      res.status(200).send({data:reg}); //devuelve al frontend la data con los datos registrados enviados por el fron
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

const listar_cupones_admin = async function (req,res)
{
  if(req.user)
  {
     if(req.user.role == 'admin') 
     {
      var filtro  = req.params['filtro'];
      let reg = await Cupon.find({codigo:new RegExp(filtro,'i')}).sort({createAt:-1});//lista los cupones por fecha de creacion  de mayor a menor
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

const obtener_cupon_admin = async function(req,res){

  if(req.user)
  {
     if(req.user.role == 'admin') 
     {
        var id = req.params['id'];
        try  //si el id tiene el idenfiticador mandara lo que esta dentro
        {
          var reg  =  await Cupon.findById({_id:id});
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

const actualizar_cupon_admin = async function(req,res){
  if(req.user)
  {
     if(req.user.role == 'admin') 
     {
        var data = req.body;
        var id = req.params['id'];

        let reg = await Cupon.findByIdAndUpdate({_id:id}, {
          //CAMPOS A ACTUALIZAR
          codigo: data.codigo,
          tipo: data.tipo,
          valor: data.valor,
          limite: data.limite
        });

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

const eliminar_cupon_admin = async function(req,res){
  if(req.user)
  {
     if(req.user.role == 'admin') 
     {
      var id = req.params['id']; // recibe la id que le esta enviando por la ruta de cliente .js

      let reg = await Cupon.findByIdAndRemove({_id:id});
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



module.exports = {
    registro_cupon_admin,
    listar_cupones_admin,
    obtener_cupon_admin,
    actualizar_cupon_admin,
    eliminar_cupon_admin
}