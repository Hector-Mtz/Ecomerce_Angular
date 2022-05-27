import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { v4 as uuidv4 } from 'uuid';
import { global } from 'src/app/services/GLOBAL';

declare var jQuery:any; 
declare var $:any;
declare var iziToast:any;


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  public token:any;
  public config : any = {};
  public titulo_cat= '';
  public icono_cat= '';
  public file:any = undefined;
  public imgSelect :  any | ArrayBuffer;
  public url:any;

  constructor(
    private _adminService: AdminService
  ) {
    this.token = localStorage.getItem('token');
    this.url = global.url; //RUTA DE DONDE OBTIENE LA IMAGEN A MOSTRAR
    console.log(this.token);
    this._adminService.obtener_config_admin(this.token).subscribe(
      response => {
        this.config = response.data;
        this.imgSelect =  this.url+'obtener_logo/'+this.config.logo; //devuelve la imagen que esta en la collecion
        console.log(this.config);
      },
      error => {
        console.log(error);
      }
    );  
   }

  ngOnInit(): void {
  }

  agregar_cat(){
    if(this.titulo_cat && this.icono_cat) //si existe un icono y un titulo para categorias ejecuta el codigo sig que agrega al array de categorias
    {
      console.log(uuidv4());
      this.config.categorias.push({ //agrega al array lo que estamos pasando por el form
        titulo: this.titulo_cat,
        icono: this.icono_cat,
        _id: uuidv4() //creara un codigo unico por cada categoria nueva
      });

      this.icono_cat = '';
      this.titulo_cat='';
    }
    else
    {
      iziToast.show({
        title:'ERROR',
        class:'text-danger',
        position: 'topRight',
        color:'#FFF',
        message: 'Debe ingresar un titulo e icono para agregar la categoria', 
        titleColor: '#FF0000',
       }); //fin de alerta iziToast
    }
  }

  actualizar(confForm:any){
    if(confForm.valid)
    {
      let data = {
        titulo: confForm.value.titulo,
        serie:  confForm.value.serie,
        correlativo:  confForm.value.correlativo,
        categorias: this.config.categorias,
        logo:this.file
      } 

      console.log(data);

      this._adminService.actualizar_config_admin("621d0cb5d84ff92f57c0d561",data,this.token).subscribe(
        response =>{
          console.log(response);
        iziToast.show({
         title:'SUCCESS',
         class:'text-success',
         position: 'topRight',
         color:'#FFF',
         message: 'La nueva configuracion se actualizo correctamente', 
         titleColor: '#1DC74C',
        }); //fin de alerta iziToast
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
        message: 'Complete correctamente el formulario', 
        titleColor: '#FF0000',
       }); //fin de alerta iziToast
    }
  }

  fileChangeEvent(event:any)
  {
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
       $('.cs-file-drop-icon').addClass('cs-file-drop-preview img-thumbnail rounded'); //usa jquery para mostrar vista previa de la imagen a subir
       $('.cs-file-drop-icon').removeClass('cs-file-drop-icon cxi-upload');
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

  ngDoCheck():void
   {
    $('.cs-file-drop-preview').html("<img src="+this.imgSelect+">");
   }

  eliminar_categoria(idx:any){ //pasara el indice del item de la categoria
   this.config.categorias.splice(idx,1); //manda el indice que quiere eliminar al array de categorias
  }
}

