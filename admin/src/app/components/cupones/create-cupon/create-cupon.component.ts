import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast:any;

@Component({
  selector: 'app-create-cupon',
  templateUrl: './create-cupon.component.html',
  styleUrls: ['./create-cupon.component.css']
})
export class CreateCuponComponent implements OnInit {

  public cupon : any = {
    tipo:''
  };

  public load_btn = false;

  public token:any;

  constructor(
    private cuponService : CuponService,
    private _router : Router
  ) { 
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
  }


  registro(registroForm:any){
     if(registroForm.valid)
     {
      this.load_btn=true;
      this.cuponService.registro_cupon_admin(this.cupon, this.token).subscribe(
        response =>{
            console.log(response);
            iziToast.show({
              title:'SUCCESS',
              class:'text-success',
              position: 'topRight',
              color:'#FFF',
              message: 'El cupon se registro correctamente', 
              titleColor: '#1DC74C',
             }); //fin de alerta iziToast
            
             this.load_btn=false;
             this._router.navigate(['/panel/cupones']);
        },
        error => {
          console.log(error);
          this.load_btn=false;
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
