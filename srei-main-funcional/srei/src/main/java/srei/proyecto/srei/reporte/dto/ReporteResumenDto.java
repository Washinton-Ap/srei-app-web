package srei.proyecto.srei.reporte.dto;

import java.util.List;

public record ReporteResumenDto(
        long totalEventos,
        long registrados,
        long confirmados,
        long comentarios,
        List<SerieDto> series
) {}
