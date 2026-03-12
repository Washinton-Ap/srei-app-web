package srei.proyecto.srei.reporte;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import srei.proyecto.srei.reporte.dto.ReporteEventoDto;
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
}
