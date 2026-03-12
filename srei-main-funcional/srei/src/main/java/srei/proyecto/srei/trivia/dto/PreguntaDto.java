package srei.proyecto.srei.trivia.dto;

import java.util.List;

public record PreguntaDto(
        Long id,
        String enunciado,
        List<String> opciones
) {
}
