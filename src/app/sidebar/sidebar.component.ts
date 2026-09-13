import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  // =========================================================
  // SIDEBAR STATE
  // =========================================================

  isHidden = false;
  isEntering = false;
  isDragging = false;

  // =========================================================
  // THEME
  // =========================================================

  @Input()
  currentTheme: 'dark' | 'light' = 'dark';

  @Output()
  themeToggle = new EventEmitter<void>();

  // =========================================================
  // EXTERNAL LINKS
  // =========================================================

  githubUrl = 'https://github.com/NizarTarik';
  emailUrl = 'mailto:nizartarik994@gmail.com';

  // =========================================================
  // DRAG STATE
  // =========================================================

  private readonly positionStorageKey =
    'portfolio-sidebar-position';

  // =========================================================
  // DEFAULT POSITION
  // MATCHES CSS:
  //
  // left: 24px;
  // top: 50%;
  // transform: translate3d(0, -50%, 0);
  // =========================================================

  private readonly defaultLeft = 24;

  private pointerStartX = 0;
  private pointerStartY = 0;

  private startLeft = 0;
  private startTop = 0;

  private activePointerId: number | null = null;

  // =========================================================
  // INITIAL POSITION
  // =========================================================

  sidebarLeft = this.defaultLeft;
  sidebarTop = 0;

  // =========================================================
  // LIFECYCLE
  // =========================================================

  ngOnInit(): void {

    // Match CSS top: 50%.
    this.setDefaultSidebarPosition();

    this.loadSidebarPosition();

    requestAnimationFrame(() => {

      this.isEntering = true;

      setTimeout(() => {
        this.isEntering = false;
      }, 750);

    });
  }

  // =========================================================
  // HOVER
  // =========================================================

  onSidebarEnter(): void {
    // Expansion is handled by CSS.
  }

  onSidebarLeave(): void {
    // Expansion is handled by CSS.
  }

  // =========================================================
  // HIDE / SHOW
  // =========================================================

  toggleHideSidebar(): void {
    this.isHidden = !this.isHidden;
  }

  // =========================================================
  // THEME
  // =========================================================

  onThemeToggle(): void {
    this.themeToggle.emit();
  }

  // =========================================================
  // STATION NAVIGATION
  // =========================================================

  goToStation(
    event: MouseEvent,
    stationIndex: number
  ): void {

    event.preventDefault();

    window.dispatchEvent(
      new CustomEvent<number>(
        'portfolioStationChange',
        {
          detail: stationIndex
        }
      )
    );
  }

  // =========================================================
  // SIDEBAR DRAG
  // =========================================================

  onDragStart(event: PointerEvent): void {

    // Only left mouse button.
    if (
      event.pointerType === 'mouse' &&
      event.button !== 0
    ) {
      return;
    }

    // Do not start dragging when interacting with controls.
    const target = event.target as HTMLElement | null;

    if (
      target?.closest(
        'a, button, input, textarea, select, option'
      )
    ) {
      return;
    }

    this.isDragging = true;

    this.activePointerId = event.pointerId;

    this.pointerStartX = event.clientX;
    this.pointerStartY = event.clientY;

    this.startLeft = this.sidebarLeft;
    this.startTop = this.sidebarTop;

    document.body.classList.add(
      'sidebar-dragging'
    );

    try {

      (
        event.currentTarget as HTMLElement
      )?.setPointerCapture(
        event.pointerId
      );

    } catch {
      // Pointer capture is not available in every browser context.
    }

    event.preventDefault();
  }

  // =========================================================
  // DRAG MOVE
  // =========================================================

  onDragMove(event: PointerEvent): void {

    if (
      !this.isDragging ||
      this.activePointerId !== event.pointerId
    ) {
      return;
    }

    const deltaX =
      event.clientX - this.pointerStartX;

    const deltaY =
      event.clientY - this.pointerStartY;

    const newLeft =
      this.startLeft + deltaX;

    const newTop =
      this.startTop + deltaY;

    const clamped =
      this.clampSidebarPosition(
        newLeft,
        newTop
      );

    this.sidebarLeft = clamped.left;
    this.sidebarTop = clamped.top;

    event.preventDefault();
  }

  // =========================================================
  // DRAG END
  // =========================================================

  onDragEnd(event?: PointerEvent): void {

    if (!this.isDragging) {
      return;
    }

    if (
      event &&
      this.activePointerId !== null &&
      event.pointerId !== this.activePointerId
    ) {
      return;
    }

    this.isDragging = false;
    this.activePointerId = null;

    document.body.classList.remove(
      'sidebar-dragging'
    );

    this.saveSidebarPosition();
  }

  // =========================================================
  // RESET SIDEBAR POSITION
  // =========================================================
  // Matches CSS default:
  //
  // left: 24px;
  // top: 50%;
  // transform: translate3d(0, -50%, 0);
  // =========================================================

  resetSidebarPosition(event?: MouseEvent): void {

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.isDragging = false;
    this.activePointerId = null;

    document.body.classList.remove(
      'sidebar-dragging'
    );

    // Remove saved dragged position.
    localStorage.removeItem(
      this.positionStorageKey
    );

    // Restore CSS default position.
    this.setDefaultSidebarPosition();
  }

  // =========================================================
  // SET DEFAULT POSITION
  // =========================================================
  // CSS:
  //
  // left: 24px;
  // top: 50%;
  //
  // Angular uses the actual viewport center in pixels.
  // The CSS transform:
  //
  // translate3d(0, -50%, 0)
  //
  // then centers the sidebar vertically.
  // =========================================================

  private setDefaultSidebarPosition(): void {

    const viewportHeight =
      window.innerHeight;

    const defaultPosition =
      this.clampSidebarPosition(
        this.defaultLeft,
        viewportHeight / 2
      );

    this.sidebarLeft =
      defaultPosition.left;

    this.sidebarTop =
      defaultPosition.top;
  }

  // =========================================================
  // POSITION CLAMPING
  // =========================================================

  private clampSidebarPosition(
    left: number,
    top: number
  ): {
    left: number;
    top: number;
  } {

    const viewportWidth =
      window.innerWidth;

    const viewportHeight =
      window.innerHeight;

    /*
     * Keep a small portion of the sidebar visible.
     * This prevents accidentally dragging it completely
     * outside the screen.
     */

    const sidebarWidth =
      Math.min(
        320,
        Math.max(0, viewportWidth - 24)
      );

    const minimumVisible = 52;

    const minLeft =
      -(sidebarWidth - minimumVisible);

    const maxLeft =
      viewportWidth - minimumVisible;

    const minTop = 12;

    const maxTop =
      viewportHeight - minimumVisible;

    return {
      left: Math.min(
        Math.max(left, minLeft),
        maxLeft
      ),

      top: Math.min(
        Math.max(top, minTop),
        maxTop
      )
    };
  }

  // =========================================================
  // SAVE POSITION
  // =========================================================

  private saveSidebarPosition(): void {

    localStorage.setItem(
      this.positionStorageKey,
      JSON.stringify({
        left: this.sidebarLeft,
        top: this.sidebarTop
      })
    );
  }

  // =========================================================
  // LOAD POSITION
  // =========================================================

  private loadSidebarPosition(): void {

    const saved =
      localStorage.getItem(
        this.positionStorageKey
      );

    // No saved position → use CSS default.
    if (!saved) {
      this.setDefaultSidebarPosition();
      return;
    }

    try {

      const position =
        JSON.parse(saved);

      if (
        typeof position.left !== 'number' ||
        typeof position.top !== 'number'
      ) {
        throw new Error(
          'Invalid sidebar position'
        );
      }

      const clamped =
        this.clampSidebarPosition(
          position.left,
          position.top
        );

      this.sidebarLeft =
        clamped.left;

      this.sidebarTop =
        clamped.top;

    } catch {

      // Remove corrupted saved position.
      localStorage.removeItem(
        this.positionStorageKey
      );

      // Restore CSS default.
      this.setDefaultSidebarPosition();
    }
  }
}
