import { Component, OnInit } from '@angular/core';
import { global } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast:any;
declare var jQuery:any; 
declare var $:any;    

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html', 
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

  public load_data = true;
  public filtro = '';
  public token:any;
  public productos : Array<any>= [];
  public url:any;
  public load_btn = false;

  public page=1; 
  public pageSize=20; //numero de elementos que mostrara

  constructor(
  private _productoServices:ProductoService
  ) { 
    this.token = localStorage.getItem('token');
    this.url = global.url;
   }

  ngOnInit(): void {
     this.init_data();
  }

  

  init_data(){
    this._productoServices.listar_productos_admin(this.filtro,this.token).subscribe(
      response => {
        console.log(response);
        this.productos = response.data;
        this.load_data = false; // se iguala a falsa para que muestre los datos
      },
      error=>{
        console.log(error);
      }
    );
  }

  filtrar (){
    if(this.filtro)
    {
      this._productoServices.listar_productos_admin(this.filtro,this.token).subscribe(
        response => {
          console.log(response);
          this.productos = response.data;
          this.load_data = false; // se iguala a falsa para que muestre los datos
        },
        error=>{
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
        message: 'Ingrese un filtro para buscar', 
        titleColor: '#FF0000',
       }); //fin de alerta iziToast
    }
  }

  resetear(){
    this.filtro = ''; //resetea el campo del input
    this.init_data(); //resetea el listado de productos
  }

  eliminar(id:any){
    this.load_btn =true;
    this._productoServices.eliminar_producto_admin(id, this.token).subscribe(
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
