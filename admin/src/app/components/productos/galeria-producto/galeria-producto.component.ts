import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/GLOBAL';
import { v4 as uuidv4 } from 'uuid';

declare var iziToast:any;
declare var jQuery:any; 
declare var $:any;

@Component({
  selector: 'app-galeria-producto',
  templateUrl: './galeria-producto.component.html',
  styleUrls: ['./galeria-producto.component.css']
})
export class GaleriaProductoComponent implements OnInit {

  public producto :any = {};
  public id:any;
  public token:any;


  public nueva_variedad = '';
  public load_btn = false;
  public url:any;
  public file: any =  undefined;

 constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService
  ) {   
    this.url = global.url;
    this.token = localStorage.getItem('token'); 
    this._route.params.subscribe(
    params =>{
       this.id = params['id'];

       this.init_data();
    }
  ); 
}

  init_data(){
    this._productoService.obtener_producto_admin(this.id, this.token).subscribe(
      response => {
        if(response.data == undefined) //sino existe la data del producto con el id enviado por url hace losisguiente, sino despliega todos los datos del else
        {
          this.producto = undefined;

        }
        else
        {
           this.producto = response.data; //imprime en consola toda la data del producto
           
        }
        console.log(this.producto);
      },
      error =>{
      }
    );
  }

  ngOnInit(): void {
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
      $('#input-img').val('');
      this.file = undefined; // sies una imagen que pesa mas de 4MB vuelve a resetear la subida y el boton queda desactivado
   } 

   console.log(this.file);
 }

  subir_imagen()
  {
    if(this.file!=undefined)
    {
      let data = {
         imagen: this.file,
         _id: uuidv4()
      }
      console.log(data);
      this._productoService.agregar_imagen_galeria_admin(this.id,data,this.token).subscribe(
        response => {
          console.log (response);
          this.init_data();
          $('#input-img').val('');
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
        message: 'Debe seleccionar una imagen para subir', 
        titleColor: '#FF0000',
       }); //fin de alerta iziToast 
    }
  }

  eliminar(id:any){
    this.load_btn =true;
    this._productoService .eliminar_producto_admin(id, this.token).subscribe(
      response =>{
        console.log(response);
        iziToast.show({
          title:'SUCCESS',
          class:'text-success',
          position: 'topRight',
          color:'#FFF',
          message: 'El producto se elimino correctamente', 
          titleColor: '#1DC74C',
         }); //fin de alerta iziToast

         //funcion para cerrar el modal dinamicamente
         $('#delete-'+id).modal('hide'); //oculta el modal
         $('modal-backdrop').removeClass('show'); //borra la clase show

         this.load_btn=false;
         this.init_data();
      },
      error => {
        console.log(error);
        this.load_btn=false;

        iziToast.show({
          title:'SUCCESS',
          class:'text-danger',
          position: 'topRight',
          color:'#FFF',
          message: 'Ocurrio un error en el servidor', 
          titleColor: '#1DC74C',
         }); //fin de alerta iziToast
      }
    );

  }

}
