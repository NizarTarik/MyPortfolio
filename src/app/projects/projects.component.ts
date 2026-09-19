import {
  Component,
  HostListener
} from '@angular/core';

import { CommonModule } from '@angular/common';

interface Project {
  id: number;
  title: string;
  description: string;
  previewPc: string[];
  previewPhone: string[];
  images: string[];
  technologies: string[];
  year: string;
  link?: string;
  documentationLink?: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {

  // ============================================================
  // PROJECT DATA
  // ============================================================

  projects: Project[] = [

    // ============================================================
    // PROJECT 1 — INSURANCE CRM
    // ============================================================

    {
      id: 1,
      title: 'CRM Application',
      year: '2026',
      description:
        'An insurance management platform designed to centralize customer data, policies, claims and business workflows in one professional interface.',

      previewPc: [
        'assets/img/projects/CRMInsurance/dashboard.png',
        'assets/img/projects/CRMInsurance/prospect.png',
        'assets/img/projects/CRMInsurance/demandes.png',
        'assets/img/projects/CRMInsurance/users.png'
      ],

      previewPhone: [
        'assets/img/projects/CRMInsurance/dashboard.png',
        'assets/img/projects/CRMInsurance/notification.png'
      ],

      images: [
        'assets/img/projects/CRMInsurance/dashboard.png',
        'assets/img/projects/CRMInsurance/users.png',
        'assets/img/projects/CRMInsurance/prospect.png',
        'assets/img/projects/CRMInsurance/encaisser.png',
        'assets/img/projects/CRMInsurance/agenda.png',
        'assets/img/projects/CRMInsurance/notification.png',
        'assets/img/projects/CRMInsurance/adddemande.png',
        'assets/img/projects/CRMInsurance/demandes.png',
        'assets/img/projects/CRMInsurance/cabinet.png'
      ],

      technologies: [
        'Angular',
        'TypeScript',
        'Spring Boot',
        'PostgreSQL',
        'REST API',
        'AI',
        'Elasticsearch'
      ],

      link:
        'https://github.com/NizarTarik/CRM-Application'
    },


    // ============================================================
    // PROJECT 2 — TRADING JOURNAL
    // ============================================================

    {
      id: 2,
      title: 'Trading Journal',
      year: '2026',
      description:
        'A trading journal for recording, reviewing and analyzing trades, with performance metrics, detailed statistics and visual insights to help traders understand and improve their strategies.',

      previewPc: [
        'assets/img/projects/tradingjournal/dashboardPC.png',
        'assets/img/projects/tradingjournal/listpc.png',
        'assets/img/projects/tradingjournal/placetradePc.png'
      ],

      previewPhone: [
        'assets/img/projects/tradingjournal/dashboardPHONE.png'
      ],

      images: [
        'assets/img/projects/tradingjournal/dashboardPC.png',
        'assets/img/projects/tradingjournal/listpc.png',
        'assets/img/projects/tradingjournal/placetradePc.png'
      ],

      technologies: [
        'Angular',
        'Spring Boot',
        'PostgreSQL',
        'TypeScript',
        'HTML',
        'CSS'
      ],

      link:
        'https://github.com/NizarTarik/TradingJournal'
    },


    // ============================================================
    // PROJECT 3 — INSURANCE AI AGENT
    // ============================================================

    {
      id: 3,
      title: 'Insurance AI Agent',
      year: '2026',
      description:
        'AI-powered insurance agent that detects customer needs, identifies the right insurance service, and automatically notifies the support team for fast follow-up via email and WhatsApp.',

      previewPc: [
        'assets/img/projects/AiInsuranceAgent/img1.png',
        'assets/img/projects/AiInsuranceAgent/summary.png'
      ],

      previewPhone: [
        'assets/img/projects/AiInsuranceAgent/img1Phone.png'
      ],

      images: [
        'assets/img/projects/AiInsuranceAgent/img1.png',
        'assets/img/projects/AiInsuranceAgent/chat.png',
        'assets/img/projects/AiInsuranceAgent/summary.png'
      ],

      technologies: [
        'Angular',
        'Spring Boot',
        'PostgreSQL',
        'TypeScript',
        'HTML',
        'CSS',
        'Gemini API'
      ],

      link:
        'https://github.com/NizarTarik/Insurance-AI-Agent'
    },


    // ============================================================
    // PROJECT 4 — MOROCCAN RESTAURANT
    // ============================================================

    {
      id: 4,
      title: 'Moroccan Restaurant',
      year: '2026',
      description:
        'A website showcasing Moroccan cuisine, with an admin dashboard for managing users, profiles, dishes, discounts, and reviews.',

      previewPc: [
        'assets/img/projects/restaurant/img2.png',
        'assets/img/projects/restaurant/img1.png'
      ],

      previewPhone: [
        'assets/img/projects/restaurant/img2phone.png',
        'assets/img/projects/restaurant/img1phone.png'
      ],

      images: [
        'assets/img/projects/restaurant/img2.png',
        'assets/img/projects/restaurant/img1.png'
      ],

      technologies: [
        'PHP',
        'Symfony',
        'MySQL',
        'HTML',
        'CSS',
        'JavaScript',
        'Bootstrap'
      ],

      link:
        'https://github.com/NizarTarik/Moroccan-restaurant.git',

      documentationLink:
        'https://nizartarik.github.io/Portfolio/projects/Marokkanisches%20Restaurant.pdf'
    }
  ];


  // ============================================================
  // PROJECT STATE
  // ============================================================

  activeProjectIndex = 0;

  activeImageIndex = 0;

  activePreviewPcIndex = 0;

  activePreviewPhoneIndex = 0;


  // ============================================================
  // IMAGE MODAL
  // ============================================================

  isImageModalOpen = false;

  modalImageUrl = '';


  // ============================================================
  // ESCAPE KEY
  // ============================================================

  @HostListener('document:keydown.escape')
  handleEscape(): void {

    if (this.isImageModalOpen) {
      this.closeImageModal();
    }
  }


  // ============================================================
  // ARROW LEFT
  // ============================================================

  @HostListener('document:keydown.arrowleft')
  handleArrowLeft(): void {

    /*
     * When the image modal is open,
     * arrows control images.
     */
    if (this.isImageModalOpen) {
      this.modalPreviousImage();
      return;
    }

    /*
     * Otherwise arrows control projects.
     */
    this.previousProject();
  }


  // ============================================================
  // ARROW RIGHT
  // ============================================================

  @HostListener('document:keydown.arrowright')
  handleArrowRight(): void {

    /*
     * When the image modal is open,
     * arrows control images.
     */
    if (this.isImageModalOpen) {
      this.modalNextImage();
      return;
    }

    /*
     * Otherwise arrows control projects.
     */
    this.nextProject();
  }


  // ============================================================
  // ACTIVE PROJECT
  // ============================================================

  get activeProject(): Project {
    return this.projects[this.activeProjectIndex];
  }


  // ============================================================
  // ACTIVE LAPTOP IMAGE
  // ============================================================

  get activePreviewPc(): string {

    if (!this.activeProject.previewPc.length) {
      return '';
    }

    return this.activeProject.previewPc[
      this.activePreviewPcIndex %
      this.activeProject.previewPc.length
    ];
  }


  // ============================================================
  // ACTIVE PHONE IMAGE
  // ============================================================

  get activePreviewPhone(): string {

    if (!this.activeProject.previewPhone.length) {
      return '';
    }

    return this.activeProject.previewPhone[
      this.activePreviewPhoneIndex %
      this.activeProject.previewPhone.length
    ];
  }


  // ============================================================
  // ACTIVE POPUP IMAGE
  // ============================================================

  get activeImage(): string {

    if (!this.activeProject.images.length) {
      return '';
    }

    return this.activeProject.images[
      this.activeImageIndex %
      this.activeProject.images.length
    ];
  }


  // ============================================================
  // NEXT IMAGE
  // ============================================================

  nextImage(): void {

    if (this.activeProject.images.length) {

      this.activeImageIndex =
        (this.activeImageIndex + 1) %
        this.activeProject.images.length;
    }

    if (this.activeProject.previewPc.length) {

      this.activePreviewPcIndex =
        (this.activePreviewPcIndex + 1) %
        this.activeProject.previewPc.length;
    }

    if (this.activeProject.previewPhone.length) {

      this.activePreviewPhoneIndex =
        (this.activePreviewPhoneIndex + 1) %
        this.activeProject.previewPhone.length;
    }
  }


  // ============================================================
  // PREVIOUS IMAGE
  // ============================================================

  previousImage(): void {

    if (this.activeProject.images.length) {

      this.activeImageIndex =
        this.activeImageIndex === 0
          ? this.activeProject.images.length - 1
          : this.activeImageIndex - 1;
    }

    if (this.activeProject.previewPc.length) {

      this.activePreviewPcIndex =
        this.activePreviewPcIndex === 0
          ? this.activeProject.previewPc.length - 1
          : this.activePreviewPcIndex - 1;
    }

    if (this.activeProject.previewPhone.length) {

      this.activePreviewPhoneIndex =
        this.activePreviewPhoneIndex === 0
          ? this.activeProject.previewPhone.length - 1
          : this.activePreviewPhoneIndex - 1;
    }
  }


  // ============================================================
  // SELECT POPUP IMAGE
  // ============================================================

  selectImage(index: number): void {

    if (
      index < 0 ||
      index >= this.activeProject.images.length
    ) {
      return;
    }

    this.activeImageIndex = index;
  }


  // ============================================================
  // NEXT LAPTOP PREVIEW
  // ============================================================

  nextPreviewPc(): void {

    if (!this.activeProject.previewPc.length) {
      return;
    }

    this.activePreviewPcIndex =
      (this.activePreviewPcIndex + 1) %
      this.activeProject.previewPc.length;
  }


  // ============================================================
  // PREVIOUS LAPTOP PREVIEW
  // ============================================================

  previousPreviewPc(): void {

    if (!this.activeProject.previewPc.length) {
      return;
    }

    this.activePreviewPcIndex =
      this.activePreviewPcIndex === 0
        ? this.activeProject.previewPc.length - 1
        : this.activePreviewPcIndex - 1;
  }


  // ============================================================
  // NEXT PHONE PREVIEW
  // ============================================================

  nextPreviewPhone(): void {

    if (!this.activeProject.previewPhone.length) {
      return;
    }

    this.activePreviewPhoneIndex =
      (this.activePreviewPhoneIndex + 1) %
      this.activeProject.previewPhone.length;
  }


  // ============================================================
  // PREVIOUS PHONE PREVIEW
  // ============================================================

  previousPreviewPhone(): void {

    if (!this.activeProject.previewPhone.length) {
      return;
    }

    this.activePreviewPhoneIndex =
      this.activePreviewPhoneIndex === 0
        ? this.activeProject.previewPhone.length - 1
        : this.activePreviewPhoneIndex - 1;
  }


  // ============================================================
  // NEXT PROJECT
  // ============================================================

  nextProject(): void {

    this.activeProjectIndex =
      (this.activeProjectIndex + 1) %
      this.projects.length;

    this.resetImageIndexes();
  }


  // ============================================================
  // PREVIOUS PROJECT
  // ============================================================

  previousProject(): void {

    this.activeProjectIndex =
      this.activeProjectIndex === 0
        ? this.projects.length - 1
        : this.activeProjectIndex - 1;

    this.resetImageIndexes();
  }


  // ============================================================
  // SELECT PROJECT
  // ============================================================

  selectProject(index: number): void {

    if (
      index < 0 ||
      index >= this.projects.length
    ) {
      return;
    }

    this.activeProjectIndex = index;

    this.resetImageIndexes();
  }


  // ============================================================
  // RESET IMAGE INDEXES
  // ============================================================

  private resetImageIndexes(): void {

    this.activeImageIndex = 0;

    this.activePreviewPcIndex = 0;

    this.activePreviewPhoneIndex = 0;
  }


  // ============================================================
  // OPEN IMAGE MODAL
  // ============================================================

  openImageModal(): void {

    if (!this.activeProject.images.length) {
      return;
    }

    this.modalImageUrl =
      this.activeProject.images[
      this.activeImageIndex %
      this.activeProject.images.length
      ];

    this.isImageModalOpen = true;

    document.body.classList.add(
      'image-modal-open'
    );
  }


  // ============================================================
  // CLOSE IMAGE MODAL
  // ============================================================

  closeImageModal(): void {

    this.isImageModalOpen = false;

    this.modalImageUrl = '';

    document.body.classList.remove(
      'image-modal-open'
    );
  }


  // ============================================================
  // MODAL — NEXT
  // ============================================================

  modalNextImage(): void {

    if (!this.activeProject.images.length) {
      return;
    }

    this.activeImageIndex =
      (this.activeImageIndex + 1) %
      this.activeProject.images.length;

    this.updateModalImage();
  }


  // ============================================================
  // MODAL — PREVIOUS
  // ============================================================

  modalPreviousImage(): void {

    if (!this.activeProject.images.length) {
      return;
    }

    this.activeImageIndex =
      this.activeImageIndex === 0
        ? this.activeProject.images.length - 1
        : this.activeImageIndex - 1;

    this.updateModalImage();
  }


  // ============================================================
  // UPDATE MODAL IMAGE
  // ============================================================

  private updateModalImage(): void {

    this.modalImageUrl =
      this.activeProject.images[
      this.activeImageIndex %
      this.activeProject.images.length
      ];
  }
}
