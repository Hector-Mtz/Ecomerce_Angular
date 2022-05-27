import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast:any;

@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.css']
})
export class EditClienteComponent implements OnInit {

  public cliente:any={};
  public id: any; //aqui se guarda el id que se pasa por la url
  public token:any;
  public load_btn = false;
  public load_data = true;

  constructor(
    private _route : ActivatedRoute,
    private _clienteService : ClienteService,
    private _adminService :AdminService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
   }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        console.log(this.id);
        //NO IMPRIME DE MOMENTO EL ID EN CONSOLA
        
        this._clienteService.obtener_cliente_admin(this.id,this.token).subscribe(
          response =>{
             console.log(response);
             if(response.data == undefined)//si la data que recibe es undefined  no recibe la data
             {
               this.cliente = undefined;
               this.load_data = false;
             } 
             else //si si es definida la data procede a recibirla bien
             {
               this.cliente = response.data;
               this.load_data = false;
             }
          },
          error => {
             
          }
        );       
      }
    )
  }

  actualizar(updateForm:any){
    if (updateForm.valid)
    {
       this.load_btn = true;
       this._clienteService.actualizar_cliente_admin(this.id,this.cliente,this.token).subscribe(
         response =>{
            console.log(response);
            iziToast.show({
              title:'SUCCESS',
              class:'text-success',
              position: 'topRight',
              color:'#FFF',
              message: 'El cliente se actualizo correctamente', 
              titleColor: '#1DC74C',
             }); //fin de alerta iziToast

             this.load_btn = false;
             this._router.navigate(['/panel/clientes']);
         },
         error =>{
          console.log(error);
       }
       ); //this.cliente tiene en cuenta los inputs donde se ingresan los datos
    }
    else 
    iziToast.show({
      title:'ERROR',
      class:'text-danger',
      position: 'topRight',
      color:'#FFF',
      message: 'Los datos del formulario son incorrectos', 
      titleColor: '#FF0000',
     }); //fin de alerta iziToast{

    }
  }


