package srei.proyecto.srei.reporte;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import srei.proyecto.srei.reporte.dto.ReporteEventoDto;
import srei.proyecto.srei.reporte.dto.ReporteFacultadCarreraDto;
import srei.proyecto.srei.reporte.dto.ReporteFacultadCarreraDtoevento;
import srei.proyecto.srei.reporte.dto.ReporteResumenDto;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteService reporteService;

    @GetMapping("/decano")
    @PreAuthorize("hasRole('DECANO')")
    public ResponseEntity<List<ReporteEventoDto>> decano() {
        return ResponseEntity.ok(reporteService.reportesDecano());
    }

    @GetMapping("/decano/resumen")
    @PreAuthorize("hasRole('DECANO')")
    public ResponseEntity<ReporteResumenDto> resumenDecano() {
        return ResponseEntity.ok(reporteService.resumenDecano());
    }

    @GetMapping("/coordinador")
    @PreAuthorize("hasRole('COORDINADOR')")
    public ResponseEntity<List<ReporteEventoDto>> coordinador() {
        return ResponseEntity.ok(reporteService.reportesCoordinador());
    }

    @GetMapping("/coordinador/resumen")
    @PreAuthorize("hasRole('COORDINADOR')")
    public ResponseEntity<ReporteResumenDto> resumenCoordinador() {
        return ResponseEntity.ok(reporteService.resumenCoordinador());
    }
     /*nuevo */

    @GetMapping("/aprobados")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('DECANO') or hasRole('DOCENTE')")
    public ResponseEntity<List<ReporteEventoDto>> aprobadosCoordinador() {
        return ResponseEntity.ok(reporteService.AprobadosCoordinadorReporte());
    }

    @GetMapping("/rechazados")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('DECANO') or hasRole('DOCENTE')")
    public ResponseEntity<List<ReporteEventoDto>> rechazadosCoordinador() {
        return ResponseEntity.ok(reporteService.RerechazadosCoordinadorReporte());
    }
    
    @GetMapping("/pendientes")
     @PreAuthorize("hasRole('COORDINADOR') or hasRole('DECANO') or hasRole('DOCENTE')")
    public ResponseEntity<List<ReporteEventoDto>> pendientesCoordinador() {
        return ResponseEntity.ok(reporteService.PendientesCoordinadorReporte());
    }

    @GetMapping("/participantes")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('DECANO') or hasRole('DOCENTE')")
    public ResponseEntity<List<ReporteFacultadCarreraDto>> participantesCoordinador() {
        return ResponseEntity.ok(reporteService.participantesCoordinadorReporte());
    }
    
    @GetMapping("/carreras_eventos")
    @PreAuthorize("hasRole('COORDINADOR')")
    public ResponseEntity<List<ReporteFacultadCarreraDtoevento>> carreras_eventosCoordinador() {
        return ResponseEntity.ok(reporteService.carreras_eventosCoordinadorReporte());
    }

}
