import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-title>Generar imagen con IA</ion-title>
      <ion-buttons slot="end">
        <ion-button (click)="cerrar()">Cerrar</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">

    <p>Describe la imagen que deseas</p>

    <textarea class="input" [(ngModel)]="prompt"></textarea>

    <button (click)="generar()">Generar</button>

    <div *ngIf="imagen">
      <img [src]="imagen" style="width:100%">
    </div>

  </ion-content>
  `
})
export class IaImagenModalComponent {

  prompt = '';
  imagen: string | null = null;

  constructor(private modalCtrl: ModalController) {}

  cerrar() {
    this.modalCtrl.dismiss();
  }

  generar() {
    // aquí luego llamas a tu API IA
  }
}