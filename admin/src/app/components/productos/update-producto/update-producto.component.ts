import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { global } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast:any;
declare var jQuery:any; 
declare var $:any;

@Component({
  selector: 'app-update-producto',
  templateUrl: './update-producto.component.html',
  styleUrls: ['./update-producto.component.css']
})
export class UpdateProductoComponent implements OnInit {

  public producto : any = {};
  public config : any = {};
  public imgSelect :  any | ArrayBuffer;
  public load_btn = false;
  public id:any;
  public token:any;
  public url:any;
  public file:any = undefined; //variable para obtener imagen y guardarla
  public config_global : any = {};

  constructor(
    //inyeccion de modulos
    private _route : ActivatedRoute,
    private _productoService : ProductoService,
    private _router:Router,
    private _adminService :AdminService
  ) {
    this.config ={
      height:500
    }
    this.token = localStorage.getItem('token');
    this.url = global.url;
    this._adminService.obtener_config_public().subscribe(
      response => {
        console.log(response); 
        this.config_global = response.data; //pasa toda la data de la configuracion global a la variable
      },
      error => {

      }
    );
   }

  ngOnInit(): void {
    this._route.params.subscribe(
      params =>{
         this.id = params['id'];
         console.log(this.id);
         this._productoService.obtener_producto_admin(this.id, this.token).subscribe(
           response => {
             if(response.data == undefined) //sino existe la data del producto con el id enviado por url hace losisguiente, sino despliega todos los datos del else
             {
               this.producto = undefined;
               console.log(this.producto);
             }
             else
             {
                this.producto = response.data;
                this.imgSelect = this.url + 'obtener_portada/' + this.producto.portada;
                console.log(this.producto);
             }
           },
           error =>{
            console.log(error);
           }
         );
      }
    );
  }

 actualizar(actualizarForm:any)
 {
   if(actualizarForm.valid)
   {
    console.log(this.producto);
    console.log(this.file)
    var data : any = {};
    if(this.file != undefined) //si la imagen es diferente de undefined pasa los datos de producto y los asigna a data
    {
       data.portada = this.file;
    }

       data.titulo = this.producto.titulo;
       data.stock = this.producto.stock;
       data.precio = this.producto.precio;
       data.categoria = this.producto.categoria;
       data.descripcion = this.producto.descripcion;
       data.contenido = this.producto.contenido;

       
    this.load_btn = true;
    this._productoService.actualizar_producto_admin(data,this.id,this.token).subscribe(
      response =>{
        console.log(response);
        iziToast.show({
         title:'SUCCESS',
         class:'text-success',
         position: 'topRight',
         color:'#FFF',
         message: 'El producto se actualizo correctamente', 
         titleColor: '#1DC74C',
        }); //fin de alerta iziToast

        this.load_btn = false;

        this._router.navigate(['/panel/productos']);
      },
      error => {
        console.log(error);
        this.load_btn = false;
      }
    );
   }
   else
   {
    iziToast.show({
      title:'ERROR',
      class:'text-danger',
      position: 'topRight',
      color:'#FFF',
      message: 'Los datos del formulario son incorrectos', 
      titleColor: '#FF0000',
     }); //fin de alerta 
     
     this.load_btn = false;

   }
 }

 fileChangeEvent(event: any): void{
  var file :any; //variable que va a almacenar la imagen a validar
  if(event.target.files && event.target.files[0]) //verifica si hay una imagen que se mande desde el input file y pregunta si hay una imagen o abra una imagen
  {
     file = <File>event.target.files[0]; //se usa files porque se pretende que mande varias imagenes
  }
  else
 {
   iziToast.show({
     title:'ERROR',
     class:'text-danger',
     position: 'topRight',
     color:'#FFF',
     message: 'No hay imagen de envio', 
     titleColor: '#FF0000',
    }); //fin de alerta iziToast
 }

 //validara el tamaño de la imagen
 if(file.size <= 4000000)
 {
   if(file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg')
   {
     const reader = new FileReader();
     reader.onload = e => this.imgSelect = reader.result;
     console.log(this.imgSelect);
     reader.readAsDataURL(file);

     $('#input-portada').text(file.name);

     this.file =  file;
   }
   else
   {
     iziToast.show({
       title:'ERROR',
       class:'text-danger',
       position: 'topRight',
       color:'#FFF',
       message: 'El archivo debe ser de tipo imagen', 
       titleColor: '#FF0000',
      }); //fin de alerta iziToast
     
    $('#input-portada').text('Seleccionar imagen');
    this.imgSelect = 'assets/img/01.jpg';
    this.file = undefined;
   }
 }
 else 
 {
   iziToast.show({
     title:'ERROR',
     class:'text-danger',
     position: 'topRight',
     color:'#FFF',
     message: 'La imagen  no puede superar los 4MB', 
     titleColor: '#FF0000',
    }); //fin de alerta iziToast
    
    $('#input-portada').text('Seleccionar imagen');
    this.imgSelect = 'assets/img/01.jpg';
    this.file = undefined;
 } 

 console.log(this.file);
}

}
