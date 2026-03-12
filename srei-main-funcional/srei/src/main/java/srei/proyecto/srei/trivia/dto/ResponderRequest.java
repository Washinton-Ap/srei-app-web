package srei.proyecto.srei.trivia.dto;

import jakarta.validation.constraints.NotNull;

public record ResponderRequest(
        @NotNull Integer indiceSeleccionado
) {
}
