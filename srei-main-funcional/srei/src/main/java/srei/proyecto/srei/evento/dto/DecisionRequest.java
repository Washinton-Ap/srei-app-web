package srei.proyecto.srei.evento.dto;

import jakarta.validation.constraints.NotNull;
import srei.proyecto.srei.evento.EstadoAprobacion;

public record DecisionRequest(
        @NotNull EstadoAprobacion estado,
        String observaciones
) {
}
