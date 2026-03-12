package srei.proyecto.srei.reporte.dto;

import java.util.List;

public record SerieDto(
        String titulo,
        List<String> etiquetas,
        List<Long> valores
) {}
