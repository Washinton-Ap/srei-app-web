import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';

export type ChartKind = 'bar' | 'line' | 'pie';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-chart',
  template: `
    <div class="card" style="padding:14px;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
        <h3 style="margin:0; font-size:16px;">{{titulo}}</h3>
      </div>
      <div style="margin-top:10px;">
        <canvas #cv></canvas>
      </div>
    </div>
  `
})
export class ChartComponent implements AfterViewInit, OnChanges {
  @Input() tipo: ChartKind = 'bar';
  @Input() titulo = '';
  @Input() etiquetas: string[] = [];
  @Input() datasets: { etiqueta: string; datos: number[] }[] = [];

  @ViewChild('cv') canvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  ngAfterViewInit(): void {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.canvas) return;
    if (changes['tipo'] || changes['etiquetas'] || changes['datasets']) {
      this.render();
    }
  }

  private render() {
    if (!this.canvas) return;
    if (this.chart) {
      this.chart.destroy();
    }

    const cfg: ChartConfiguration = {
      type: this.tipo,
      data: {
        labels: this.etiquetas,
        datasets: this.datasets.map((d) => ({
          label: d.etiqueta,
          data: d.datos
        }))
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        }
      }
    };

    this.chart = new Chart(this.canvas.nativeElement, cfg);
  }
}
