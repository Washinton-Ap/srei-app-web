package srei.proyecto.srei.comentario.dto;

import jakarta.validation.constraints.NotBlank;

public record ComentarioCrearRequest(
        @NotBlank String contenido
) {
}
