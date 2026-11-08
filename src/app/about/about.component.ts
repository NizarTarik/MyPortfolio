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
      alt: 'Nizar Tarik during his first professional IT internship',
      description: 'Where it all started! Taking my very first steps into the professional IT world 🚀'
    },
    {
      src: 'assets/img/album/ista.jpg',
      alt: 'Nizar Tarik celebrating his bachelor degree',
      description: 'We finally did it! Celebrating the culmination of hard work and late-night study sessions 🎓'
    },
    {
      src: 'assets/img/album/ehrenamt.jpeg',
      alt: 'Nizar Tarik actively participating in Red Crescent volunteer work',
      description: 'Giving back and learning what community really means with the Red Crescent 🤝❤️'
    },
    {
      src: 'assets/img/album/startup.jpe',
      alt: 'Nizar Tarik working with his college friend',
      description: 'Building dreams, sharing laughs, and tackling challenges with my college bestie along our startup path ✨'
    },
    {
      src: 'assets/img/album/B2Enh.png',
      alt: 'Nizar Tarik celebrating his B2 German language exam success',
      description: 'All those vocabulary lists and grammar practice sessions finally paid off! B2 German unlocked 🎉'
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
