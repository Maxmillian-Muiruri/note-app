import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotebookService, Notebook, CreateNotebookRequest, UpdateNotebookRequest } from '../../services/notebook.service';

@Component({
  selector: 'app-notebook-editor',
  templateUrl: './notebook-editor.component.html',
  styleUrls: ['./notebook-editor.component.css']
})
export class NotebookEditorComponent implements OnInit {
  @Input() notebook?: Notebook;
  @Input() isEditing = false;
  @Output() saved = new EventEmitter<Notebook>();
  @Output() cancelled = new EventEmitter<void>();

  notebookForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private notebookService: NotebookService
  ) {
    this.notebookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      content: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.notebook && this.isEditing) {
      this.notebookForm.patchValue({
        title: this.notebook.title,
        content: this.notebook.content
      });
    }
  }

  onSubmit() {
    if (this.notebookForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const formData = this.notebookForm.value;

      if (this.isEditing && this.notebook) {
        // Update existing notebook
        const updateData: UpdateNotebookRequest = {
          title: formData.title,
          content: formData.content
        };

        this.notebookService
          .updateNotebook(this.notebook.id, updateData)
          .subscribe({
          next: (updatedNotebook) => {
            this.loading = false;
            this.saved.emit(updatedNotebook);
          },
          error: (error) => {
            this.loading = false;
              this.errorMessage =
                error.error?.message || 'Failed to update notebook';
          }
        });
      } else {
        // Create new notebook
        const createData: CreateNotebookRequest = {
          title: formData.title,
          content: formData.content
        };

        this.notebookService.createNotebook(createData).subscribe({
          next: (newNotebook) => {
            this.loading = false;
            this.saved.emit(newNotebook);
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = error.error?.message || 'Failed to create notebook';
          }
        });
      }
    }
  }

  onCancel() {
    this.cancelled.emit();
  }

  getTitle() {
    return this.isEditing ? 'Edit Notebook' : 'Create New Notebook';
  }

  getSubmitButtonText() {
    return this.loading
      ? (this.isEditing ? 'Updating...' : 'Creating...')
      : (this.isEditing ? 'Update Notebook' : 'Create Notebook');
  }
}
