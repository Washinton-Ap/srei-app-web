package srei.proyecto.srei.trivia;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import srei.proyecto.srei.trivia.dto.*;

import java.util.List;

@RestController
@RequestMapping("/api/trivia")
@RequiredArgsConstructor
public class TriviaController {

    private final TriviaService triviaService;

    @PostMapping("/eventos/{eventoId}/preguntas")
    @PreAuthorize("hasRole('DOCENTE')")
    public ResponseEntity<PreguntaDto> crearPregunta(@PathVariable Long eventoId, @Valid @RequestBody PreguntaCrearRequest req) {
        return ResponseEntity.ok(triviaService.crearPregunta(eventoId, req));
    }

    @GetMapping("/eventos/{eventoId}")
    public ResponseEntity<List<PreguntaDto>> preguntas(@PathVariable Long eventoId) {
        return ResponseEntity.ok(triviaService.preguntasPorEvento(eventoId));
    }

    @PostMapping("/eventos/{eventoId}/preguntas/{preguntaId}/responder")
    @PreAuthorize("hasRole('ASISTENTE')")
    public ResponseEntity<Integer> responder(@PathVariable Long eventoId, @PathVariable Long preguntaId, @Valid @RequestBody ResponderRequest req) {
        return ResponseEntity.ok(triviaService.responder(eventoId, preguntaId, req));
    }

    @GetMapping("/eventos/{eventoId}/ranking")
    public ResponseEntity<List<RankingItemDto>> ranking(@PathVariable Long eventoId) {
        return ResponseEntity.ok(triviaService.ranking(eventoId));
    }
}
