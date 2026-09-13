import {
  Component,
  ViewChild,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

interface AboutHighlight {
  value: string;
  label: string;
}

interface AboutImage {
  url: string;
  alt: string;
  caption: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

  @ViewChild('videoPlayer')
  videoPlayer!: ElementRef<HTMLVideoElement>;

  activeImageIndex = 0;

  isVideoOpen = false;

  images: AboutImage[] = [
    {
      url: '/assets/img/nizar.png',
      alt: 'Developer workspace',
      caption: ' 21 '
    },
    {
      url: '/assets/img/qss.jpg',
      alt: 'Know me video',
      caption: 'KNOW ME'
    }
  ];

  highlights: AboutHighlight[] = [
    {
      value: '2+',
      label: 'YEARS EXPERIENCE'
    },
    {
      value: 'Bachelor’s',
      label: 'COMPUTER SYSTEMS ENGINEERING'
    },
    {
      value: 'Diploma',
      label: 'FULL-STACK WEB DEVELOPMENT'
    }
  ];

  get activeImage(): AboutImage {
    return this.images[this.activeImageIndex];
  }

  nextImage(): void {
    this.activeImageIndex =
      (this.activeImageIndex + 1) % this.images.length;
  }

  previousImage(): void {
    this.activeImageIndex =
      this.activeImageIndex === 0
        ? this.images.length - 1
        : this.activeImageIndex - 1;
  }

  selectImage(index: number): void {
    this.activeImageIndex = index;
  }

  onImageClick(event: MouseEvent): void {
    event.stopPropagation();

    if (this.activeImageIndex !== 1) {
      return;
    }

    this.isVideoOpen = true;

    setTimeout(() => {
      const videoElement = this.videoPlayer?.nativeElement;

      if (!videoElement) {
        return;
      }

      videoElement.load();

      videoElement.play().catch(error => {
        console.error(
          'Auto-play prevented by browser:',
          error
        );
      });
    }, 50);
  }

  closeVideoOverlay(): void {
    const videoElement = this.videoPlayer?.nativeElement;

    if (videoElement) {
      videoElement.pause();
    }

    this.isVideoOpen = false;
  }
}
