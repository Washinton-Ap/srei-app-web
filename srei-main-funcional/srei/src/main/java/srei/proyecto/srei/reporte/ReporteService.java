package srei.proyecto.srei.reporte;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import srei.proyecto.srei.asistencia.AsistenciaRepository;
import srei.proyecto.srei.comentario.ComentarioRepository;
import srei.proyecto.srei.common.util.UsuarioActualService;
import srei.proyecto.srei.evento.*;
import srei.proyecto.srei.reporte.dto.ReporteEventoDto;
import srei.proyecto.srei.reporte.dto.ReporteResumenDto;
import srei.proyecto.srei.reporte.dto.SerieDto;
import srei.proyecto.srei.usuario.RolNombre;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final EventoRepository eventoRepository;
    private final AsistenciaRepository asistenciaRepository;
    private final ComentarioRepository comentarioRepository;
    private final UsuarioActualService usuarioActualService;

    public List<ReporteEventoDto> reportesDecano() {
        var decano = usuarioActualService.obtener();
        boolean ok = decano.getRoles().stream().anyMatch(r -> r.getNombre() == RolNombre.DECANO);
        if (!ok) throw new IllegalArgumentException("No autorizado");

        // Reportes del DECANO: eventos APROBADOS cuyo ámbito sea FACULTAD.
        // No filtramos por texto de facultad para evitar resultados vacíos por diferencias de escritura.
        return eventoRepository.findByEstadoAndAmbitoOrderByFechaAsc(EstadoAprobacion.APROBADO, AmbitoEvento.FACULTAD)
                .stream().map(this::reporteEvento).toList();
    }

    public ReporteResumenDto resumenDecano() {
        var lista = reportesDecano();
        return resumenDesde(lista);
    }

    public List<ReporteEventoDto> reportesCoordinador() {
        var coord = usuarioActualService.obtener();
        boolean ok = coord.getRoles().stream().anyMatch(r -> r.getNombre() == RolNombre.COORDINADOR);
        if (!ok) throw new IllegalArgumentException("No autorizado");

        // Reportes de COORDINADOR: eventos APROBADOS cuyo ámbito sea CARRERA.
        return eventoRepository.findByEstadoAndAmbitoOrderByFechaAsc(EstadoAprobacion.APROBADO, AmbitoEvento.CARRERA)
                .stream().map(this::reporteEvento).toList();
    }

    public ReporteResumenDto resumenCoordinador() {
        var lista = reportesCoordinador();
        return resumenDesde(lista);
    }

    private ReporteResumenDto resumenDesde(List<ReporteEventoDto> lista) {
        long totalEventos = lista.size();
        long registrados = lista.stream().mapToLong(ReporteEventoDto::registrados).sum();
        long confirmados = lista.stream().mapToLong(ReporteEventoDto::confirmados).sum();
        long comentariosVisibles = lista.stream().mapToLong(ReporteEventoDto::comentariosVisibles).sum();

        // Serie: impacto por evento (bar)
        List<String> etiquetas = lista.stream().map(ReporteEventoDto::titulo).toList();
        List<Long> impactos = lista.stream().map(ReporteEventoDto::impacto).toList();

        List<SerieDto> series = new ArrayList<>();
        series.add(new SerieDto("Impacto por evento", etiquetas, impactos));

        // Serie: registrados vs confirmados por evento
        series.add(new SerieDto("Registrados por evento", etiquetas, lista.stream().map(ReporteEventoDto::registrados).toList()));
        series.add(new SerieDto("Confirmados por evento", etiquetas, lista.stream().map(ReporteEventoDto::confirmados).toList()));

        return new ReporteResumenDto(totalEventos, registrados, confirmados, comentariosVisibles, series);
    }

    private ReporteEventoDto reporteEvento(Evento e) {
        long registrados = asistenciaRepository.countByEvento(e);
        long confirmados = asistenciaRepository.countByEventoAndConfirmadaIsTrue(e);
        long comentariosVisibles = comentarioRepository.findByEventoOrderByCreadoEnDesc(e)
                .stream().filter(c -> !c.isCensurado()).count();

        long impacto = confirmados + comentariosVisibles; // métrica simple

        return new ReporteEventoDto(e.getId(), e.getTitulo(), registrados, confirmados, comentariosVisibles, impacto);
    }
}
