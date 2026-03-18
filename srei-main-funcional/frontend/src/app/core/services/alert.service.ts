import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // ✅ ÉXITO
  success(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: message,
      timer: 2000,
      showConfirmButton: false
    });
  }

  // ❌ ERROR
  error(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    });
  }

  // ⚠️ ADVERTENCIA
  warning(message: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: message
    });
  }

  // ℹ️ INFO
  info(message: string) {
    Swal.fire({
      icon: 'info',
      title: 'Información',
      text: message
    });
  }

  // ❓ CONFIRMACIÓN
  confirm(message: string): Promise<boolean> {
    return Swal.fire({
      title: 'Confirmación',
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      confirmButtonColor: '#16a34a', // verde institucional
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then(result => result.isConfirmed);
  }

  // 🔄 LOADING
  loading(message: string = 'Procesando...') {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  // ❌ CERRAR LOADING
  close() {
    Swal.close();
  }

}