import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardDto } from '../core/services/dashboard.service';
import { ChartComponent } from '../shared/chart.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule, ChartComponent],
  template: `
  <div class="page">
    <div class="page-header">
      <h1 style="margin:0;">Dashboard</h1>
      <p style="margin:6px 0 0; color:var(--muted);">Resumen de estadísticas.</p>
    </div>

    <div class="kpi-grid" *ngIf="dash">
      <div class="kpi" *ngFor="let c of dash.tarjetas">
        <div class="kpi-title">{{c.titulo}}</div>
        <div class="kpi-value">{{c.valor}}</div>
      </div>
    </div>

    <div class="grid-2" *ngIf="dash">
      <app-chart
        *ngFor="let g of dash.graficas"
        [tipo]="g.tipo"
        [titulo]="g.titulo"
        [etiquetas]="g.etiquetas"
        [datasets]="g.datasets">
      </app-chart>
    </div>

    <div class="card" *ngIf="error" style="border-left:4px solid #b91c1c;">
      {{error}}
    </div>
  </div>
  `
})
export class DashboardHome implements OnInit{
  dash?: DashboardDto;
  error = '';

  constructor(private dashboardService: DashboardService,private cd: ChangeDetectorRef) {
    
  }
  ngOnInit() {
    this.dashboardService.obtener().subscribe({
      next: (data) => {
      this.dash = data || [];
      this.cd.detectChanges(); // fuerza actualización de la vista
    },
      error: (e) => (this.error = e?.error?.message || 'No se pudo cargar el dashboard')
    });
     
  }
}
