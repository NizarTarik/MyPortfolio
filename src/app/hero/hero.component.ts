import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { AboutComponent } from '../about/about.component';
import { ProjectsComponent } from '../projects/projects.component';
import { TechsComponent } from '../techs/techs.component';


interface Station {
  id: string;
  number: string;
  title: string;
}


interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}


@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    CommonModule,
    AboutComponent,
    ProjectsComponent,
    TechsComponent
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})


export class HeroComponent
  implements OnInit, AfterViewInit, OnDestroy {


  // =========================================================
  // THEME
  // =========================================================

  theme: 'dark' | 'light' = 'light';


  // =========================================================
  // JOURNEY STATIONS
  // =========================================================

  stations: Station[] = [

    {
      id: 'about',
      number: '01',
      title: 'ABOUT'
    },

    {
      id: 'projects',
      number: '02',
      title: 'PROJECTS'
    },

    {
      id: 'technologies',
      number: '03',
      title: 'TECHNOLOGIES'
    }

  ];


  // =========================================================
  // ACTIVE STATION
  // =========================================================

  activeStationIndex = 0;

  previousStationIndex = 0;


  // =========================================================
  // PARTICLES
  // =========================================================

  particles: Particle[] = Array.from(
    { length: 55 },
    () => ({

      x: Math.random() * 100,

      y: Math.random() * 100,

      size: Math.random() * 2.5 + 1,

      opacity: Math.random() * 0.35 + 0.08,

      duration: Math.random() * 10 + 10,

      delay: Math.random() * -15

    })
  );


  // =========================================================
  // TRANSITION
  // =========================================================

  private isTransitioning = false;

  private transitionTimer?:
    ReturnType<typeof setTimeout>;


  // =========================================================
  // CREATURE / ROPE
  // =========================================================

  get ropeHeight(): number {

    const minHeight = 80;

    const maxHeight = 280;

    const progress =
      this.progressPercent / 100;

    return (
      minHeight +
      (maxHeight - minHeight) * progress
    );
  }


  getCreatureTransform(): string {

    const progress =
      this.progressPercent / 100;

    const y =
      progress * -70;

    const direction =
      this.activeStationIndex >
        this.previousStationIndex
        ? -1
        : 1;

    const lean =
      this.activeStationIndex ===
        this.previousStationIndex
        ? 0
        : direction * 4;

    return `
      translate3d(0, ${y}px, 0)
      rotate(${lean}deg)
    `;
  }


  // =========================================================
  // LIFECYCLE
  // =========================================================

  ngOnInit(): void {

    this.loadTheme();

  }


  ngAfterViewInit(): void {

    this.loadTheme();

  }


  ngOnDestroy(): void {

    if (this.transitionTimer) {

      clearTimeout(
        this.transitionTimer
      );

    }

  }


  // =========================================================
  // ACTIVE STATION
  // =========================================================

  get activeStation(): Station {

    return this.stations[
      this.activeStationIndex
    ];

  }


  // =========================================================
  // PROGRESS
  // =========================================================

  get progressPercent(): number {

    if (this.stations.length <= 1) {

      return 100;

    }

    return (

      this.activeStationIndex /
      (this.stations.length - 1)

    ) * 100;

  }


  // =========================================================
  // THEME
  // =========================================================

  toggleTheme(): void {

    this.theme =
      this.theme === 'dark'
        ? 'light'
        : 'dark';

    localStorage.setItem(
      'portfolio-theme',
      this.theme
    );

  }


  private loadTheme(): void {

    const saved =
      localStorage.getItem(
        'portfolio-theme'
      );

    if (
      saved === 'dark' ||
      saved === 'light'
    ) {

      this.theme = saved;

      return;

    }

    this.theme = 'light';

  }


  // =========================================================
  // MOUSE WHEEL
  // =========================================================

  @HostListener(
    'window:wheel',
    ['$event']
  )
  onWheel(event: WheelEvent): void {

    if (
      Math.abs(event.deltaY) < 10
    ) {

      return;

    }

    event.preventDefault();

    if (this.isTransitioning) {

      return;

    }

    if (event.deltaY > 0) {

      this.nextStation();

    } else {

      this.previousStation();

    }

  }


  // =========================================================
  // KEYBOARD
  // =========================================================

  @HostListener(
    'window:keydown',
    ['$event']
  )
  onKeyDown(event: KeyboardEvent): void {

    const target =
      event.target as HTMLElement | null;


    // Do not navigate while typing

    if (
      target?.tagName === 'INPUT' ||
      target?.tagName === 'TEXTAREA' ||
      target?.isContentEditable
    ) {

      return;

    }


    switch (event.key) {


      // =====================================================
      // NEXT STATION
      // ArrowDown + ArrowRight
      // =====================================================

      case 'ArrowDown':
      case 'ArrowRight':
      case 'PageDown':
      case ' ':

        event.preventDefault();

        this.nextStation();

        break;


      // =====================================================
      // PREVIOUS STATION
      // ArrowUp + ArrowLeft
      // =====================================================

      case 'ArrowUp':
      case 'ArrowLeft':
      case 'PageUp':

        event.preventDefault();

        this.previousStation();

        break;


      // =====================================================
      // FIRST STATION
      // =====================================================

      case 'Home':

        event.preventDefault();

        this.goToStation(0);

        break;


      // =====================================================
      // LAST STATION
      // =====================================================

      case 'End':

        event.preventDefault();

        this.goToStation(
          this.stations.length - 1
        );

        break;


      // =====================================================
      // STATION 01
      // =====================================================

      case '1':

        this.goToStation(0);

        break;


      // =====================================================
      // STATION 02
      // =====================================================

      case '2':

        if (
          this.stations.length > 1
        ) {

          this.goToStation(1);

        }

        break;


      // =====================================================
      // STATION 03
      // =====================================================

      case '3':

        if (
          this.stations.length > 2
        ) {

          this.goToStation(2);

        }

        break;

    }

  }


  // =========================================================
  // SIDEBAR / NAVIGATION EVENT
  // =========================================================

  @HostListener(
    'window:portfolioStationChange',
    ['$event']
  )
  onPortfolioStationChange(
    event: Event
  ): void {

    const customEvent =
      event as CustomEvent<number>;

    const stationIndex =
      Number(
        customEvent.detail
      );

    if (
      Number.isInteger(stationIndex) &&
      stationIndex >= 0 &&
      stationIndex < this.stations.length
    ) {

      this.goToStation(
        stationIndex
      );

    }

  }


  // =========================================================
  // NEXT
  // =========================================================

  nextStation(): void {

    if (
      this.activeStationIndex >=
      this.stations.length - 1
    ) {

      return;

    }

    this.goToStation(
      this.activeStationIndex + 1
    );

  }


  // =========================================================
  // PREVIOUS
  // =========================================================

  previousStation(): void {

    if (
      this.activeStationIndex <= 0
    ) {

      return;

    }

    this.goToStation(
      this.activeStationIndex - 1
    );

  }


  // =========================================================
  // GO TO STATION
  // =========================================================

  goToStation(index: number): void {

    if (
      index < 0 ||
      index >= this.stations.length ||
      index === this.activeStationIndex
    ) {

      return;

    }

    if (this.isTransitioning) {

      return;

    }

    this.previousStationIndex =
      this.activeStationIndex;

    this.isTransitioning = true;

    this.activeStationIndex =
      index;

    this.transitionTimer =
      setTimeout(() => {

        this.isTransitioning = false;

      }, 700);

  }


  // =========================================================
  // SECTION TRANSFORM
  // =========================================================

  getSectionTransform(
    index: number
  ): string {

    const difference =
      index -
      this.activeStationIndex;

    const scale =
      index === this.activeStationIndex
        ? 1
        : 0.96;

    return `
      translate3d(
        0,
        ${difference * 100}vh,
        0
      )
      scale(${scale})
    `;

  }


  // =========================================================
  // TRACK BY
  // =========================================================

  trackByStation(
    index: number,
    station: Station
  ): string {

    return station.id;

  }


  // =========================================================
  // GO TO PROFILE / ABOUT
  // =========================================================

  goToProfile(): void {

    this.previousStationIndex =
      this.activeStationIndex;

    this.activeStationIndex = 0;

    this.isTransitioning = false;

    if (this.transitionTimer) {

      clearTimeout(
        this.transitionTimer
      );

    }

  }

}
