import { Injectable } from '@angular/core';
//addes
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Observer } from "rxjs";
//Model
import { User } from '../../api/models/all';
import { SuperEmp } from '../../api/models/all';
import { Solicitud } from '../../api/models/all';
import { Historico } from '../../api/models/all';
import { Cargo } from '../../api/models/all';
import { Ciudad } from '../../api/models/all';
import { Empleado } from '../../api/models/all';
import { Oficina } from '../../api/models/all';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  baseUrl = 'http://127.0.0.1:8000/';
  baseApiUrl = `${this.baseUrl}api/`;
  //solicitud
  baseSolicitudUrl = `${this.baseUrl}api/solicitud/`;
  baseSolicitudUrlfilter = `${this.baseUrl}api/solicitud?`;
  //historico
  baseHistoricoUrl = `${this.baseApiUrl}historico/`;
  //User_empleado
  baseUserEmpleado = `${this.baseApiUrl}empleados/`;
  //User_empleado
  baseUserSupernumerario = `${this.baseApiUrl}super/`;
  //Empleado
  baseEmpleado = `${this.baseApiUrl}empleado/`;
  //Cargo
  baseCargo = `${this.baseApiUrl}cargos/`;
  //Ciudades
  baseCiudad = `${this.baseApiUrl}ciudad/`;
  //Oficina
  baseOficina = `${this.baseApiUrl}oficinas/`;
  //
  headers = new HttpHeaders({
    'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'
  });

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) { }

  recoveryPassword(data){
    const body = data;
    return this.httpClient.post(`${this.baseApiUrl}password/reset`, body, {headers: this.headers});
  }

  resetPassword(data){
    const body = data;
    return this.httpClient.post(`${this.baseApiUrl}password/update`, body, {headers: this.headers});
  }

  loginUser(authData) {
    const body = JSON.stringify(authData);
    return this.httpClient.post(`${this.baseUrl}auth/`, body, {headers: this.headers});
  }

  registerUser(authData) {
    const body = JSON.stringify(authData);
    return this.httpClient.post(`${this.baseUrl}api/user/`, body, {headers: this.headers});
  }

  getAuthHeaders() {
    const token = this.cookieService.get('bo-token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
    });
  }

  //solicitudes
  createSolicitud(solicitud: Solicitud): Observable<object>{
    return this.httpClient.post(this.baseSolicitudUrl, solicitud, {headers: this.getAuthHeaders()});
  }
  getSolicitudes(): Observable<any>{
    return this.httpClient.get<Solicitud[]>(this.baseSolicitudUrl, {headers: this.getAuthHeaders()});
  }
  getSolicitudesEspera() {
    return this.httpClient.get<Solicitud[]>(`${this.baseSolicitudUrlfilter}estado=E`, {headers: this.getAuthHeaders()});
  }
  getSolicitudesAceptadas() {
    return this.httpClient.get<Solicitud[]>(`${this.baseSolicitudUrlfilter}estado=A`, {headers: this.getAuthHeaders()});
  }
  getSolicitudesCanceladas() {
    return this.httpClient.get<Solicitud[]>(`${this.baseSolicitudUrlfilter}estado=C`, {headers: this.getAuthHeaders()});
  }
  getSolicitud(id: number): Observable<any>{
    return this.httpClient.get(`${this.baseSolicitudUrl}${id}/`, {headers: this.getAuthHeaders()});
  }
  updateSolicitud(id: number, payload: any): Observable<object>{
    return this.httpClient.put(`${this.baseSolicitudUrl}${id}/`, payload);
  }
  deleteSolicitud(id: number) {
    return this.httpClient.delete(`${this.baseSolicitudUrl}${id}/`, {headers: this.getAuthHeaders()});
  }
  SolicitudA(id: number, data) {
    const body = data;
    return this.httpClient.put<any>(`${this.baseSolicitudUrl}${id}/estado_aceptado/`, body, {headers: this.getAuthHeaders()});
  }
  SolicitudC(id: number, data) {
    const body = data;
    return this.httpClient.put<any>(`${this.baseSolicitudUrl}${id}/estado_cancelado/`, body, {headers: this.getAuthHeaders()});
  }

  //historico
  createHistoricoSolicitud(historico: Historico): Observable<object>{
    return this.httpClient.post(this.baseHistoricoUrl, historico, {headers: this.getAuthHeaders()});
  }
  getHistoricoSolicitudes(){
    return this.httpClient.get<Historico[]>(this.baseHistoricoUrl, {headers: this.getAuthHeaders()});
  }
  getHistoricoSolicitud(id: number): Observable<any>{
    return this.httpClient.get(`${this.baseHistoricoUrl}${id}/`, {headers: this.getAuthHeaders()});
  }
  updateHistoricoSolicitud(id: number, payload: any): Observable<object>{
    return this.httpClient.put(`${this.baseHistoricoUrl}${id}/`, payload);
  }
  deleteHistoricoSolicitud(id: number, data) {
    const body = data;
    return this.httpClient.put(`${this.baseHistoricoUrl}${id}/delt/`, body,{headers: this.getAuthHeaders()});
  }

  //UserEmpleado
  createUserEmpleado(user: User): Observable<object>{
    return this.httpClient.post(this.baseUserEmpleado, user, {headers: this.getAuthHeaders()});
  }
  getUserEmpleados(){
    return this.httpClient.get<User[]>(this.baseUserEmpleado, {headers: this.getAuthHeaders()});
  }
  getUserEmpleado(id: number): Observable<any>{
    return this.httpClient.get(`${this.baseUserEmpleado}${id}/`, {headers: this.getAuthHeaders()});
  }
  updateUserEmpleado(id: number, payload: any): Observable<object>{
    return this.httpClient.put(`${this.baseUserEmpleado}${id}/`, payload);
  }
  deleteUserEmpleados(id: number) {
    return this.httpClient.delete(`${this.baseUserEmpleado}${id}/`, {headers: this.getAuthHeaders()});
  }
  //UserSupernumerario
  createUserSupernumerario(superemp: SuperEmp): Observable<object>{
    return this.httpClient.post(this.baseUserSupernumerario, superemp, {headers: this.getAuthHeaders()});
  }
  getUserSupernumerarios(){
    return this.httpClient.get<SuperEmp[]>(this.baseUserSupernumerario, {headers: this.getAuthHeaders()});
  }
  getUserSupernumerario(id: number): Observable<any>{
    return this.httpClient.get(`${this.baseUserSupernumerario}${id}/`, {headers: this.getAuthHeaders()});
  }
  updateUserSupernumerario(id: number, payload: any): Observable<object>{
    return this.httpClient.put(`${this.baseUserSupernumerario}${id}/`, payload);
  }
  deleteUserSupernumerario(id: number) {
    return this.httpClient.delete(`${this.baseUserSupernumerario}${id}/`, {headers: this.getAuthHeaders()});
  }
  //empleado
  getEmpleado(payload: any): Observable<object>{
    return this.httpClient.get(this.baseEmpleado, payload);
  }

  //cargo
  createCargos(ciudad: Ciudad): Observable<object>{
    return this.httpClient.post(this.baseCargo, ciudad, {headers: this.getAuthHeaders()});
  }
  getCargos(): Observable<any>{
    return this.httpClient.get(this.baseCargo, {headers: this.getAuthHeaders()});
  }
  getCargo(id: number): Observable<any>{
    return this.httpClient.get(`${this.baseCargo}${id}/`, {headers: this.getAuthHeaders()});
  }
  updateCargo(id: number, payload: any): Observable<object>{
    return this.httpClient.put(`${this.baseCargo}${id}/`, payload);
  }
  deleteCargo(id: number) {
    return this.httpClient.delete(`${this.baseCargo}${id}/`, {headers: this.getAuthHeaders()});
  }

  //oficina
  createOficinas(oficina: Oficina): Observable<object>{
    return this.httpClient.post(this.baseOficina, oficina, {headers: this.getAuthHeaders()});
  }
  getOficinas(): Observable<any>{
    return this.httpClient.get(this.baseOficina, {headers: this.getAuthHeaders()});
  }
  getOficina(id: number): Observable<any>{
    return this.httpClient.get(`${this.baseOficina}${id}/`, {headers: this.getAuthHeaders()});
  }
  getOficinaData(oficina: Oficina): Observable<object>{
    return this.httpClient.post(`${this.baseApiUrl}oficinadata/`, oficina,{headers: this.getAuthHeaders()});
  }
  updateOficina(id: number, payload: any): Observable<object>{
    return this.httpClient.put(`${this.baseOficina}${id}/`, payload);
  }
  deleteOficina(id: number) {
    return this.httpClient.delete(`${this.baseOficina}${id}/`, {headers: this.getAuthHeaders()});
  }

  //ciudad

  createCiudades(ciudad: Ciudad): Observable<object>{
    return this.httpClient.post(this.baseCiudad, ciudad, {headers: this.getAuthHeaders()});
  }
  getCiudades(): Observable<any>{
    return this.httpClient.get(this.baseCiudad, {headers: this.getAuthHeaders()});
  }
  getCiudad(id: number): Observable<any>{
    return this.httpClient.get(`${this.baseCiudad}${id}/`, {headers: this.getAuthHeaders()});
  }
  updateCiudad(id: number, payload: any): Observable<object>{
    return this.httpClient.put(`${this.baseCiudad}${id}/`, payload);
  }
  deleteCiudad(id: number) {
    return this.httpClient.delete(`${this.baseCiudad}${id}/`, {headers: this.getAuthHeaders()});
  }
  getEmpleadoData(data) {
    return this.httpClient.post(`${this.baseApiUrl}empleadodata/`, data, {headers: this.headers});
  }



}
