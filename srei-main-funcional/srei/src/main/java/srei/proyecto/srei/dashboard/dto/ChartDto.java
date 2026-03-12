package srei.proyecto.srei.dashboard.dto;

import java.util.List;

/**
 * type: bar | line | pie
 */
public record ChartDto(
        String tipo,
        String titulo,
        List<String> etiquetas,
        List<ChartDatasetDto> datasets
) {}
