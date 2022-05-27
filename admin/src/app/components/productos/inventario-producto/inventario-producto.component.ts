import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast:any;
declare var jQuery:any; 
declare var $:any;    


@Component({
  selector: 'app-inventario-producto',
  templateUrl: './inventario-producto.component.html',
  styleUrls: ['./inventario-producto.component.css']
})
export class InventarioProductoComponent implements OnInit {

  public id:any; //id del inventario
  public token:any;
  public _iduser : any; //id del usuario que generara el registro
  public producto:any = {};
  public inventarios : Array<any> = [];
  public inventario : any = {};

  public load_btn = false;

  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService
  ) {
    this.token = localStorage.getItem('token'); //token declarado que se obtiene del localstorage
    this._iduser = localStorage.getItem('_id');//id de usuario declarado que se obtiene del localstorage
    console.log(this._iduser);
   }

  ngOnInit(): void {
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
                
                this._productoService.listar_inventario_producto_admin(this.producto._id, this.token).subscribe( //llama al metodo del listado que pasa por parametro el id y el token
                   response => {
                     console.log(response);
                     this.inventarios = response.data; //se guarda en inventarios todo el registro de inventario
                     //console.log(this.inventarios)  // se tiene que hacer populacion(join en SQL) para ver los datos de la coleccion de administracion 
                   },
                   error => {
                     
                   }
                );
             }
           },
           error =>{
           }
         );
      }
    );
  }

  eliminar(id:any){
    this.load_btn =true;
    this._productoService.eliminar_inventario_producto_admin(id, this.token).subscribe(
      response => {
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
      
         this._productoService.listar_inventario_producto_admin(this.producto._id, this.token).subscribe( //llama al metodo del listado que pasa por parametro el id y el token
          response => {
            console.log(response);
            this.inventarios = response.data; //se guarda en inventarios todo el registro de inventario
            //console.log(this.inventarios)  // se tiene que hacer populacion(join en SQL) para ver los datos de la coleccion de administracion 
          },
          error => {
            
          }
       );
          
            
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
  

  registro_inventario(inventarioForm:any){
    if(inventarioForm.valid)
    {
       let data = { //modelo que esta a la espera de parametros pasados por el modelo de producto
         producto: this.producto._id, //se obtiene de una variable arriba de producto
         cantidad: inventarioForm.value.cantidad, //viene del formulario
         admin: this._iduser,
         proveedor: inventarioForm.value.proveedor
       }

       this._productoService.registro_inventario_producto_admin(data, this.token).subscribe(
         response =>{
          iziToast.show({
            title:'SUCCESS',
            class:'text-success',
            position: 'topRight',
            color:'#FFF',
            message: 'Se agrego el nuevo stock al producto  correctamente', 
            titleColor: '#1DC74C',
           }); //fin de alerta iziToast

           //LISTA NUEVAMETE LOS STOCKS
           this._productoService.listar_inventario_producto_admin(this.producto._id, this.token).subscribe( //llama al metodo del listado que pasa por parametro el id y el token
            response => {
              console.log(response);
              this.inventarios = response.data; //se guarda en inventarios todo el registro de inventario
              //console.log(this.inventarios)  // se tiene que hacer populacion(join en SQL) para ver los datos de la coleccion de administracion 
            },
            error => {
              
            }
         );
         },
         error => {

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
       }); //fin de alerta iziToast
    }
  }
}
