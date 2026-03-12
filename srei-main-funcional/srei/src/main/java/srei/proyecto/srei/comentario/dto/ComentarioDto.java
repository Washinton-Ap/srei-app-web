package srei.proyecto.srei.comentario.dto;

import java.time.Instant;

public record ComentarioDto(
        Long id,
        Long eventoId,
        String autorCorreo,
        String contenido,
        boolean censurado,
        Instant creadoEn
) {
}
