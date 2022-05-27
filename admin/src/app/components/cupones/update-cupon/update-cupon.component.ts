import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast:any;

@Component({
  selector: 'app-update-cupon',
  templateUrl: './update-cupon.component.html',
  styleUrls: ['./update-cupon.component.css']
})
export class UpdateCuponComponent implements OnInit {

  public cupon : any = {
    tipo:''
  };

  public load_btn = false;

  public token:any;

  public id:any

  public load_data = true;

 constructor(
    private cuponService : CuponService,
    private _router : Router,
    private _route : ActivatedRoute
  ) { 
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        console.log(this.id);
        //NO IMPRIME DE MOMENTO EL ID EN CONSOLA
      
        this.cuponService.obtener_cupon_admin(this.id, this.token).subscribe(
          response => {
            if(response.data == undefined)
            {
              this.cupon = undefined;
              this.load_data = false;
            }
            else
            {
              this.cupon = response.data;
              this.load_data = false;
            }
            console.log(this.cupon);
          }
        );
      }
    )
  }

  //CUPONES SON DISTINTOS A PRECIOS POR TEMPROADA
  actualizar(actualizarForm:any)
  {
    if(actualizarForm.valid)
    {
      this.load_btn = true;
      this.cuponService.actualizar_cupon_admin(this.id,this.cupon, this.token).subscribe(
        response =>{
          iziToast.show({
            title:'SUCCESS',
            class:'text-success',
            position: 'topRight',
            color:'#FFF',
            message: 'El cupon se actualizo correctamente', 
            titleColor: '#1DC74C',
           }); //fin de alerta iziToast

          this.load_btn = false;

          this._router.navigate(['/panel/cupones']);
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
