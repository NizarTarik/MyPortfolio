import {
  Component,
  HostListener,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface AlbumPhoto {
  src: string;
  alt: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

  isAlbumOpen = false;
  selectedPhotoIndex = 0;

  photos: AlbumPhoto[] = [

    {
      src: 'assets/img/album/proxisoft.jpg',
      alt: 'Nizar Tarik during his first internship',
      description: 'My First Internship in an IT Company'
    },
    {
      src: 'assets/img/album/ista.jpg',
      alt: 'Nizar Tarik celebrating his bachelor degree',
      description: 'Achieving Our Bachelor’s Degree'
    }, {
      src: 'assets/img/album/B2Enh.png',
      alt: 'Nizar Tarik celebrating his B2 German language exam',
      description: 'Celebrating My Success in the B2 German Language Exam'
    },
    {
      src: 'assets/img/album/startup.jpe',
      alt: 'Nizar Tarik with his college friend',
      description: 'My Startup Journey with My College Friend 😊'
    }
  ];

  openAlbum(): void {
    this.isAlbumOpen = true;
    this.selectedPhotoIndex = 0;
    document.body.style.overflow = 'hidden';
  }

  closeAlbum(): void {
    this.isAlbumOpen = false;
    document.body.style.overflow = '';
  }

  selectPhoto(index: number): void {
    if (index < 0 || index >= this.photos.length) {
      return;
    }

    this.selectedPhotoIndex = index;
  }

  nextPhoto(): void {
    if (!this.photos.length) {
      return;
    }

    this.selectedPhotoIndex =
      (this.selectedPhotoIndex + 1) % this.photos.length;
  }

  previousPhoto(): void {
    if (!this.photos.length) {
      return;
    }

    this.selectedPhotoIndex =
      (this.selectedPhotoIndex - 1 + this.photos.length) %
      this.photos.length;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (!this.isAlbumOpen) {
      return;
    }

    switch (event.key) {
      case 'Escape':
        this.closeAlbum();
        break;

      case 'ArrowRight':
        this.nextPhoto();
        break;

      case 'ArrowLeft':
        this.previousPhoto();
        break;
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }
}
