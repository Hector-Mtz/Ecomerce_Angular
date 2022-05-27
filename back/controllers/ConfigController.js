var Config = require('../models/config');
var fs = require('fs');
var path = require('path');

const obtener_config_admin = async function(req,res){
  if(req.user)
  {
    if(req.user.role == 'admin')
    {
      let reg = await Config.findById({_id:"621d0cb5d84ff92f57c0d561"});
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

const actualizar_config_admin = async function(req,res) //en este metodo si tiene que se valido el usuario y que sea admin
{
    if(req.user)
    {
      if(req.user.role == 'admin')
      {
        let data = req.body;

         if(req.files) //si existe imagen se actualiza con imagen
         {
           console.log('Si hay img');
          var img_path = req.files.logo.path; //extrae el nombre de la imagen que se encuentra en el indice de portada y que esta en path
          var name = img_path.split('\\'); //divide el nombre en 3 partes
          var logo_name = name[2]; //extrae solo el nombre ya que se tiene uploads[0]\\portada[1]\\ nombre de la imagen[2]

          let reg = await Config.findByIdAndUpdate({_id:"621d0cb5d84ff92f57c0d561"},{
            categorias: JSON.parse(data.categorias),
            titulo: data.titulo,
            serie:data.serie,
            logo: logo_name,
            correlativo: data.correlativo,
           });//solo seraun documento que se actualizara, por tanto se le da el id que tiene ya en la coleccion

           fs.stat('./uploads/configuraciones/'+reg.logo, function(err){ //se usa reg.portada porque en la variable reg se esta 
            if(!err)//se verifica que exista la imagen
            { 
               fs.unlink('./uploads/configuraciones/'+reg.logo, err=>{
                 if(err) throw err;//se verifica si hay un error y se captura el error
               }); //funcion para eliminar un archivo que no se utilizara
            }
           });// busca la imagen en esta ruta       
           res.status(200).send({data:reg});
         } 
         else //sino existe imagen se actualzia sin imagen
         {
           console.log('No hay imagen');
            let reg = await Config.findByIdAndUpdate({_id:"621d0cb5d84ff92f57c0d561"},{
                categorias: data.categorias,
                titulo: data.titulo,
                serie:data.serie,
                correlativo: data.correlativo,
            });//solo seraun documento que se actualizara, por tanto se le da el id que tiene ya en la coleccion    
           res.status(200).send({data:reg});
         } 
        /* await  Config.create({   CREACION DE ESTE ELEMENTO EN LA COLECCION PARA DEJARLO POR DEFAULT Y LUEGO ACTUALIZARLO
            categorias:[],
            titulo: 'Createx',
            logo: 'logo.png',
            serie: 0001,
            correlativo: 000001, 
         });*/
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

const obtener_logo = async  function(req,res){ //esta funcion obtendra el nombre de la imagen de forma publica para buscarla dentro del proyecto en la carpeta de uploads
  var img = req.params['img'];
  console.log(img);
  fs.stat('./uploads/configuraciones/'+img, function(err){
    if(!err)
    {
      let path_img= './uploads/configuraciones/'+img;
      res.status(200).sendFile(path.resolve(path_img)); //con esto devuelve la imagen 
    }
    else //sino encuentra la imagen devolvera la imagen por defecto
    {
     let path_img= './uploads/default.jpg';
     res.status(200).sendFile(path.resolve(path_img)); 
    }
  });// busca la imagen en esta ruta
}

const obtener_config_public = async function(req,res){ //funcion de ambito publico para usar la configuracion de la plataforma
      let reg = await Config.findById({_id:"621d0cb5d84ff92f57c0d561"});
      res.status(200).send({data:reg});
}


module.exports = {
   actualizar_config_admin,
   obtener_config_admin,
   obtener_logo,
   obtener_config_public
}