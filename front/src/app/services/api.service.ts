import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';


import { Log } from '../logs/log.interface'
import { Category } from '../categories/category.interface'

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

// API: GET /categoriess
 public getAllCategoriess(){
}

// API: POST /categories
public createCategory(category: Category) {
  // will use this.http.post()
}


// API: GET /categories/:id
public getCategoryById(categoryId: any) {
// will use this.http.get()
}


// API: PATCH /categories/:id
public updateCategory(category: Category) {
  // will use this.http.put()
}

// DELETE /categories/:id
public deleteCategoryById(categoryId: any){
  // will use this.http.delete()
}



}
