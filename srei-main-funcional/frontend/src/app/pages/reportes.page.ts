import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReporteService,
  ReporteEventoDto,
  ReporteResumenDto,
} from '../core/services/reporte.service';
import { Chart } from 'chart.js/auto';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ChangeDetectorRef } from '@angular/core'; // para forzarlo que funcione con un solo click

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  template: `
    <div class="container">
      <div class="header-eventos">
        <div>
          <h2>Reportes del sistema</h2>
          <p>Exporta los resportes disponibles</p>
          <!-- <span *ngFor="let r of rolesUsuario" class="rol" [class.activo]="r == rolActivo">
        {{ r }}
      </span> -->
        </div>
      </div>
      <div class="kpi-grid" *ngIf="resumen">
        <div class="kpi">
          <div class="kpi-title">Total eventos</div>
          <div class="kpi-value">{{ resumen.totalEventos }}</div>
        </div>

        <div class="kpi">
          <div class="kpi-title">Registrados</div>
          <div class="kpi-value">{{ resumen.registrados }}</div>
        </div>

        <div class="kpi">
          <div class="kpi-title">Confirmados</div>
          <div class="kpi-value">{{ resumen.confirmados }}</div>
        </div>

        <div class="kpi">
          <div class="kpi-title">Comentarios</div>
          <div class="kpi-value">{{ resumen.comentarios }}</div>
        </div>
      </div>

      <div class="acciones">
        <button class="btn btn-success" (click)="exportarExcel()">
          <span class="material-icons">picture_as_pdf</span>

          Exportar Excel
        </button>

        <button class="btn btn-naranja" (click)="exportarPDF()">
          <span class="material-icons">picture_as_pdf</span>
          Exportar PDF
        </button>

        <!--<button class="btn" (click)="cargar()">Actualizar</button>-->
      </div>

      <div class="filtros">
        <div class="campo">
          <label>Reportes</label>
          <select
            class="input"
            [(ngModel)]="reporteSeleccionado"
            (change)="generarReporte(this.reporteSeleccionado ? this.reporteSeleccionado : '')"
          >
            <option [ngValue]="null" disabled>Seleccione un reporte</option>

            <option *ngFor="let r of reportesDisponibles" [ngValue]="r.codigo">
              {{ r.nombre }}
            </option>
          </select>
        </div>

        <!--
      <div class="campo">
        <label>Buscar</label>
        <input
          type="text"
          placeholder="Buscar evento..."
          [(ngModel)]="textoBusqueda"
          (change)="filtrar()"
        />
      </div>

      <div class="campo">
        <label>Fecha</label>
        <input type="date" [(ngModel)]="fechaFiltro" (change)="filtrar()" />
      </div>
-->
      </div>

      <table class="card tabla">
        <thead>
          <tr>
            <th *ngFor="let col of columnas">
              {{ formatearColumna(col) | titlecase }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let r of reportesPaginados">
            <td *ngFor="let col of columnas">
              {{ r[col] }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="paginacion">
        <button (click)="pagina = pagina - 1" [disabled]="pagina == 1">Anterior</button>

        <span>Página {{ pagina }}</span>

        <button (click)="pagina = pagina + 1" [disabled]="pagina * porPagina >= reportes.length">
          Siguiente
        </button>
      </div>

      <div class="grafico-container" *ngIf="reportes.length">
        <canvas id="graficoReporte"></canvas>
      </div>

      <div *ngIf="error" class="error">
        {{ error }}
      </div>
    </div>
  `,
})
export class ReportesPage implements OnInit {
  reportes: ReporteEventoDto[] = [];
  resumen?: ReporteResumenDto;
  error = '';

  rolesUsuario: string[] = [];
  rolActivo = '';

  reporteSeleccionado: string | null = null;

  reportesDisponibles: any[] = [];

  textoBusqueda: string = '';
  fechaFiltro = '';

  reportesOriginal: ReporteEventoDto[] = [];
  grafico?: Chart;
  pagina = 1;
  porPagina = 5;

  columnas: string[] = [];
  reportesPorRol: any = {
    ASISTENTE: [
      { nombre: 'Eventos asistidos', codigo: 'eventos_asistidos' },
      { nombre: 'Eventos comentados', codigo: 'eventos_comentados' },
      //{ nombre: 'Reporte de trivia', codigo: 'trivia' },
    ],

    DOCENTE: [
      { nombre: 'Eventos aprobados', codigo: 'aprobados' },
      { nombre: 'Eventos rechazados', codigo: 'rechazados' },
      { nombre: 'Eventos pendientes', codigo: 'pendientes' },
      { nombre: 'Número de participantes', codigo: 'carreras_eventos' },
    ],

    COORDINADOR: [
      { nombre: 'Eventos aprobados', codigo: 'aprobados' },
      { nombre: 'Eventos rechazados', codigo: 'rechazados' },
      { nombre: 'Eventos pendientes', codigo: 'pendientes' },
      { nombre: 'Número de participantes', codigo: 'carreras_eventos' },
      { nombre: 'Carreras con más eventos', codigo: 'participantes' },
    ],

    DECANO: [
      { nombre: 'Eventos aprobados', codigo: 'aprobados' },
      { nombre: 'Eventos rechazados', codigo: 'rechazados' },
      { nombre: 'Eventos pendientes', codigo: 'pendientes' },
      { nombre: 'Número de participantes', codigo: 'facultades_eventos' },
      { nombre: 'Facultad con más eventos', codigo: 'participantes' },
    ],

    ADMIN: [
      { nombre: 'Reporte de usuarios', codigo: 'usuarios' },
      { nombre: 'Comentarios censurados', codigo: 'comentarios_censurados' },
    ],
  };

  constructor(
    private reporteService: ReporteService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');

    this.rolesUsuario = roles;
    this.rolActivo = roles[0];

    this.reportesDisponibles = this.reportesPorRol[this.rolActivo] || [];

    this.cargar();
  }

  cargar() {
    this.error = '';

    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    const esDecano = roles.includes('DECANO');

    const lista$ = esDecano ? this.reporteService.decano() : this.reporteService.coordinador();

    const resumen$ = esDecano
      ? this.reporteService.resumenDecano()
      : this.reporteService.resumenCoordinador();

    /*lista$.subscribe({
      next: (data) => {
        this.reportes = data;
        this.cd.detectChanges(); // fuerza actualización de la vista
      },
      error: (e) => (this.error = e?.error?.message || 'No se pudo cargar reportes'),
    }); */

    resumen$.subscribe({
      next: (data) => {
        this.resumen = data;
        this.cd.detectChanges(); // fuerza actualización de la vista
      },
      error: (e) => (this.error = e?.error?.message || 'No se pudo generar resumen'),
    });
    this.cd.detectChanges(); // fuerza actualización de la vista
  }

  generarReporte(tipo: string) {
    this.reporteSeleccionado = tipo;
    this.error = '';

    this.reporteService.obtenerReporte(tipo).subscribe({
      next: (data) => {
        this.reportesOriginal = data;
        this.reportes = data;
        this.cd.detectChanges(); // fuerza actualización de la vista
        // detectar columnas dinámicamente
        if (data.length > 0) {
          this.columnas = Object.keys(data[0]);
          this.cd.detectChanges(); // fuerza actualización de la vista
        }

        this.cd.detectChanges();

        setTimeout(() => this.crearGrafico(), 100);
      },

      error: (e) => {
        this.error = e?.error?.message || 'No se pudo generar el reporte';
      },
    });
  }
  /*
  exportarPDF() {
    if (!this.reportes || this.reportes.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const doc = new jsPDF();

    // Obtener columnas dinámicamente
    const columnas = Object.keys(this.reportes[0]);

    // Obtener filas
    const filas = this.reportes.map((obj) => Object.values(obj));

    doc.text('Reporte: ' + this.reporteSeleccionado, 14, 15);

    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 20,
    });

    doc.save(`reporte-${this.reporteSeleccionado}.pdf`);
  }
  */

  exportarExcel() {
    if (!this.reportes || this.reportes.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(this.reportes);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      this.reporteSeleccionado ? this.reporteSeleccionado : '',
    );

    XLSX.writeFile(workbook, `reporte-${this.reporteSeleccionado}.xlsx`);
  }
  /*
  crearGrafico() {
    const labels = this.reportes.map((r) => r.titulo);
    const registrados = this.reportes.map((r) => r.registrados);
    const confirmados = this.reportes.map((r) => r.confirmados);

    if (this.grafico) {
      this.grafico.destroy();
    }

    this.grafico = new Chart('graficoReporte', {
      type: 'bar',

      data: {
        labels: labels,
        datasets: [
          {
            label: 'Registrados',
            data: registrados,
          },
          {
            label: 'Confirmados',
            data: confirmados,
          },
        ],
      },

      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: this.reporteSeleccionado ? this.reporteSeleccionado : '',
          },
        },
      },
    });
  }

  */

  crearGrafico() {
    if (!this.reportes || this.reportes.length === 0) return;

    if (this.grafico) {
      this.grafico.destroy();
    }

    const columnas = Object.keys(this.reportes[0]);

    // buscar columna para etiquetas (titulo o evento)
    const labelCol =
      columnas.find((c) => c.toLowerCase().includes('titulo')) ||
      columnas.find((c) => c.toLowerCase().includes('evento')) ||
      columnas.find((c) => typeof this.reportes[0][c] === 'string');

    // columnas numéricas
    const columnasNumericas = columnas.filter(
      (c) => typeof this.reportes[0][c] === 'number' && !c.toLowerCase().includes('id'),
    );

    if (!labelCol) return;

    const labels = this.reportes.map((r) => r[labelCol]);

    const datasets = columnasNumericas.map((col) => ({
      label: this.formatearColumna(col),
      data: this.reportes.map((r) => r[col]),
    }));

    this.grafico = new Chart('graficoReporte', {
      type: 'bar',

      data: {
        labels: labels,
        datasets: datasets,
      },

      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: this.obtenerNombreReporte(),
          },
        },
      },
    });
  }
  filtrar() {
    this.reportes = this.reportesOriginal.filter((r) => {
      const coincideTexto = r.titulo.toLowerCase().includes(this.textoBusqueda.toLowerCase());

      return coincideTexto;
    });
  }
  get reportesPaginados() {
    const inicio = (this.pagina - 1) * this.porPagina;

    return this.reportes.slice(inicio, inicio + this.porPagina);
  }

  async cargarLogo(): Promise<string> {
    const response = await fetch('/uteq.png');
    const blob = await response.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  async exportarPDF() {
    if (!this.reportes || this.reportes.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const doc = new jsPDF();
    const logo = await this.cargarLogo();

    // ===== ENCABEZADO =====
    // ===== ENCABEZADO =====

    // Fondo verde
    doc.setFillColor(11, 122, 59); // #0b7a3b
    doc.rect(0, 0, 210, 30, 'F');

    // Logo
    doc.addImage(logo, 'PNG', 10, 6, 16, 18);

    // Texto blanco
    doc.setTextColor(255, 255, 255);

    // Título principal
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Sistema de registro de eventos', 32, 14);

    // Subtítulo
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Interculturales (SREI)', 32, 22);

    // Nombre del reporte
    doc.setFontSize(11);
    doc.text(`Reporte: ${this.obtenerNombreReporte()}`, 150, 14);

    // Fecha
    const fecha = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generado: ${fecha}`, 150, 22);
    // ===== TABLA =====
    const columnasOriginal = Object.keys(this.reportes[0]).filter(
      (col) => !col.toLowerCase().includes('id'),
    );

    const columnas = columnasOriginal.map((col) => this.formatearColumna(col));

    const filas = this.reportes.map((obj) => columnasOriginal.map((col) => obj[col]));

    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 35,

      headStyles: {
        fillColor: [11, 122, 59],
        textColor: [255, 255, 255],
      },

      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });

    // ===== AGREGAR GRAFICA =====
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    if (this.grafico) {
      const graficaImagen = this.grafico.toBase64Image();

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Gráfico del reporte', 14, finalY);

      doc.addImage(graficaImagen, 'PNG', 15, finalY + 5, 180, 80);
    }

    // ===== PIE DE PAGINA =====
    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      doc.setFontSize(9);
      doc.setTextColor(100);

      doc.text('Sistema de registro de eventos interculturales', 14, 285);

      doc.text(`Página ${i} de ${pageCount}`, 180, 285);
    }

    doc.save(`reporte-${this.reporteSeleccionado}.pdf`);
  }

  formatearColumna(col: string): string {
    return col.replace(/^get/i, '').replace('_', ' ').toUpperCase();
  }

  obtenerNombreReporte(): string {
    const reporte = this.reportesDisponibles.find((r) => r.codigo === this.reporteSeleccionado);

    return reporte ? reporte.nombre : '';
  }
}
