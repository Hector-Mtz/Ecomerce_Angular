import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast:any;

@Component({
  selector: 'app-create-cliente',
  templateUrl: './create-cliente.component.html',
  styleUrls: ['./create-cliente.component.css']
})
export class CreateClienteComponent implements OnInit {

  public cliente:any ={
    genero:''
  };
  
  public token;
  public load_btn = false;

  constructor(
    private _clienteService : ClienteService,
    private _adminService : AdminService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
   }

  ngOnInit(): void {
  }

  registro(registroForm:any)
  {
    if(registroForm.valid)
    {
      console.log(this.cliente);
      this.load_btn = true;
      this._clienteService.registro_cliente_admin(this.cliente, this.token ).subscribe(
        response=>{
          console.log (response)
          iziToast.show({
            title:'SUCCESS',
            class:'text-success',
            position: 'topRight',
            color:'#FFF',
            message: 'El cliente se registro correctamente', 
            titleColor: '#1DC74C',
           }); //fin de alerta iziToast

           this.cliente={
             genero:'',
             nombres:'',
             apellidos: '',
             f_nacimiento: '',
             telefono:'',
             dni:'',
             email:''
           }

           this.load_btn = false;
           this._router.navigate(['/panel/clientes']);
        },
        error =>{
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
        message: 'Los datos del formulario son incorrectos', 
        titleColor: '#FF0000',
       }); //fin de alerta iziToast
    }
  }

}
