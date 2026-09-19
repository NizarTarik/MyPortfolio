import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Planet,
  TECHNOLOGY_PLANETS,
  TechnologyType
} from '../modules/planets';

/* =========================================================
   TYPES
   ========================================================= */

type TechnologyFilter =
  | 'all'
  | 'frontend'
  | 'backend'
  | 'db'
  | 'tools';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  depth: number;
}

interface CoreStar {
  angle: number;
  distance: number;
  size: number;
  alpha: number;
  speed: number;
  twinkle: number;
  depth: number;
}

interface Asteroid {
  angle: number;
  distance: number;
  size: number;
  speed: number;
  opacity: number;
}

/* =========================================================
   COMPONENT
   ========================================================= */

@Component({
  selector: 'app-techs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './techs.component.html',
  styleUrl: './techs.component.css'
})
export class TechsComponent
  implements OnInit, AfterViewInit, OnDestroy {

  /* =======================================================
     CANVAS
     ======================================================= */

  @ViewChild('spaceCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;

  private animationFrameId = 0;

  private resizeObserver?: ResizeObserver;

  /* =======================================================
     STATE
     ======================================================= */

  theme: 'dark' | 'light' = 'light';

  private lastStoredTheme: 'dark' | 'light' | null = null;

  isPaused = false;

  zoomLevel = 0.82;

  /* =======================================================
     MOUSE
     ======================================================= */

  mouseX = 0;

  mouseY = 0;

  private targetMouseX = 0;

  private targetMouseY = 0;

  hoveredPlanet: Planet | null = null;

  /* =======================================================
     FILTER
     ======================================================= */

  activeType: TechnologyFilter = 'all';

  /*
   * This is the array that is actually displayed.
   */
  visiblePlanets: Planet[] = [];

  /* =======================================================
     PLANETS
     ======================================================= */

  planets: Planet[] = TECHNOLOGY_PLANETS.map(
    (planet): Planet => ({
      name: planet.name,
      type: [...planet.type],
      color: planet.color,
      image: planet.image,
      orbitRadiusX: planet.orbitRadiusX,
      orbitRadiusY: planet.orbitRadiusY,
      size: planet.size,
      speed: planet.speed,
      angle: planet.angle,
      description: planet.description,
      icon: planet.icon,
      x: planet.x,
      y: planet.y
    })
  );

  selectedPlanet: Planet | null = null;

  /* =======================================================
     CANVAS ARRAYS
     ======================================================= */

  private stars: Star[] = [];

  private coreStars: CoreStar[] = [];

  private asteroids: Asteroid[] = [];

  /* =======================================================
     IMAGES
     ======================================================= */

  private planetImages =
    new Map<string, HTMLImageElement>();

  /*
   * CORE IMAGE
   *
   * Put the image here:
   *
   * src/assets/images/core.png
   */
  private coreImage?: HTMLImageElement;

  private coreImageSrc =
    'assets/img/cuteface.png';

  /* =======================================================
     HUD
     ======================================================= */

  hudPosition = {
    x: 0,
    y: 0
  };

  isHudDragging = false;

  private dragStart = {
    x: 0,
    y: 0
  };

  /* =======================================================
     THEME COLORS
     ======================================================= */

  private themeColors = {
    background: '#f5f7fa',
    surface: 'rgba(0,0,0,0.035)',
    textPrimary: '#111827',
    textSecondary: '#687180',
    subtle: '#a1a8b2',
    border: 'rgba(15,23,42,0.10)',
    accent: '#0284c7',
    accentSoft: 'rgba(2,132,199,0.10)',
    hover: 'rgba(0,0,0,0.05)'
  };

  /* =======================================================
     INIT
     ======================================================= */

  techsInitialized = false;

  ngOnInit(): void {

    this.initAsteroids();

    this.initCoreStars();

    /*
     * Initially show every technology.
     */
    this.visiblePlanets = [
      ...this.planets
    ];

    if (
      this.visiblePlanets.length > 0
    ) {
      this.selectedPlanet =
        this.visiblePlanets[0];
    }
  }

  /* =======================================================
     AFTER VIEW INIT
     ======================================================= */

  ngAfterViewInit(): void {

    const canvas =
      this.canvasRef.nativeElement;

    const context =
      canvas.getContext('2d');

    if (context === null) {
      return;
    }

    this.ctx = context;

    /*
     * Read theme from localStorage and
     * then read the real CSS variables.
     */
    this.readTheme();

    this.initCanvasSize();

    this.initStars();

    this.initCoreStars();

    this.preloadPlanetImages();

    /*
     * Preload the CORE image.
     */
    this.preloadCoreImage();

    this.repositionVisiblePlanets();

    this.resizeObserver =
      new ResizeObserver(() => {

        this.initCanvasSize();

        this.initStars();

        this.repositionVisiblePlanets();

      });

    if (
      canvas.parentElement !== null
    ) {

      this.resizeObserver.observe(
        canvas.parentElement
      );
    }

    this.animate();
  }

  /* =======================================================
     DESTROY
     ======================================================= */

  ngOnDestroy(): void {

    cancelAnimationFrame(
      this.animationFrameId
    );

    this.resizeObserver?.disconnect();
  }

  /* =======================================================
     FILTER BUTTONS
     ======================================================= */

  showAll(): void {
    this.applyFilter('all');
  }

  showFrontend(): void {
    this.applyFilter('frontend');
  }

  showBackend(): void {
    this.applyFilter('backend');
  }

  showDatabase(): void {
    this.applyFilter('db');
  }

  showTools(): void {
    this.applyFilter('tools');
  }

  /* =======================================================
     FILTER LOGIC
     ======================================================= */

  private applyFilter(
    type: TechnologyFilter
  ): void {

    this.activeType = type;

    if (type === 'all') {

      this.visiblePlanets = [
        ...this.planets
      ];

    } else {

      this.visiblePlanets =
        this.planets.filter(
          (
            planet: Planet
          ): boolean => {

            return planet.type.includes(
              type
            );

          }
        );
    }

    this.hoveredPlanet = null;

    /*
     * Select a planet from the new
     * filtered list.
     */

    if (
      this.visiblePlanets.length > 0
    ) {

      if (
        this.selectedPlanet === null ||
        !this.visiblePlanets.includes(
          this.selectedPlanet
        )
      ) {

        this.selectedPlanet =
          this.visiblePlanets[0];
      }

    } else {

      this.selectedPlanet = null;
    }

    this.hudPosition = {
      x: 0,
      y: 0
    };

    this.repositionVisiblePlanets();
  }

  /* =======================================================
     COUNT
     ======================================================= */

  getCount(
    type: TechnologyType
  ): number {

    return this.planets.filter(
      (
        planet: Planet
      ): boolean => {

        return planet.type.includes(
          type
        );

      }
    ).length;
  }

  /* =======================================================
     COLOR
     ======================================================= */

  getCurrentCategoryColor(): string {

    return this.getTypeColor(
      this.activeType
    );
  }

  getTypeColor(
    type:
      | TechnologyFilter
      | TechnologyType
  ): string {

    switch (type) {

      case 'frontend':
        return '#dd0031';

      case 'backend':
        return '#6db33f';

      case 'db':
        return '#336791';

      case 'tools':
        return '#f97316';

      case 'all':
      default:
        return '#7dd3fc';
    }
  }

  /* =======================================================
     TRACK BY
     ======================================================= */

  trackPlanet(
    index: number,
    planet: Planet
  ): string {

    return planet.name;
  }

  /* =======================================================
     THEME
     ======================================================= */

  private readTheme(): void {

    const shell =
      this.canvasRef.nativeElement.closest(
        '.portfolio-shell'
      );

    if (shell === null) {
      return;
    }

    /*
     * LOCALSTORAGE IS THE SOURCE OF TRUTH.
     *
     * dark  -> dark
     * light -> light
     * empty -> light
     */

    const storedTheme =
      localStorage.getItem(
        'portfolio-theme'
      );

    const nextTheme:
      'dark' | 'light' =
      storedTheme === 'dark'
        ? 'dark'
        : 'light';

    /*
     * Make sure the shell class matches
     * the localStorage value.
     */

    if (nextTheme === 'light') {

      shell.classList.add(
        'light-theme'
      );

    } else {

      shell.classList.remove(
        'light-theme'
      );
    }

    /*
     * NOW read the actual colors
     * from app.css.
     */

    const styles =
      getComputedStyle(shell);

    const getVariable = (
      variable: string,
      fallback: string
    ): string => {

      const value =
        styles
          .getPropertyValue(variable)
          .trim();

      return value.length > 0
        ? value
        : fallback;
    };

    this.theme = nextTheme;

    this.lastStoredTheme =
      nextTheme;

    this.themeColors = {

      background:
        getVariable(
          '--bg',
          nextTheme === 'light'
            ? '#f5f7fa'
            : '#07090d'
        ),

      surface:
        getVariable(
          '--surface',
          nextTheme === 'light'
            ? 'rgba(0,0,0,0.035)'
            : 'rgba(255,255,255,0.035)'
        ),

      textPrimary:
        getVariable(
          '--text-primary',
          nextTheme === 'light'
            ? '#111827'
            : '#f4f7fb'
        ),

      textSecondary:
        getVariable(
          '--text-secondary',
          nextTheme === 'light'
            ? '#687180'
            : '#89919d'
        ),

      subtle:
        getVariable(
          '--subtle',
          nextTheme === 'light'
            ? '#a1a8b2'
            : '#555d68'
        ),

      border:
        getVariable(
          '--border-color',
          nextTheme === 'light'
            ? 'rgba(15,23,42,0.10)'
            : 'rgba(255,255,255,0.09)'
        ),

      accent:
        getVariable(
          '--accent-color',
          nextTheme === 'light'
            ? '#0284c7'
            : '#7dd3fc'
        ),

      accentSoft:
        getVariable(
          '--accent-soft',
          nextTheme === 'light'
            ? 'rgba(2,132,199,0.10)'
            : 'rgba(125,211,252,0.14)'
        ),

      hover:
        getVariable(
          '--hover-bg',
          nextTheme === 'light'
            ? 'rgba(0,0,0,0.05)'
            : 'rgba(255,255,255,0.05)'
        )
    };
  }

  private syncTheme(): void {

    const storedTheme =
      localStorage.getItem(
        'portfolio-theme'
      );

    const nextTheme:
      'dark' | 'light' =
      storedTheme === 'dark'
        ? 'dark'
        : 'light';

    if (
      nextTheme !==
      this.lastStoredTheme
    ) {

      this.readTheme();
    }
  }

  private getThemeColor(
    variable: string,
    fallback: string
  ): string {

    const shell =
      this.canvasRef.nativeElement.closest(
        '.portfolio-shell'
      );

    if (shell === null) {
      return fallback;
    }

    const value =
      getComputedStyle(shell)
        .getPropertyValue(variable)
        .trim();

    return value.length > 0
      ? value
      : fallback;
  }

  /* =======================================================
     CANVAS SIZE
     ======================================================= */

  private initCanvasSize(): void {

    const canvas =
      this.canvasRef.nativeElement;

    const parent =
      canvas.parentElement;

    if (parent === null) {
      return;
    }

    const rect =
      parent.getBoundingClientRect();

    const dpr =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );

    canvas.width =
      rect.width * dpr;

    canvas.height =
      rect.height * dpr;

    canvas.style.width =
      `${rect.width}px`;

    canvas.style.height =
      `${rect.height}px`;

    this.ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );
  }

  /* =======================================================
     STARS
     ======================================================= */

  private initStars(): void {

    const canvas =
      this.canvasRef.nativeElement;

    const width =
      canvas.clientWidth;

    const height =
      canvas.clientHeight;

    this.stars = [];

    const amount =
      Math.min(
        260,
        Math.floor(
          (width * height) / 6500
        )
      );

    for (
      let i = 0;
      i < amount;
      i++
    ) {

      this.stars.push({

        x:
          Math.random() * width,

        y:
          Math.random() * height,

        radius:
          Math.random() * 1.5 + 0.2,

        alpha:
          Math.random() * 0.8 + 0.1,

        speed:
          Math.random() * 0.01 + 0.002,

        depth:
          Math.random() * 0.8 + 0.2
      });
    }
  }

  /* =======================================================
     CORE STARS
     ======================================================= */

  private initCoreStars(): void {

    this.coreStars = [];

    const amount = 32;

    for (
      let i = 0;
      i < amount;
      i++
    ) {

      const angle =
        (i / amount) *
        Math.PI *
        2 +
        (Math.random() - 0.5) *
        0.12;

      const distance =
        72 +
        Math.random() * 38;

      this.coreStars.push({

        angle,

        distance,

        size:
          Math.random() * 1.25 + 0.35,

        alpha:
          Math.random() * 0.55 + 0.25,

        speed:
          Math.random() * 0.0008 +
          0.00025,

        twinkle:
          Math.random() *
          Math.PI *
          2,

        depth:
          Math.random() * 0.8 + 0.2
      });
    }
  }

  /* =======================================================
     ASTEROIDS
     ======================================================= */

  private initAsteroids(): void {

    this.asteroids = [];

    for (
      let i = 0;
      i < 55;
      i++
    ) {

      this.asteroids.push({

        angle:
          Math.random() *
          Math.PI *
          2,

        distance:
          350 +
          Math.random() * 65,

        size:
          Math.random() * 2 + 0.6,

        speed:
          0.002 +
          Math.random() * 0.005,

        opacity:
          Math.random() * 0.45 + 0.1
      });
    }
  }

  /* =======================================================
     IMAGE PRELOAD
     ======================================================= */

  private preloadPlanetImages(): void {

    for (
      const planet of this.planets
    ) {

      const image =
        new Image();

      image.src =
        planet.image;

      image.onload = (): void => {

        this.planetImages.set(
          planet.name,
          image
        );
      };

      image.onerror = (): void => {

        console.warn(
          'Technology image failed:',
          planet.image
        );
      };
    }
  }

  /* =======================================================
     CORE IMAGE PRELOAD
     ======================================================= */

  private preloadCoreImage(): void {

    const image =
      new Image();

    image.src =
      this.coreImageSrc;

    image.onload = (): void => {

      this.coreImage =
        image;
    };

    image.onerror = (): void => {

      console.warn(
        'Core image failed:',
        this.coreImageSrc
      );
    };
  }

  /* =======================================================
     ORBIT POSITION
     ======================================================= */

  private repositionVisiblePlanets(): void {

    if (
      this.visiblePlanets.length === 0
    ) {
      return;
    }

    const canvas =
      this.canvasRef?.nativeElement;

    if (canvas === undefined) {
      return;
    }

    const width =
      canvas.clientWidth || 1000;

    const height =
      canvas.clientHeight || 700;

    const maxOrbitX =
      Math.max(
        150,
        Math.min(
          (width - 100) *
          0.5 /
          1.25,
          390
        )
      );

    const maxOrbitY =
      Math.max(
        100,
        Math.min(
          (height - 120) *
          0.5 /
          1.25,
          250
        )
      );

    const minOrbitX =
      Math.min(
        130,
        maxOrbitX * 0.48
      );

    const minOrbitY =
      Math.min(
        82,
        maxOrbitY * 0.48
      );

    const total =
      this.visiblePlanets.length;

    this.visiblePlanets.forEach(
      (
        planet: Planet,
        index: number
      ): void => {

        const progress =
          total === 1
            ? 0.5
            : index /
            (total - 1);

        const eased =
          Math.pow(
            progress,
            0.9
          );

        planet.orbitRadiusX =
          minOrbitX +
          (maxOrbitX -
            minOrbitX) *
          eased;

        planet.orbitRadiusY =
          minOrbitY +
          (maxOrbitY -
            minOrbitY) *
          eased;

        const spacing =
          (Math.PI * 2) /
          total;

        const offset =
          index % 2 === 0
            ? 0.12
            : -0.12;

        planet.angle =
          index *
          spacing +
          offset;
      }
    );
  }

  /* =======================================================
     ANIMATION
     ======================================================= */

  private animate = (): void => {

    this.syncTheme();

    const canvas =
      this.canvasRef.nativeElement;

    const width =
      canvas.clientWidth;

    const height =
      canvas.clientHeight;

    this.ctx.clearRect(
      0,
      0,
      width,
      height
    );

    this.mouseX +=
      (
        this.targetMouseX -
        this.mouseX
      ) * 0.035;

    this.mouseY +=
      (
        this.targetMouseY -
        this.mouseY
      ) * 0.035;

    const centerX =
      width / 2 +
      this.mouseX * 12;

    const centerY =
      height / 2 +
      this.mouseY * 8;

    this.drawStars(
      width,
      height
    );

    this.drawGrid(
      width,
      height
    );

    this.drawConnectionNetwork(
      centerX,
      centerY
    );

    this.drawCoreStars(
      centerX,
      centerY
    );

    this.drawCore(
      centerX,
      centerY
    );

    this.drawAsteroidBelt(
      centerX,
      centerY
    );

    this.drawPlanets(
      centerX,
      centerY
    );

    this.animationFrameId =
      requestAnimationFrame(
        this.animate
      );
  };

  /* =======================================================
     DRAW STARS
     ======================================================= */

  private drawStars(
    width: number,
    height: number
  ): void {

    const starColor =
      this.getThemeColor(
        '--text-primary',
        this.theme === 'light'
          ? '#111827'
          : '#f4f7fb'
      );

    for (
      const star of this.stars
    ) {

      if (!this.isPaused) {

        star.alpha +=
          star.speed;

        if (star.alpha > 1) {
          star.alpha = 0.1;
        }
      }

      const parallaxX =
        this.mouseX *
        star.depth *
        15;

      const parallaxY =
        this.mouseY *
        star.depth *
        10;

      this.ctx.fillStyle =
        starColor;

      this.ctx.globalAlpha =
        star.alpha * 0.7;

      this.ctx.beginPath();

      this.ctx.arc(
        star.x + parallaxX,
        star.y + parallaxY,
        star.radius,
        0,
        Math.PI * 2
      );

      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
  }

  /* =======================================================
     DRAW CORE STARS
     ======================================================= */

  private drawCoreStars(
    centerX: number,
    centerY: number
  ): void {

    const starColor =
      this.getThemeColor(
        '--text-primary',
        this.theme === 'light'
          ? '#111827'
          : '#f4f7fb'
      );

    const time =
      performance.now() * 0.001;

    this.ctx.save();

    for (
      const star of this.coreStars
    ) {

      if (!this.isPaused) {

        star.angle +=
          star.speed;
      }

      const parallaxX =
        this.mouseX *
        star.depth *
        5;

      const parallaxY =
        this.mouseY *
        star.depth *
        4;

      const x =
        centerX +
        Math.cos(star.angle) *
        star.distance *
        this.zoomLevel +
        parallaxX;

      const y =
        centerY +
        Math.sin(star.angle) *
        star.distance *
        0.62 *
        this.zoomLevel +
        parallaxY;

      const twinkle =
        0.72 +
        Math.sin(
          time * 2 +
          star.twinkle
        ) * 0.28;

      this.ctx.fillStyle =
        starColor;

      this.ctx.globalAlpha =
        star.alpha *
        twinkle *
        (
          this.theme === 'light'
            ? 0.48
            : 0.72
        );

      this.ctx.beginPath();

      this.ctx.arc(
        x,
        y,
        star.size *
        this.zoomLevel,
        0,
        Math.PI * 2
      );

      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;

    this.ctx.restore();
  }

  /* =======================================================
     GRID
     ======================================================= */

  private drawGrid(
    width: number,
    height: number
  ): void {

    const spacing = 80;

    this.ctx.lineWidth = 1;

    this.ctx.strokeStyle =
      this.theme === 'dark'
        ? 'rgba(255,255,255,0.018)'
        : 'rgba(15,23,42,0.025)';

    for (
      let x = 0;
      x < width;
      x += spacing
    ) {

      this.ctx.beginPath();

      this.ctx.moveTo(
        x,
        0
      );

      this.ctx.lineTo(
        x,
        height
      );

      this.ctx.stroke();
    }

    for (
      let y = 0;
      y < height;
      y += spacing
    ) {

      this.ctx.beginPath();

      this.ctx.moveTo(
        0,
        y
      );

      this.ctx.lineTo(
        width,
        y
      );

      this.ctx.stroke();
    }
  }

  /* =======================================================
     CORE
     ======================================================= */

  private drawCore(
    centerX: number,
    centerY: number
  ): void {

    const pulse =
      Math.sin(
        Date.now() * 0.002
      ) * 3;

    /*
     * OUTER GLOW
     */

    const glow =
      this.ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        130 * this.zoomLevel
      );

    glow.addColorStop(
      0,
      this.theme === 'dark'
        ? 'rgba(125,211,252,0.20)'
        : 'rgba(2,132,199,0.12)'
    );

    glow.addColorStop(
      0.35,
      this.theme === 'dark'
        ? 'rgba(125,211,252,0.08)'
        : 'rgba(2,132,199,0.05)'
    );

    glow.addColorStop(
      1,
      'rgba(125,211,252,0)'
    );

    this.ctx.fillStyle =
      glow;

    this.ctx.beginPath();

    this.ctx.arc(
      centerX,
      centerY,
      130 * this.zoomLevel,
      0,
      Math.PI * 2
    );

    this.ctx.fill();

    /*
     * CORE ORBIT RING
     */

    this.ctx.strokeStyle =
      this.theme === 'dark'
        ? 'rgba(125,211,252,0.25)'
        : 'rgba(2,132,199,0.22)';

    this.ctx.lineWidth = 1;

    this.ctx.beginPath();

    this.ctx.arc(
      centerX,
      centerY,
      (48 + pulse) *
      this.zoomLevel,
      0,
      Math.PI * 2
    );

    this.ctx.stroke();

    /*
     * CORE IMAGE
     */

    const image =
      this.coreImage;

    const radius =
      32 *
      this.zoomLevel;

    if (
      image !== undefined &&
      image.complete &&
      image.naturalWidth > 0
    ) {

      this.ctx.save();

      /*
       * Clip the image into a circle.
       */

      this.ctx.beginPath();

      this.ctx.arc(
        centerX,
        centerY,
        radius,
        0,
        Math.PI * 2
      );

      this.ctx.clip();

      const imageRatio =
        image.naturalWidth /
        image.naturalHeight;

      let drawWidth = 0;

      let drawHeight = 0;

      /*
       * Cover the complete circle.
       */

      if (imageRatio > 1) {

        drawHeight =
          radius * 2;

        drawWidth =
          drawHeight *
          imageRatio;

      } else {

        drawWidth =
          radius * 2;

        drawHeight =
          drawWidth /
          imageRatio;
      }

      this.ctx.drawImage(
        image,
        centerX -
        drawWidth / 2,
        centerY -
        drawHeight / 2,
        drawWidth,
        drawHeight
      );

      this.ctx.restore();

      /*
       * IMAGE BORDER
       */

      this.ctx.strokeStyle =
        this.theme === 'dark'
          ? 'rgba(125,211,252,0.75)'
          : 'rgba(2,132,199,0.55)';

      this.ctx.lineWidth = 1.4;

      this.ctx.beginPath();

      this.ctx.arc(
        centerX,
        centerY,
        radius,
        0,
        Math.PI * 2
      );

      this.ctx.stroke();

    } else {

      /*
       * Fallback while the image
       * is loading or unavailable.
       */

      const core =
        this.ctx.createRadialGradient(
          centerX - 7,
          centerY - 7,
          0,
          centerX,
          centerY,
          radius
        );

      core.addColorStop(
        0,
        '#ffffff'
      );

      core.addColorStop(
        0.35,
        this.theme === 'dark'
          ? '#dff7ff'
          : '#e0f2fe'
      );

      core.addColorStop(
        1,
        this.themeColors.accent
      );

      this.ctx.fillStyle =
        core;

      this.ctx.beginPath();

      this.ctx.arc(
        centerX,
        centerY,
        radius,
        0,
        Math.PI * 2
      );

      this.ctx.fill();
    }
  }

  /* =======================================================
     CONNECTION NETWORK
     ======================================================= */

  private drawConnectionNetwork(
    centerX: number,
    centerY: number
  ): void {

    for (
      const planet of this.visiblePlanets
    ) {

      if (
        planet.x === undefined ||
        planet.y === undefined
      ) {
        continue;
      }

      const active =
        planet ===
        this.selectedPlanet;

      this.ctx.strokeStyle =
        active
          ? `${planet.color}55`
          : this.theme === 'dark'
            ? 'rgba(255,255,255,0.025)'
            : 'rgba(15,23,42,0.035)';

      this.ctx.lineWidth =
        active
          ? 1
          : 0.6;

      this.ctx.beginPath();

      this.ctx.moveTo(
        centerX,
        centerY
      );

      this.ctx.lineTo(
        planet.x,
        planet.y
      );

      this.ctx.stroke();
    }
  }

  /* =======================================================
     ASTEROID BELT
     ======================================================= */

  private drawAsteroidBelt(
    centerX: number,
    centerY: number
  ): void {

    const textColor =
      this.getThemeColor(
        '--text-primary',
        this.theme === 'light'
          ? '#111827'
          : '#f4f7fb'
      );

    for (
      const asteroid of this.asteroids
    ) {

      if (!this.isPaused) {

        asteroid.angle +=
          asteroid.speed;
      }

      const x =
        centerX +
        Math.cos(
          asteroid.angle
        ) *
        asteroid.distance *
        this.zoomLevel;

      const y =
        centerY +
        Math.sin(
          asteroid.angle
        ) *
        asteroid.distance *
        0.62 *
        this.zoomLevel;

      this.ctx.fillStyle =
        textColor;

      this.ctx.globalAlpha =
        asteroid.opacity;

      this.ctx.beginPath();

      this.ctx.arc(
        x,
        y,
        asteroid.size,
        0,
        Math.PI * 2
      );

      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
  }

  /* =======================================================
     PLANETS
     ======================================================= */

  private drawPlanets(
    centerX: number,
    centerY: number
  ): void {

    for (
      const planet of this.visiblePlanets
    ) {

      const rx =
        planet.orbitRadiusX *
        this.zoomLevel;

      const ry =
        planet.orbitRadiusY *
        this.zoomLevel;

      const selected =
        planet ===
        this.selectedPlanet;

      const hovered =
        planet ===
        this.hoveredPlanet;

      /* ORBIT */

      this.ctx.strokeStyle =
        selected
          ? `${planet.color}35`
          : this.theme === 'dark'
            ? 'rgba(255,255,255,0.045)'
            : 'rgba(15,23,42,0.05)';

      this.ctx.lineWidth =
        selected
          ? 1.4
          : 0.8;

      this.ctx.beginPath();

      this.ctx.ellipse(
        centerX,
        centerY,
        rx,
        ry,
        0,
        0,
        Math.PI * 2
      );

      this.ctx.stroke();

      /* MOVEMENT */

      if (!this.isPaused) {

        planet.angle +=
          planet.speed;
      }

      const x =
        centerX +
        Math.cos(
          planet.angle
        ) *
        rx;

      const y =
        centerY +
        Math.sin(
          planet.angle
        ) *
        ry;

      planet.x = x;

      planet.y = y;

      /* GLOW */

      const glowSize =
        planet.size *
        (
          selected ||
            hovered
            ? 2.8
            : 2
        );

      const glow =
        this.ctx.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          glowSize *
          this.zoomLevel
        );

      glow.addColorStop(
        0,
        `${planet.color}80`
      );

      glow.addColorStop(
        1,
        `${planet.color}00`
      );

      this.ctx.fillStyle =
        glow;

      this.ctx.beginPath();

      this.ctx.arc(
        x,
        y,
        glowSize *
        this.zoomLevel,
        0,
        Math.PI * 2
      );

      this.ctx.fill();

      /* IMAGE */

      this.drawPlanetImage(
        planet,
        x,
        y
      );

      /* SELECTION */

      if (
        selected ||
        hovered
      ) {

        this.ctx.strokeStyle =
          selected
            ? this.themeColors.textPrimary
            : `${planet.color}aa`;

        this.ctx.lineWidth =
          selected
            ? 1.5
            : 1;

        this.ctx.beginPath();

        this.ctx.arc(
          x,
          y,
          (
            planet.size +
            9
          ) *
          this.zoomLevel,
          0,
          Math.PI * 2
        );

        this.ctx.stroke();

        this.drawTargetBrackets(
          x,
          y,
          planet.size *
          this.zoomLevel +
          15
        );
      }

      /* LABEL */

      if (
        selected ||
        hovered ||
        planet.size >= 27
      ) {

        this.drawPlanetLabel(
          planet,
          x,
          y
        );
      }
    }
  }

  /* =======================================================
     PLANET IMAGE
     ======================================================= */

  private drawPlanetImage(
    planet: Planet,
    x: number,
    y: number
  ): void {

    const image =
      this.planetImages.get(
        planet.name
      );

    const radius =
      planet.size *
      this.zoomLevel;

    if (
      image === undefined ||
      !image.complete ||
      image.naturalWidth === 0
    ) {

      this.ctx.fillStyle =
        planet.color;

      this.ctx.beginPath();

      this.ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
      );

      this.ctx.fill();

      return;
    }

    this.ctx.save();

    this.ctx.beginPath();

    this.ctx.arc(
      x,
      y,
      radius,
      0,
      Math.PI * 2
    );

    this.ctx.clip();

    const imageRatio =
      image.naturalWidth /
      image.naturalHeight;

    let drawWidth = 0;

    let drawHeight = 0;

    if (imageRatio > 1) {

      drawHeight =
        radius * 2;

      drawWidth =
        drawHeight *
        imageRatio;

    } else {

      drawWidth =
        radius * 2;

      drawHeight =
        drawWidth /
        imageRatio;
    }

    this.ctx.drawImage(
      image,
      x -
      drawWidth / 2,
      y -
      drawHeight / 2,
      drawWidth,
      drawHeight
    );

    this.ctx.restore();

    this.ctx.strokeStyle =
      `${planet.color}dd`;

    this.ctx.lineWidth = 1.2;

    this.ctx.beginPath();

    this.ctx.arc(
      x,
      y,
      radius,
      0,
      Math.PI * 2
    );

    this.ctx.stroke();
  }

  /* =======================================================
     PLANET LABEL
     ======================================================= */

  private drawPlanetLabel(
    planet: Planet,
    x: number,
    y: number
  ): void {

    const offsetY =
      planet.size *
      this.zoomLevel +
      18;

    const labelColor =
      this.getThemeColor(
        '--text-primary',
        this.theme === 'dark'
          ? '#f4f7fb'
          : '#111827'
      );

    this.ctx.save();

    this.ctx.textAlign =
      'center';

    this.ctx.textBaseline =
      'alphabetic';

    this.ctx.font =
      '600 9px Inter, sans-serif';

    this.ctx.fillStyle =
      labelColor;

    this.ctx.globalAlpha =
      this.theme === 'dark'
        ? 0.92
        : 0.82;

    this.ctx.fillText(
      planet.name.toUpperCase(),
      x,
      y + offsetY
    );

    this.ctx.restore();
  }

  /* =======================================================
     TARGET BRACKETS
     ======================================================= */

  private drawTargetBrackets(
    x: number,
    y: number,
    radius: number
  ): void {

    const size = 5;

    const bracketColor =
      this.getThemeColor(
        '--text-primary',
        this.theme === 'dark'
          ? '#f4f7fb'
          : '#111827'
      );

    this.ctx.save();

    this.ctx.strokeStyle =
      bracketColor;

    this.ctx.globalAlpha =
      this.theme === 'dark'
        ? 0.75
        : 0.65;

    this.ctx.lineWidth = 1;

    /* TOP LEFT */

    this.ctx.beginPath();

    this.ctx.moveTo(
      x - radius,
      y - radius + size
    );

    this.ctx.lineTo(
      x - radius,
      y - radius
    );

    this.ctx.lineTo(
      x - radius + size,
      y - radius
    );

    this.ctx.stroke();

    /* TOP RIGHT */

    this.ctx.beginPath();

    this.ctx.moveTo(
      x + radius - size,
      y - radius
    );

    this.ctx.lineTo(
      x + radius,
      y - radius
    );

    this.ctx.lineTo(
      x + radius,
      y - radius + size
    );

    this.ctx.stroke();

    /* BOTTOM LEFT */

    this.ctx.beginPath();

    this.ctx.moveTo(
      x - radius,
      y + radius - size
    );

    this.ctx.lineTo(
      x - radius,
      y + radius
    );

    this.ctx.lineTo(
      x - radius + size,
      y + radius
    );

    this.ctx.stroke();

    /* BOTTOM RIGHT */

    this.ctx.beginPath();

    this.ctx.moveTo(
      x + radius - size,
      y + radius
    );

    this.ctx.lineTo(
      x + radius,
      y + radius
    );

    this.ctx.lineTo(
      x + radius,
      y + radius - size
    );

    this.ctx.stroke();

    this.ctx.restore();
  }

  /* =======================================================
     MOUSE MOVE
     ======================================================= */

  onCanvasMouseMove(
    event: MouseEvent
  ): void {

    const canvas =
      this.canvasRef.nativeElement;

    const rect =
      canvas.getBoundingClientRect();

    const x =
      event.clientX -
      rect.left;

    const y =
      event.clientY -
      rect.top;

    this.targetMouseX =
      x / rect.width -
      0.5;

    this.targetMouseY =
      y / rect.height -
      0.5;

    let closest:
      Planet | null = null;

    let closestDistance =
      Infinity;

    for (
      const planet of this.visiblePlanets
    ) {

      if (
        planet.x === undefined ||
        planet.y === undefined
      ) {
        continue;
      }

      const dx =
        x - planet.x;

      const dy =
        y - planet.y;

      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy
        );

      const hitRadius =
        planet.size *
        this.zoomLevel +
        18;

      if (
        distance < hitRadius &&
        distance <
        closestDistance
      ) {

        closest = planet;

        closestDistance =
          distance;
      }
    }

    this.hoveredPlanet =
      closest;

    canvas.style.cursor =
      closest !== null
        ? 'pointer'
        : 'default';
  }

  /* =======================================================
     MOUSE LEAVE
     ======================================================= */

  onCanvasMouseLeave(): void {

    this.hoveredPlanet =
      null;

    this.targetMouseX = 0;

    this.targetMouseY = 0;
  }

  /* =======================================================
     CANVAS CLICK
     ======================================================= */

  onCanvasClick(
    event: MouseEvent
  ): void {

    const canvas =
      this.canvasRef.nativeElement;

    const rect =
      canvas.getBoundingClientRect();

    const x =
      event.clientX -
      rect.left;

    const y =
      event.clientY -
      rect.top;

    let closest:
      Planet | null = null;

    let closestDistance =
      Infinity;

    for (
      const planet of this.visiblePlanets
    ) {

      if (
        planet.x === undefined ||
        planet.y === undefined
      ) {
        continue;
      }

      const dx =
        x - planet.x;

      const dy =
        y - planet.y;

      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy
        );

      const hitRadius =
        planet.size *
        this.zoomLevel +
        20;

      if (
        distance < hitRadius &&
        distance <
        closestDistance
      ) {

        closest = planet;

        closestDistance =
          distance;
      }
    }

    if (closest !== null) {
      this.selectPlanet(closest);
    }
  }

  /* =======================================================
     SELECT PLANET
     ======================================================= */

  selectPlanet(
    planet: Planet
  ): void {

    if (
      !this.visiblePlanets.includes(
        planet
      )
    ) {
      return;
    }

    this.selectedPlanet =
      planet;

    this.zoomLevel =
      Math.max(
        this.zoomLevel,
        0.75
      );
  }

  /* =======================================================
     CONTROLS
     ======================================================= */

  togglePause(): void {

    this.isPaused =
      !this.isPaused;
  }

  zoomIn(): void {

    this.zoomLevel =
      Math.min(
        1.25,
        this.zoomLevel + 0.08
      );
  }

  zoomOut(): void {

    this.zoomLevel =
      Math.max(
        0.55,
        this.zoomLevel - 0.08
      );
  }

  resetView(): void {

    this.zoomLevel = 0.82;
  }

  /* =======================================================
     KEYBOARD
     ======================================================= */

  @HostListener(
    'window:keydown',
    ['$event']
  )
  handleKeyboard(
    event: KeyboardEvent
  ): void {

    if (
      event.code === 'Space'
    ) {

      event.preventDefault();

      this.togglePause();
    }

    if (
      event.key === '+' ||
      event.key === '='
    ) {

      this.zoomIn();
    }

    if (
      event.key === '-'
    ) {

      this.zoomOut();
    }

    if (
      event.key === '0'
    ) {

      this.resetView();
    }
  }

  /* =======================================================
     RESPONSIVE
     ======================================================= */

  @HostListener(
    'window:resize'
  )
  onWindowResize(): void {

    /*
     * ResizeObserver handles
     * canvas resizing.
     */
  }

  /* =======================================================
     HUD DRAG
     ======================================================= */

  startHudDrag(
    event: PointerEvent
  ): void {

    if (
      event.pointerType === 'mouse' &&
      event.button !== 0
    ) {
      return;
    }

    this.isHudDragging = true;

    this.dragStart = {

      x:
        event.clientX -
        this.hudPosition.x,

      y:
        event.clientY -
        this.hudPosition.y
    };

    const target =
      event.currentTarget;

    if (
      target instanceof HTMLElement
    ) {

      target.setPointerCapture(
        event.pointerId
      );
    }

    event.preventDefault();
  }

  @HostListener(
    'document:pointermove',
    ['$event']
  )
  onHudDrag(
    event: PointerEvent
  ): void {

    if (
      !this.isHudDragging
    ) {
      return;
    }

    this.hudPosition = {

      x:
        event.clientX -
        this.dragStart.x,

      y:
        event.clientY -
        this.dragStart.y
    };
  }

  @HostListener(
    'document:pointerup'
  )
  @HostListener(
    'document:pointercancel'
  )
  stopHudDrag(): void {

    this.isHudDragging =
      false;
  }
}
