import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/GLOBAL';

declare var jQuery:any; 
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-variedad-producto',
  templateUrl: './variedad-producto.component.html',
  styleUrls: ['./variedad-producto.component.css']
})
export class VariedadProductoComponent implements OnInit {

  public producto :any = {};
  public id:any;
  public token:any;


  public nueva_variedad = '';
  public  load_btn = false;
  public url:any;

  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService
  ) {   
    this.url = global.url;
    this.token = localStorage.getItem('token'); 
    this._route.params.subscribe(
    params =>{
       this.id = params['id'];

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
  ); 
}

  ngOnInit(): void {
    
  }

  agregar_variedad()
  {
    if(this.nueva_variedad)
    {
      this.producto.variedades.push({titulo:this.nueva_variedad});
      this.nueva_variedad = '';
    }
    else
    {
      iziToast.show({
        title:'ERROR',
        class:'text-danger',
        position: 'topRight',
        color:'#FFF',
        message: 'La variedad debe ser completada', 
        titleColor: '#FF0000',
       }); //fin de alerta iziToast
    }
  }

  eliminar_variedad(idx:any){ //pasara el indice del item de la categoria
    this.producto.variedades.splice(idx,1); //manda el indice que quiere eliminar al array de categorias
   }

   actualizar()
   {
     if(this.producto.titulo_variedad) //si se esta enviando el titulo_variedad por el form, se actualizara
     {
       if(this.producto.variedades.length >= 1) //validara si hay elementos en el array de variedades
       {
         this.load_btn =true;
          //le pasamos al servicio la data para que actualice
          this._productoService.actualizar_producto_variedades_admin({
             titulo_variedad:this.producto.titulo_variedad,
             variedades : this.producto.variedades
          },this.id,this.token).subscribe(
            response => {
              console.log(response);
              iziToast.show({
                title:'SUCCESS',
                class:'text-success',
                position: 'topRight',
                color:'#FFF',
                message: 'Las variedades se actualizaron correctamente', 
                titleColor: '#1DC74C',
               }); //fin de alerta iziToast
       
              this.load_btn =false;
            },
            error => {
              console.log(error);
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
          message: 'Se debe agregar al menos una variedad', 
          titleColor: '#FF0000',
         });
       }
     }
     else
     {
      iziToast.show({
        title:'ERROR',
        class:'text-danger',
        position: 'topRight',
        color:'#FFF',
        message: 'Debe completar el titulo de la variedad', 
        titleColor: '#FF0000',
       });
     }
   }

}
