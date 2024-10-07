import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

declare const bootstrap: any;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  slides: string[] = [
    'assets/13.jpg',
    'assets/12.jpg',
    'assets/2.jpg',
    'assets/3.jpg',
    'assets/4.jpg',
    'assets/5.jpg',
    'assets/6.jpg',
    'assets/7.jpg',
    'assets/8.jpg',
    'assets/9.jpg',
    'assets/10.jpg',
    'assets/1.jpg',
    'assets/11.jpg',
    'assets/14.jpg',
    'assets/15.jpg',
    'assets/16.jpg',
    'assets/17.jpg'
  ];

  currentSlide = 0;

  changeSlide(direction: number) {
    this.currentSlide = (this.currentSlide + direction + this.slides.length) % this.slides.length;
  }
  openModal() {
    // Use Bootstrap's JavaScript to show the modal
    const modalElement = document.getElementById('simpleModal');
    const modal = new bootstrap.Modal(modalElement!);
    modal.show();
  }

}
