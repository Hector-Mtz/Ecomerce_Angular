import { Injectable } from '@angular/core';
import { global } from "./GLOBAL";
import {Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";


@Injectable({
  providedIn: 'root'
})
export class AdminService { 
  public url;

  constructor(
    private _http:HttpClient,
  ) {
    this.url = global.url;
   }
   
   login_admin(data:any):Observable<any>{
     let headers = new HttpHeaders().set('Content-Type','application/json');
     return this._http.post(this.url+'login_admin',data,{headers:headers});
   }

   getToken(){
     return localStorage.getItem('token');
   }

   public isAuthenticated(allowRoles:string[]):boolean{ //valida el token

      const token = localStorage.getItem('token') ; //se obtiene el token
      
      if(!token) //si no hay token en el localstorage retorna falso y va al guard
      {
        return false;
      }
       
       try 
       {
         const helper = new JwtHelperService();
         var decodedToken = helper.decodeToken(token); //Funcion de decodificacion de token para despues verificar si ese token es valido y mandar la info del usuario a loguear
         
         console.log(decodedToken);
       
          if(!decodedToken)
           {
             console.log('NO ES VALIDO'); 
             localStorage.removeItem('token');
             return false;
           }
       }
       catch(error)
       {
           localStorage.removeItem('token');
           return false;
       }

     
      
      return allowRoles.includes(decodedToken['role']); //va a verificar si existe un item que le pase por aqui
   }

   actualizar_config_admin(id:any,data:any,token:any):Observable<any>{
    if(data.logo)
    {
      let headers = new HttpHeaders({'Authorization':token});

      const fd = new FormData();
      fd.append('titulo',data.titulo);
      fd.append('serie',data.serie);
      fd.append('correlativo',data.correlativo);
      fd.append('categorias',JSON.stringify(data.categorias)); //se convierte a JSON ya que puede llegar almacenar objetos y estos no se mostraran correctamente en el fron
      fd.append('logo',data.logo);

      return this._http.put(this.url+'actualizar_config_admin/'+id,fd,{headers:headers});
    }
    else
    {
      let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
      return this._http.put(this.url+'actualizar_config_admin/'+id,data,{headers:headers});
    }
  }

  obtener_config_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_config_admin',{headers:headers});
  }

  obtener_config_public():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'obtener_config_public',{headers:headers});
  }
}
