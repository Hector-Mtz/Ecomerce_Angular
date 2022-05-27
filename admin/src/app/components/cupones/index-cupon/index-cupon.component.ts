import { Component, OnInit } from '@angular/core';
import { CuponService } from 'src/app/services/cupon.service';


declare var iziToast:any;
declare var jQuery:any; 
declare var $:any;    

@Component({
  selector: 'app-index-cupon',
  templateUrl: './index-cupon.component.html',
  styleUrls: ['./index-cupon.component.css']
})
export class IndexCuponComponent implements OnInit {

  public load_data=true;

  public page=1; 
  public pageSize=10; //numero de elementos que mostrara
  public cupones : Array<any> = [];
  public filtro = '';
  public token;
 

  constructor(
    private _cuponService : CuponService
  ) { 
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this._cuponService.listar_cupones_admin(this.filtro,this.token).subscribe(
      response => {
        this.cupones = response.data;
        this.load_data = false;
      }
    );
  }

  filtrar(){
    this._cuponService.listar_cupones_admin(this.filtro,this.token).subscribe(
      response => {
        this.cupones = response.data;
        this.load_data = false;
      }
    );
  }

  eliminar(id:any) //recibe el id del boton eliminar
  {
    this._cuponService.eliminar_cupon_admin(id, this.token).subscribe(
      response =>{
        console.log(response);
        iziToast.show({
          title:'SUCCESS',
          class:'text-success',
          position: 'topRight',
          color:'#FFF',
          message: 'El cupon se elimino correctamente', 
          titleColor: '#1DC74C',
         }); //fin de alerta iziToast

         //funcion para cerrar el modal dinamicamente
         $('#delete-'+id).modal('hide'); //oculta el modal
         $('modal-backdrop').removeClass('show'); //borra la clase show

         this._cuponService.listar_cupones_admin(this.filtro,this.token).subscribe(
          response => {
            this.cupones = response.data;
            this.load_data = false;
          }
        );

      },
      error => {
        console.log(error);
      }
    );

  } // fin eliminar
}
