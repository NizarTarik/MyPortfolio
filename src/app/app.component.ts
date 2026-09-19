import {
  Component,
  HostListener
} from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    ChatbotComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  theme: 'light' | 'dark' = 'light';

  isSidebarCollapsed = false;

  pressedKey:
    | 'ArrowLeft'
    | 'ArrowDown'
    | 'ArrowRight'
    | null = null;

  keyboardActive = false;

  /*
   * =========================================================
   * MOUSE INTERACTION
   * =========================================================
   */

  mouseX = 0;
  mouseY = 0;

  mouseClientX = 0;
  mouseClientY = 0;

  private keyTimeout?: ReturnType<typeof setTimeout>;

  /*
   * =========================================================
   * THEME
   * =========================================================
   */

  toggleTheme(): void {
    this.theme =
      this.theme === 'light'
        ? 'dark'
        : 'light';
  }

  /*
   * =========================================================
   * MOUSE MOVEMENT
   * =========================================================
   */

  @HostListener('window:mousemove', ['$event'])
  handleMouseMove(event: MouseEvent): void {

    this.mouseClientX = event.clientX;
    this.mouseClientY = event.clientY;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    this.mouseX = event.clientX - centerX;
    this.mouseY = event.clientY - centerY;
  }

  /*
   * =========================================================
   * KEYBOARD NAVIGATION
   * =========================================================
   */

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {

    if (
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowRight'
    ) {
      return;
    }

    /*
     * Don't interfere with inputs,
     * textareas or other editable elements.
     */
    const target =
      event.target as HTMLElement | null;

    if (
      target?.tagName === 'INPUT' ||
      target?.tagName === 'TEXTAREA' ||
      target?.isContentEditable
    ) {
      return;
    }

    event.preventDefault();

    this.triggerKey(
      event.key as
      | 'ArrowLeft'
      | 'ArrowDown'
      | 'ArrowRight'
    );
  }

  /*
   * =========================================================
   * UNIFIED ARROW ACTION
   *
   * Both physical keyboard presses and mouse clicks
   * come through this same method.
   * =========================================================
   */

  triggerKey(
    key:
      | 'ArrowLeft'
      | 'ArrowDown'
      | 'ArrowRight'
  ): void {

    /*
     * Visual pressed state.
     */
    this.pressedKey = key;

    this.keyboardActive = false;

    /*
     * Restart the animation even when
     * the same key is pressed repeatedly.
     */
    requestAnimationFrame(() => {
      this.keyboardActive = true;
    });

    /*
     * Reset the visual state after the animation.
     */
    clearTimeout(this.keyTimeout);

    this.keyTimeout = setTimeout(() => {

      this.pressedKey = null;
      this.keyboardActive = false;

    }, 260);

    /*
     * =======================================================
     * ACTUAL KEY ACTION
     *
     * Dispatch a real keyboard event.
     *
     * This means a mouse click behaves exactly like
     * pressing the corresponding physical arrow key.
     * =======================================================
     */

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key,
        code: key,
        bubbles: true,
        cancelable: true
      })
    );
  }
}
