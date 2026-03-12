package srei.proyecto.srei.comentario;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import srei.proyecto.srei.comentario.dto.ComentarioCrearRequest;
import srei.proyecto.srei.comentario.dto.ComentarioDto;

import java.util.List;

@RestController
@RequestMapping("/api/comentarios")
@RequiredArgsConstructor
public class ComentarioController {

    private final ComentarioService comentarioService;

    @GetMapping("/eventos/{eventoId}")
    public ResponseEntity<List<ComentarioDto>> listar(@PathVariable Long eventoId) {
        return ResponseEntity.ok(comentarioService.listarPorEvento(eventoId));
    }

    @PostMapping("/eventos/{eventoId}")
    public ResponseEntity<ComentarioDto> crear(@PathVariable Long eventoId, @Valid @RequestBody ComentarioCrearRequest req) {
        return ResponseEntity.ok(comentarioService.crear(eventoId, req));
    }

    @PatchMapping("/{comentarioId}/censurar")
    public ResponseEntity<ComentarioDto> censurar(@PathVariable Long comentarioId, @RequestParam boolean valor) {
        return ResponseEntity.ok(comentarioService.censurar(comentarioId, valor));
    }
}
