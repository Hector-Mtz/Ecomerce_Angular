import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';


declare var iziToast:any;
declare var jQuery:any; 
declare var $:any;

@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css']
})
export class CreateProductoComponent implements OnInit {

  public producto:any = {
    categoria : ''
  };
  public file:any = undefined; //variable para obtener imagen y guardarla
  public imgSelect : any | ArrayBuffer = 'assets/img/01.jpg'; // alberga la imagen en base64 
  public config : any = {}; //configuraciones de admin
  public token:any;
  public load_btn = false;
  public config_global: any = {}; //configuraciones de uso global


  constructor(
    private _productoService:ProductoService,
    private _adminService: AdminService,
    private _router:Router
  ) {
    this.config ={
      height:500
    }

    this.token = this._adminService.getToken();
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
  }

  registro(registroForm:any)
  {
    if(registroForm.valid)
    {
      if(this.file == undefined) //comprueba si hay una imagen, si hay  pasa al else, sino arroja la sig alerta
      {
        iziToast.show({
          title:'ERROR',
          class:'text-danger',
          position: 'topRight',
          color:'#FFF',
          message: 'Debes subir una portada para registrar', 
          titleColor: '#FF0000',
         }); //fin de alerta iziToast
      }
      else
      {
        console.log(this.producto);
        console.log(this.file);
        this.load_btn = true;
  
        this._productoService.registro_producto_admin(this.producto,this.file,this.token).subscribe(
          response => {
             console.log(response);
             iziToast.show({
              title:'SUCCESS',
              class:'text-success',
              position: 'topRight',
              color:'#FFF',
              message: 'El producto se registro correctamente', 
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
       }); //fin de alerta iziToast

       this.load_btn = false;

       $('#input-portada').text('Seleccionar imagen');
       this.imgSelect = 'assets/img/01.jpg';
       this.file = undefined;
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
