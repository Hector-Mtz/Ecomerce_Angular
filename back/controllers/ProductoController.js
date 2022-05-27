'use strict'

var Producto =  require('../models/producto');
var Inventario =  require('../models/inventario');
var fs = require('fs');
var path = require('path');
//const producto = require('../models/producto');

const registro_producto_admin = async function (req,res) {
  if(req.user)
  {
    if(req.user.role == 'admin')
    {
      let data = req.body; // obtiene toda la data
      
      var img_path = req.files.portada.path; //extrae el nombre de la imagen que se encuentra en el indice de portada y que esta en path
      var name = img_path.split('\\'); //divide el nombre en 3 partes
      var portada_name = name[2]; //extrae solo el nombre ya que se tiene uploads[0]\\portada[1]\\ nombre de la imagen[2]

      data.slug = data.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');  //con la primera funcion reemplaza espacios en blanco y con la segunda los simbolos
      data.portada = portada_name; //guarda en la vairable data con indice portada la portada 
      let reg = await Producto.create(data); 

      let inventario = await Inventario.create({
        admin: req.user.sub, //lo que se le asigna esta en jwt.js 
        cantidad:data.stock,
        proveedor: 'Primer Registro',
        producto: reg._id
      }); // cada que se vaya a registrar un nuevo producto 

      res.status(200).send({data:reg, inventario:inventario}); 
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

const listar_productos_admin = async function(req,res) {
  if(req.user)
  {
    if(req.user.role == 'admin')
    {
      var filtro = req.params['filtro']; //pasa el filtro desde el html
      let reg = await Producto.find({titulo: new RegExp(filtro, 'i')});
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

const obtener_portada = async  function(req,res){ //esta funcion obtendra el nombre de la imagen de forma publica para buscarla dentro del proyecto en la carpeta de uploads
   var img = req.params['img'];
   console.log(img);
   fs.stat('./uploads/productos/'+img, function(err){
     if(!err)
     {
       let path_img= './uploads/productos/'+img;
       res.status(200).sendFile(path.resolve(path_img)); //con esto devuelve la imagen 
     }
     else //sino encuentra la imagen devolvera la imagen por defecto
     {
      let path_img= './uploads/default.jpg';
      res.status(200).sendFile(path.resolve(path_img)); 
     }
   });// busca la imagen en esta ruta
}

const obtener_producto_admin = async function(req,res){

  if(req.user)
  {
     if(req.user.role == 'admin') 
     {
        var id = req.params['id'];
        try  //si el id tiene el idenfiticador mandara lo que esta dentro
        {
          var reg  =  await Producto.findById({_id:id});
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


const actualizar_producto_admin = async function (req,res) {
  if(req.user)
  {
    if(req.user.role == 'admin')
    {
      let id = req.params['id'];
      let data = req.body; // obtiene toda la data
      console.log(data);

      if (req.files) //si existe una imagen  hace lo que esta dentro del if
      {
        var img_path = req.files.portada.path; //extrae el nombre de la imagen que se encuentra en el indice de portada y que esta en path
        var name = img_path.split('\\'); //divide el nombre en 3 partes
        var portada_name = name[2]; //extrae solo el nombre ya que se tiene uploads[0]\\portada[1]\\ nombre de la imagen[2]

        console.log("SI EXISTE IMAGEN");
        let reg = await Producto.findByIdAndUpdate({_id:id},{
          //datos a actualizar sin la imagen
            titulo: data.titulo,
            stock: data.stock,
            precio: data.precio,
            categoria: data.categoria,
            descripcion: data.descripcion,
            contenido:data.contenido,
            portada:portada_name
        }); //pasa el id del registro que se quiere actualizar 

        fs.stat('./uploads/productos/'+reg.portada, function(err){ //se usa reg.portada porque en la variable reg se esta 
         if(!err)//se verifica que exista la imagen
         { 
            fs.unlink('./uploads/productos/'+reg.portada, err=>{
              if(err) throw err;//se verifica si hay un error y se captura el error
            }); //funcion para eliminar un archivo que no se utilizara
         }
        });// busca la imagen en esta ruta 

        res.status(200).send({data:reg});

      }
      else //sino existe imagen realiza esto
      {
      console.log("NO EXISTE IMAGEN");
      let reg = await Producto.findByIdAndUpdate({_id:id},{ // se guarda todos los datos del producto que se actualizo
        //datos a actualizar sin la imagen
          titulo: data.titulo,
          stock: data.stock,
          precio: data.precio,
          categoria: data.categoria,
          descripcion: data.descripcion,
          contenido:data.contenido,
      }); //pasa el id del registro que se quiere actualizar 
      res.status(200).send({data:reg});
      }

      /* res.status(200).send({data:reg}); */
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

const eliminar_producto_admin = async function(req,res){
  if(req.user)
  {
     if(req.user.role == 'admin') 
     {
      var id = req.params['id']; // recibe la id que le esta enviando por la ruta de cliente .js

      let reg = await Producto.findByIdAndRemove({_id:id});
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

const listar_inventario_producto_admin = async function (req,res)
{
  if(req.user)
  {
     if(req.user.role == 'admin') 
     {
      var id = req.params['id']; // recibe la id del producto para obtener la data de este

      var reg = await Inventario.find({producto:id}).populate('admin').sort({createAt:-1}); //lista los stocks de mayor a menor
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

const eliminar_inventario_producto_admin = async function(req,res){
  if(req.user)
  {
     if(req.user.role == 'admin') 
     {
      var id = req.params['id']; // recibe la id del inventario para obtener la data de este

      let reg = await Inventario.findByIdAndRemove({_id:id}); //todo el registro con esta id se elimina de inventario

      let prod =  await Producto.findById({_id:reg.producto}); //obtiene y almacena la data del producto

      let nuevo_stock = parseInt(prod.stock) - parseInt(reg.cantidad); // resta el stock actual del producto menos el stock del registro del inventario que se eliminara

      let producto = await Producto.findByIdAndUpdate({_id:reg.producto}, { //busca y actualiza por el id del producto el inventario, que en este caso seria el stock
           stock: nuevo_stock
      });

      res.stat(200).send({data:producto})
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

const registro_inventario_producto_admin = async function(req,res){
  if(req.user)
  {
     if(req.user.role == 'admin') 
     {
      let data = req.body; //obtiene todo el registro

      let reg = await Inventario.create(data);

      let prod =  await Producto.findById({_id:reg.producto}); 

                           //STOCK ACTUAL      STOCK A AUMENTAR  
      let nuevo_stock = parseInt(prod.stock) + parseInt(reg.cantidad); 

      let producto = await Producto.findByIdAndUpdate({_id:reg.producto}, { //El id esta en reg.producto
        stock: nuevo_stock
   });

      res.status(200).send({data:reg});

      res.stat(200).send({data:producto})
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

const actualizar_producto_variedades_admin = async function (req,res) {
  if(req.user)
  {
    if(req.user.role == 'admin')
    {
      let id = req.params['id'];
      let data = req.body; // obtiene toda la data
      
      let reg = await Producto.findByIdAndUpdate({_id:id},{ // se guarda todos los datos del producto que se actualizo
        //datos a actualizar sin la imagen
         titulo_variedad: data.titulo_variedad,
         variedades: data.variedades
      }); //pasa el id del registro que se quiere actualizar 
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

const agregar_imagen_galeria_admin = async function (req,res) {
  if(req.user)
  {
    if(req.user.role == 'admin')
    {
      let id = req.params['id']; //producto que se selecciona para agregar las imagenes
      let data = req.body; // cuerpo con imagen que se quiere agregar
      
      var img_path = req.files.imagen.path; //extrae el nombre de la imagen que se encuentra en el indice de portada y que esta en path
      var name = img_path.split('\\'); //divide el nombre en 3 partes
      var imagen_name = name[2]; //extrae solo el nombre ya que se tiene uploads[0]\\portada[1]\\ nombre de la imagen[2]

    let reg = await Producto.findByIdAndUpdate({_id:id},{$push:{galeria:{ //pasa el id del producto al que se agregaran las imagenes, push para agregar al array de galeria 
        imagen:imagen_name,
        _id:data._id 
      }}});

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

const eliminar_imagen_galeria_admin = async function (req,res) {
  if(req.user)
  {
    if(req.user.role == 'admin')
    {
      let id = req.params['id']; //producto que se selecciona para agregar las imagenes
      let data = req.body; // cuerpo con imagen que se quiere agregar
      
    let reg = await Producto.findByIdAndUpdate({_id:id},{$pull: {galeria:{_id:data._id}}});

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



//METODOS PUBLICOS 
const  listar_productos_publico = async function(){
 var filtro = req.params['filtro'];

 let reg = await Producto.find({titulo:new RegExp(filtro, 'i')});
 res.status(200).send({data:reg});
}

module.exports={
    registro_producto_admin,
    listar_productos_admin,
    obtener_portada,
    obtener_producto_admin,
    actualizar_producto_admin,
    eliminar_producto_admin,
    listar_inventario_producto_admin,
    eliminar_inventario_producto_admin,
    registro_inventario_producto_admin,
    actualizar_producto_variedades_admin,
    listar_productos_publico,
    agregar_imagen_galeria_admin,
    eliminar_imagen_galeria_admin

} 