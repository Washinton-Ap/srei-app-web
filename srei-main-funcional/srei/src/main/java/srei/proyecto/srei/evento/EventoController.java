package srei.proyecto.srei.evento;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import srei.proyecto.srei.evento.dto.DecisionRequest;
import srei.proyecto.srei.evento.dto.EventoDto;

import java.io.ByteArrayOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/eventos")
@RequiredArgsConstructor
public class EventoController {

    private final EventoService eventoService;

    @GetMapping("/publicos")
    public ResponseEntity<List<EventoDto>> publicos() {
        return ResponseEntity.ok(eventoService.publicos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoDto> detalle(@PathVariable Long id) {
        return ResponseEntity.ok(eventoService.detalle(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('DOCENTE')")
    public ResponseEntity<EventoDto> proponer(
            @RequestParam String titulo,
            @RequestParam String descripcion,
            @RequestParam String fecha,
            @RequestParam String lugar,
            @RequestParam AmbitoEvento ambito,
            @RequestParam(required = false) String facultad,
            @RequestParam(required = false) String carrera,
            @RequestPart(required = false) MultipartFile imagen,
            @RequestPart(required = false) MultipartFile informePdf
    ) {
        return ResponseEntity.ok(eventoService.proponer(
                titulo,
                descripcion,
                parseFecha(fecha),
                lugar,
                ambito,
                facultad,
                carrera,
                imagen,
                informePdf
        ));
    }

    private LocalDate parseFecha(String fecha) {
        if (fecha == null || fecha.isBlank()) {
            throw new IllegalArgumentException("Debe indicar la fecha");
        }
        // Soporta formatos comunes: 2026-02-28 (input type=date) y 28/02/2026
        try {
            return LocalDate.parse(fecha); // ISO yyyy-MM-dd
        } catch (DateTimeParseException ignored) {
            try {
                return LocalDate.parse(fecha, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            } catch (DateTimeParseException ex) {
                throw new IllegalArgumentException("Fecha inválida. Use AAAA-MM-DD");
            }
        }
    }

    @GetMapping("/pendientes/decano")
    @PreAuthorize("hasRole('DECANO')")
    public ResponseEntity<List<EventoDto>> pendientesDecano() {
        return ResponseEntity.ok(eventoService.pendientesDecano());
    }

    @GetMapping("/pendientes/coordinador")
    @PreAuthorize("hasRole('COORDINADOR')")
    public ResponseEntity<List<EventoDto>> pendientesCoordinador() {
        return ResponseEntity.ok(eventoService.pendientesCoordinador());
    }

    @PostMapping("/{id}/decision")
    @PreAuthorize("hasAnyRole('DECANO','COORDINADOR')")
    public ResponseEntity<EventoDto> decision(@PathVariable Long id, @Valid @RequestBody DecisionRequest req) {
        return ResponseEntity.ok(eventoService.decidir(id, req));
    }

    // DOCENTE: listar sus eventos (incluye RECHAZADO para reenviar)
    @GetMapping("/mios")
    @PreAuthorize("hasRole('DOCENTE')")
    public ResponseEntity<List<EventoDto>> misEventos(@RequestParam(required = false) EstadoAprobacion estado) {
        return ResponseEntity.ok(eventoService.misEventos(Optional.ofNullable(estado)));
    }

    // DOCENTE: reenviar evento rechazado (vuelve a PENDIENTE). Permite actualizar datos y archivos.
    @PutMapping(value = "/{id}/reenviar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('DOCENTE')")
    public ResponseEntity<EventoDto> reenviar(
            @PathVariable Long id,
            @RequestParam String titulo,
            @RequestParam String descripcion,
            @RequestParam String fecha,
            @RequestParam String lugar,
            @RequestParam AmbitoEvento ambito,
            @RequestParam(required = false) String facultad,
            @RequestParam(required = false) String carrera,
            @RequestPart(required = false) MultipartFile imagen,
            @RequestPart(required = false) MultipartFile informePdf
    ) {
        return ResponseEntity.ok(eventoService.reenviar(
                id,
                titulo,
                descripcion,
                parseFecha(fecha),
                lugar,
                ambito,
                facultad,
                carrera,
                imagen,
                informePdf
        ));
    }

    
    @GetMapping("/{id}/imagen")
    @PreAuthorize("hasAnyRole('ASISTENTE','DOCENTE','COORDINADOR','DECANO','ADMIN')")
    public ResponseEntity<byte[]> verImagen(@PathVariable Long id) {
        return eventoService.verImagen(id);
    }

    @GetMapping("/{id}/informe")
    @PreAuthorize("hasAnyRole('COORDINADOR','DECANO','ADMIN')")
    public ResponseEntity<byte[]> verInforme(@PathVariable Long id) {
        return eventoService.verInforme(id);
    }

@GetMapping("/plantilla-informe")
    public ResponseEntity<byte[]> plantillaPdf() {
        try (PDDocument doc = new PDDocument(); ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                cs.beginText();
                cs.setFont(PDType1Font.HELVETICA_BOLD, 16);
                cs.newLineAtOffset(72, 770);
                cs.showText("SREI - Plantilla de Informe de Evento");
                cs.endText();

                cs.beginText();
                cs.setFont(PDType1Font.HELVETICA, 12);
                cs.newLineAtOffset(72, 735);
                cs.showText("1) Título del evento:");
                cs.newLineAtOffset(0, -18);
                cs.showText("2) Descripción:");
                cs.newLineAtOffset(0, -18);
                cs.showText("3) Fecha y lugar:");
                cs.newLineAtOffset(0, -18);
                cs.showText("4) Responsables/Participantes:");
                cs.newLineAtOffset(0, -18);
                cs.showText("5) Evidencias (imágenes/links):");
                cs.newLineAtOffset(0, -18);
                cs.showText("6) Resultados e impacto:");
                cs.newLineAtOffset(0, -18);
                cs.showText("7) Conclusiones:");
                cs.endText();
            }

            doc.save(baos);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=plantilla_informe_srei.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(baos.toByteArray());
        } catch (Exception e) {
            throw new IllegalArgumentException("No se pudo generar plantilla");
        }
    }

    

}
