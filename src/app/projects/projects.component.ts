import {
  Component,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

interface Project {
  id: number;
  title: string;
  description: string;

  // ============================================================
  // LAPTOP PREVIEW IMAGES
  // ============================================================
  previewPc: string[];

  // ============================================================
  // PHONE PREVIEW IMAGES
  // ============================================================
  previewPhone: string[];

  // ============================================================
  // FULLSCREEN POPUP IMAGES
  // ============================================================
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
export class ProjectsComponent implements OnInit, OnDestroy {

  // ============================================================
  // PROJECT DATA
  // ============================================================

  projects: Project[] = [

    // ============================================================
    // PROJECT 1 — MOROCCAN RESTAURANT
    // ============================================================

    {
      id: 1,

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
    },

    // ============================================================
    // PROJECT 2 — INSURANCE CRM
    // ============================================================

    {
      id: 2,

      title: 'Insurance CRM',

      year: '2026',

      description:
        'A insurance management platform designed to centralize customer data, policies, claims and business workflows in one professional interface.',

      // ----------------------------------------------------------
      // LAPTOP PREVIEWS
      // ----------------------------------------------------------

      previewPc: [
        'assets/img/projects/insuranceCRM/dashboard.png',
        'assets/img/projects/insuranceCRM/clients.png',
        'assets/img/projects/insuranceCRM/policies.png'
      ],

      // ----------------------------------------------------------
      // PHONE PREVIEWS
      // ----------------------------------------------------------

      previewPhone: [
        'assets/img/projects/insuranceCRM/dashboardPhone.png',
        'assets/img/projects/insuranceCRM/clientsPhone.png'
      ],

      // ----------------------------------------------------------
      // FULLSCREEN POPUP IMAGES
      // ----------------------------------------------------------

      images: [
        'assets/img/projects/insuranceCRM/dashboard.png',
        'assets/img/projects/insuranceCRM/clients.png',
        'assets/img/projects/insuranceCRM/policies.png',
        'assets/img/projects/insuranceCRM/claims.png'
      ],

      technologies: [
        'Angular',
        'Spring Boot',
        'PostgreSQL',
        'REST API',
        'AI'
      ],

      link: 'https://github.com/NizarTarik/InsuranceCRM'
    },


    // ============================================================
    // PROJECT 3 — TRADING JOURNAL
    // ============================================================

    {
      id: 3,

      title: 'Trading Journal',

      year: '2026',

      description:
        'A trading journal for recording, reviewing and analyzing trades, with performance metrics, detailed statistics and visual insights to help traders understand and improve their strategies.',

      // ----------------------------------------------------------
      // LAPTOP PREVIEWS
      // ----------------------------------------------------------

      previewPc: [
        'assets/img/projects/tradingjournal/dashboardPC.png',
        'assets/img/projects/tradingjournal/listpc.png',
        'assets/img/projects/tradingjournal/placetradePc.png'
      ],

      // ----------------------------------------------------------
      // PHONE PREVIEWS
      // ----------------------------------------------------------

      previewPhone: [
        'assets/img/projects/tradingjournal/dashboardPHONE.png'
      ],

      // ----------------------------------------------------------
      // FULLSCREEN POPUP IMAGES
      // ----------------------------------------------------------

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
        'CSS',
      ],

      link: 'https://github.com/NizarTarik/TradingJournal'
    },


    // ============================================================
    // PROJECT 4 — INSURANCE AI AGENT
    // ============================================================

    {
      id: 4,

      title: 'Insurance AI Agent',

      year: '2026',

      description:
        'AI-powered insurance agent that detects customer needs, identifies the right insurance service, and automatically notifies the support team for fast follow-up via email and WhatsApp.',

      // ----------------------------------------------------------
      // LAPTOP PREVIEWS
      // ----------------------------------------------------------

      previewPc: [
        'assets/img/projects/AiInsuranceAgent/img1.png',
        'assets/img/projects/AiInsuranceAgent/summary.png'
      ],

      // ----------------------------------------------------------
      // PHONE PREVIEWS
      // ----------------------------------------------------------

      previewPhone: [
        'assets/img/projects/AiInsuranceAgent/img1Phone.png'
      ],

      // ----------------------------------------------------------
      // FULLSCREEN POPUP IMAGES
      // ----------------------------------------------------------

      images: [
        'assets/img/projects/AiInsuranceAgent/img1.png',
        'assets/img/projects/AiInsuranceAgent/summary.png',
        'assets/img/projects/AiInsuranceAgent/workflow.png'
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
    }

  ];


  // ============================================================
  // PROJECT STATE
  // ============================================================

  activeProjectIndex = 0;


  // ============================================================
  // SHARED IMAGE INDEX
  //
  // This controls:
  // - Laptop preview
  // - Phone preview
  // - Fullscreen popup
  //
  // Each image button changes all three together.
  // ============================================================

  activeImageIndex = 0;


  // ============================================================
  // LAPTOP PREVIEW INDEX
  // ============================================================

  activePreviewPcIndex = 0;


  // ============================================================
  // PHONE PREVIEW INDEX
  // ============================================================

  activePreviewPhoneIndex = 0;


  // ============================================================
  // AUTO SLIDER
  // ============================================================

  private autoSlideTimer?: ReturnType<typeof setInterval>;


  // ============================================================
  // IMAGE MODAL
  // ============================================================

  isImageModalOpen = false;

  modalImageUrl = '';


  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    this.startAutoSlide();
  }


  ngOnDestroy(): void {

    this.stopAutoSlide();

    document.body.classList.remove(
      'image-modal-open'
    );
  }


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

    if (this.isImageModalOpen) {
      this.modalPreviousImage();
    }
  }


  // ============================================================
  // ARROW RIGHT
  // ============================================================

  @HostListener('document:keydown.arrowright')
  handleArrowRight(): void {

    if (this.isImageModalOpen) {
      this.modalNextImage();
    }
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
  //
  // Changes:
  // 1. Popup image
  // 2. Laptop image
  // 3. Phone image
  //
  // They all move together when possible.
  // ============================================================

  nextImage(): void {

    // ----------------------------------------------------------
    // POPUP
    // ----------------------------------------------------------

    if (this.activeProject.images.length) {

      this.activeImageIndex =
        (this.activeImageIndex + 1) %
        this.activeProject.images.length;
    }


    // ----------------------------------------------------------
    // LAPTOP
    // ----------------------------------------------------------

    if (this.activeProject.previewPc.length) {

      this.activePreviewPcIndex =
        (this.activePreviewPcIndex + 1) %
        this.activeProject.previewPc.length;
    }


    // ----------------------------------------------------------
    // PHONE
    // ----------------------------------------------------------

    if (this.activeProject.previewPhone.length) {

      this.activePreviewPhoneIndex =
        (this.activePreviewPhoneIndex + 1) %
        this.activeProject.previewPhone.length;
    }


    this.restartAutoSlide();
  }


  // ============================================================
  // PREVIOUS IMAGE
  // ============================================================

  previousImage(): void {

    // ----------------------------------------------------------
    // POPUP
    // ----------------------------------------------------------

    if (this.activeProject.images.length) {

      this.activeImageIndex =
        this.activeImageIndex === 0
          ? this.activeProject.images.length - 1
          : this.activeImageIndex - 1;
    }


    // ----------------------------------------------------------
    // LAPTOP
    // ----------------------------------------------------------

    if (this.activeProject.previewPc.length) {

      this.activePreviewPcIndex =
        this.activePreviewPcIndex === 0
          ? this.activeProject.previewPc.length - 1
          : this.activePreviewPcIndex - 1;
    }


    // ----------------------------------------------------------
    // PHONE
    // ----------------------------------------------------------

    if (this.activeProject.previewPhone.length) {

      this.activePreviewPhoneIndex =
        this.activePreviewPhoneIndex === 0
          ? this.activeProject.previewPhone.length - 1
          : this.activePreviewPhoneIndex - 1;
    }


    this.restartAutoSlide();
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

    this.restartAutoSlide();
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

    this.restartAutoSlide();
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

    this.restartAutoSlide();
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

    this.restartAutoSlide();
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

    this.stopAutoSlide();
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

    this.startAutoSlide();
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


  // ============================================================
  // START AUTO SLIDER
  //
  // Every 5 seconds:
  // - Laptop changes
  // - Phone changes
  // - Popup index changes
  // ============================================================

  private startAutoSlide(): void {

    this.stopAutoSlide();

    this.autoSlideTimer = setInterval(() => {

      if (!this.isImageModalOpen) {

        this.nextImage();
      }

    }, 5000);
  }


  // ============================================================
  // RESTART AUTO SLIDER
  // ============================================================

  private restartAutoSlide(): void {

    this.startAutoSlide();
  }


  // ============================================================
  // STOP AUTO SLIDER
  // ============================================================

  private stopAutoSlide(): void {

    if (this.autoSlideTimer) {

      clearInterval(
        this.autoSlideTimer
      );

      this.autoSlideTimer = undefined;
    }
  }

}
