import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notebook {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface CreateNotebookRequest {
  title: string;
  content: string;
}

export interface UpdateNotebookRequest {
  title?: string;
  content?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotebookService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Get all notebooks for the current user
  getNotebooks(): Observable<Notebook[]> {
    return this.http.get<Notebook[]>(`${this.apiUrl}/notebook`);
  }

  // Get a single notebook by ID
  getNotebook(id: number): Observable<Notebook> {
    return this.http.get<Notebook>(`${this.apiUrl}/notebook/${id}`);
  }

  // Create a new notebook
  createNotebook(notebook: CreateNotebookRequest): Observable<Notebook> {
    return this.http.post<Notebook>(`${this.apiUrl}/notebook`, notebook);
  }

  // Update an existing notebook
  updateNotebook(id: number, notebook: UpdateNotebookRequest): Observable<Notebook> {
    return this.http.put<Notebook>(`${this.apiUrl}/notebook/${id}`, notebook);
  }

  // Delete a notebook
  deleteNotebook(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notebook/${id}`);
  }

  // Search notebooks by title
  searchNotebooks(query: string): Observable<Notebook[]> {
    return this.http.get<Notebook[]>(`${this.apiUrl}/notebook/search/${encodeURIComponent(query)}`);
  }
} 