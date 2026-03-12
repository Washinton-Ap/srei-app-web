package srei.proyecto.srei.asistencia;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import srei.proyecto.srei.asistencia.dto.QrDto;
import srei.proyecto.srei.asistencia.dto.ConfirmacionDto;

@RestController
@RequestMapping("/api/asistencias")
@RequiredArgsConstructor
public class AsistenciaController {

    private final AsistenciaService asistenciaService;

    @PostMapping("/eventos/{eventoId}/asistir")
    @PreAuthorize("hasRole('ASISTENTE')")
    public ResponseEntity<QrDto> asistir(@PathVariable Long eventoId) {
        return ResponseEntity.ok(asistenciaService.asistir(eventoId));
    }

    @GetMapping("/eventos/{eventoId}/mi-qr")
    @PreAuthorize("hasRole('ASISTENTE')")
    public ResponseEntity<QrDto> miQr(@PathVariable Long eventoId) {
        return ResponseEntity.ok(asistenciaService.miQr(eventoId));
    }

    
    @PostMapping("/confirmar-token")
    @PreAuthorize("hasRole('ASISTENTE')")
    public ResponseEntity<ConfirmacionDto> confirmarToken(@RequestBody(required = true) String token) {
        // token llega como texto, puede venir con comillas si es JSON string; limpiamos
        String limpio = token == null ? "" : token.replace("\"", "").trim();
        return ResponseEntity.ok(asistenciaService.confirmarDto(limpio));
    }

    @PostMapping("/eventos/{eventoId}/confirmar")
    @PreAuthorize("hasRole('ASISTENTE')")
    public ResponseEntity<ConfirmacionDto> confirmarMiAsistencia(@PathVariable Long eventoId) {
        return ResponseEntity.ok(asistenciaService.confirmarEventoActual(eventoId));
    }

    @GetMapping(value = "/confirmar", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> confirmar(@RequestParam String token) {
        return ResponseEntity.ok(asistenciaService.confirmar(token));
    }
}
