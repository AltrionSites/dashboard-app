import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { News } from '../../interfaces/news';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewsService } from '../../services/news.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.scss']
})
export class ModalFormComponent implements OnInit {
  @Input() newsToEdit!: News;
  @Output() onSubmit:EventEmitter<News> = new EventEmitter();

  modalTitle!:string;
  modalBtnTitle!:string;
  loading: boolean = false;
  unknowError: boolean = false;

  newsForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private newsService: NewsService,
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    if(this.newsToEdit) {

    } else {
      this.modalTitle = 'Nueva noticia';
      this.modalBtnTitle = 'Crear';
      this.newsForm = this.fb.group({
        'title': ["", [Validators.required, Validators.maxLength(100)]],
        'content': ["", Validators.required],
        'link': ["", Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')],
        'image': [null, ],
        'visible': ["1", Validators.nullValidator]
      });
    }
  }

  onFileChange(event:any) {
    if(event.target.files.length>0){
      const image = event.target.files[0];
      this.newsForm.patchValue({image: image});
    }
  }

  save(){
    if(this.newsForm.valid) {
      this.loading = true;
      this.unknowError = false;

      const { title, content, visible } = this.newsForm.value;
      const formData = new FormData();

      formData.append('title', title);
      formData.append('content', content);
      formData.append('link', this.newsForm.get('link')?.value);
      formData.append('visible', visible);
      formData.append('image', this.newsForm.get('image')?.value);
      
      if(this.newsToEdit) {
        return;
      } else {
        this.newsService.storeNews(formData).subscribe({
          next: (res: News) => {
            this.onSubmit.emit(res);
            this.unknowError = false;
            this.closeModal();
          },
          error: (err: HttpErrorResponse) => {
            this.loading = false;
            this.unknowError = true;
            console.log(err);
          }
        });
      }
    }
  }
  closeModal(){
    this.activeModal.close();
  }
}
