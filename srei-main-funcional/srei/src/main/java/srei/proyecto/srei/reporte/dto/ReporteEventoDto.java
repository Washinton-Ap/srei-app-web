package srei.proyecto.srei.reporte.dto;

public record ReporteEventoDto(
        Long eventoId,
        String titulo,
        long registrados,
        long confirmados,
        long comentariosVisibles,
        long impacto
) {
}
