import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NotebookService, Notebook } from '../../services/notebook.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  notebooks: Notebook[] = [];
  loading = true;
  showEditor = false;
  editingNotebook: Notebook | undefined = undefined;
  searchQuery = '';

  constructor(
    private authService: AuthService,
    private notebookService: NotebookService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.authService.getProfile().subscribe({
        next: (user) => {
          this.currentUser = user;
          this.loadNotebooks();
        },
        error: () => {
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.loadNotebooks();
    }
  }

  loadNotebooks() {
    this.loading = true;
    this.notebookService.getNotebooks().subscribe({
      next: (notebooks) => {
        this.notebooks = notebooks;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load notebooks:', error);
        this.loading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  createNotebook() {
    this.editingNotebook = undefined;
    this.showEditor = true;
  }

  editNotebook(notebook: Notebook) {
    this.editingNotebook = notebook;
    this.showEditor = true;
  }

  deleteNotebook(notebook: Notebook) {
    if (confirm(`Are you sure you want to delete "${notebook.title}"?`)) {
      this.notebookService.deleteNotebook(notebook.id).subscribe({
        next: () => {
          this.notebooks = this.notebooks.filter(n => n.id !== notebook.id);
        },
        error: (error) => {
          console.error('Failed to delete notebook:', error);
          alert('Failed to delete notebook');
        }
      });
    }
  }

  onNotebookSaved(notebook: Notebook) {
    this.showEditor = false;
    this.editingNotebook = undefined;
    
    // Update the notebooks list
    const index = this.notebooks.findIndex(n => n.id === notebook.id);
    if (index !== -1) {
      this.notebooks[index] = notebook;
    } else {
      this.notebooks.unshift(notebook); // Add new notebook at the beginning
    }
  }

  onEditorCancelled() {
    this.showEditor = false;
    this.editingNotebook = undefined;
  }

  searchNotebooks() {
    if (this.searchQuery.trim()) {
      this.notebookService.searchNotebooks(this.searchQuery).subscribe({
        next: (notebooks) => {
          this.notebooks = notebooks;
        },
        error: (error) => {
          console.error('Search failed:', error);
        }
      });
    } else {
      this.loadNotebooks();
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.loadNotebooks();
  }
} 