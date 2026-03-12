package srei.proyecto.srei.dashboard;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import srei.proyecto.srei.asistencia.AsistenciaRepository;
import srei.proyecto.srei.comentario.ComentarioRepository;
import srei.proyecto.srei.common.util.UsuarioActualService;
import srei.proyecto.srei.dashboard.dto.*;
import srei.proyecto.srei.evento.*;
import srei.proyecto.srei.usuario.RolNombre;
import srei.proyecto.srei.usuario.UsuarioRepository;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UsuarioActualService usuarioActualService;
    private final EventoRepository eventoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ComentarioRepository comentarioRepository;
    private final AsistenciaRepository asistenciaRepository;

    public DashboardDto generar() {
        var u = usuarioActualService.obtener();
        var roles = u.getRoles().stream().map(r -> r.getNombre()).collect(Collectors.toSet());

        if (roles.contains(RolNombre.ADMIN)) return dashboardAdmin();
        if (roles.contains(RolNombre.DECANO)) return dashboardDecano();
        if (roles.contains(RolNombre.COORDINADOR)) return dashboardCoordinador();
        if (roles.contains(RolNombre.DOCENTE)) return dashboardDocente();
        return dashboardAsistente();
    }

    private DashboardDto dashboardAdmin() {
        long usuarios = usuarioRepository.count();
        long deshabilitados = usuarioRepository.countByHabilitadoIsFalse();
        long comentarios = comentarioRepository.count();
        long censurados = comentarioRepository.countByCensuradoIsTrue();

        List<CardDto> cards = List.of(
                new CardDto("Usuarios", usuarios),
                new CardDto("Usuarios deshabilitados", deshabilitados),
                new CardDto("Comentarios", comentarios),
                new CardDto("Comentarios censurados", censurados)
        );

        ChartDto pie = new ChartDto(
                "pie",
                "Comentarios (visibles vs censurados)",
                List.of("Visibles", "Censurados"),
                List.of(new ChartDatasetDto("Comentarios", List.of(comentarios - censurados, censurados)))
        );
        return new DashboardDto("ADMIN", cards, List.of(pie));
    }

    private DashboardDto dashboardDocente() {
        var docente = usuarioActualService.obtener();
        long total = eventoRepository.findByDocenteOrderByFechaDesc(docente).size();
        long pendientes = eventoRepository.findByDocenteAndEstadoOrderByFechaDesc(docente, EstadoAprobacion.PENDIENTE).size();
        long aprobados = eventoRepository.findByDocenteAndEstadoOrderByFechaDesc(docente, EstadoAprobacion.APROBADO).size();
        long rechazados = eventoRepository.findByDocenteAndEstadoOrderByFechaDesc(docente, EstadoAprobacion.RECHAZADO).size();

        List<CardDto> cards = List.of(
                new CardDto("Mis eventos", total),
                new CardDto("Pendientes", pendientes),
                new CardDto("Aprobados", aprobados),
                new CardDto("Rechazados", rechazados)
        );

        ChartDto pie = new ChartDto(
                "pie",
                "Estado de mis eventos",
                List.of("Pendiente", "Aprobado", "Rechazado"),
                List.of(new ChartDatasetDto("Eventos", List.of(pendientes, aprobados, rechazados)))
        );

        ChartDto linea = serieEventosPorMes("Eventos propuestos por mes", eventoRepository.findByDocenteOrderByFechaDesc(docente));
        return new DashboardDto("DOCENTE", cards, List.of(pie, linea));
    }

    private DashboardDto dashboardDecano() {
        long pendientes = eventoRepository.findByEstadoAndAmbitoOrderByFechaAsc(EstadoAprobacion.PENDIENTE, AmbitoEvento.FACULTAD).size();
        long aprobados = eventoRepository.findByEstadoAndAmbitoOrderByFechaAsc(EstadoAprobacion.APROBADO, AmbitoEvento.FACULTAD).size();
        long rechazados = eventoRepository.findByEstadoAndAmbitoOrderByFechaAsc(EstadoAprobacion.RECHAZADO, AmbitoEvento.FACULTAD).size();

        List<CardDto> cards = List.of(
                new CardDto("Pendientes (facultad)", pendientes),
                new CardDto("Aprobados (facultad)", aprobados),
                new CardDto("Rechazados (facultad)", rechazados)
        );

        ChartDto pie = new ChartDto(
                "pie",
                "Eventos por estado (Facultad)",
                List.of("Pendiente", "Aprobado", "Rechazado"),
                List.of(new ChartDatasetDto("Eventos", List.of(pendientes, aprobados, rechazados)))
        );
        ChartDto linea = serieEventosPorMes("Aprobados por mes (Facultad)", eventoRepository.findByEstadoAndAmbitoOrderByFechaAsc(EstadoAprobacion.APROBADO, AmbitoEvento.FACULTAD));
        return new DashboardDto("DECANO", cards, List.of(pie, linea));
    }

    private DashboardDto dashboardCoordinador() {
        long pendientes = eventoRepository.findByEstadoAndAmbitoOrderByFechaAsc(EstadoAprobacion.PENDIENTE, AmbitoEvento.CARRERA).size();
        long aprobados = eventoRepository.findByEstadoAndAmbitoOrderByFechaAsc(EstadoAprobacion.APROBADO, AmbitoEvento.CARRERA).size();
        long rechazados = eventoRepository.findByEstadoAndAmbitoOrderByFechaAsc(EstadoAprobacion.RECHAZADO, AmbitoEvento.CARRERA).size();

        List<CardDto> cards = List.of(
                new CardDto("Pendientes (carrera)", pendientes),
                new CardDto("Aprobados (carrera)", aprobados),
                new CardDto("Rechazados (carrera)", rechazados)
        );

        ChartDto pie = new ChartDto(
                "pie",
                "Eventos por estado (Carrera)",
                List.of("Pendiente", "Aprobado", "Rechazado"),
                List.of(new ChartDatasetDto("Eventos", List.of(pendientes, aprobados, rechazados)))
        );
        ChartDto linea = serieEventosPorMes("Aprobados por mes (Carrera)", eventoRepository.findByEstadoAndAmbitoOrderByFechaAsc(EstadoAprobacion.APROBADO, AmbitoEvento.CARRERA));
        return new DashboardDto("COORDINADOR", cards, List.of(pie, linea));
    }

    private DashboardDto dashboardAsistente() {
        long aprobados = eventoRepository.findByEstadoOrderByFechaAsc(EstadoAprobacion.APROBADO).size();
        long asistencias = asistenciaRepository.count();
        long confirmadas = asistenciaRepository.countByConfirmadaIsTrue();
        long comentarios = comentarioRepository.count();

        List<CardDto> cards = List.of(
                new CardDto("Eventos disponibles", aprobados),
                new CardDto("Asistencias registradas", asistencias),
                new CardDto("Asistencias confirmadas", confirmadas),
                new CardDto("Comentarios", comentarios)
        );

        ChartDto pie = new ChartDto(
                "pie",
                "Asistencia (confirmadas vs no confirmadas)",
                List.of("Confirmadas", "No confirmadas"),
                List.of(new ChartDatasetDto("Asistencias", List.of(confirmadas, asistencias - confirmadas)))
        );
        return new DashboardDto("ASISTENTE", cards, List.of(pie));
    }

    private ChartDto serieEventosPorMes(String titulo, List<Evento> eventos) {
        // últimos 6 meses
        List<YearMonth> meses = new ArrayList<>();
        YearMonth actual = YearMonth.now();
        for (int i = 5; i >= 0; i--) {
            meses.add(actual.minusMonths(i));
        }

        Map<YearMonth, Long> conteo = eventos.stream()
                .filter(e -> e.getFecha() != null)
                .collect(Collectors.groupingBy(e -> YearMonth.from(e.getFecha()), Collectors.counting()));

        List<String> etiquetas = meses.stream().map(m -> m.getMonthValue() + "/" + m.getYear()).toList();
        List<Long> datos = meses.stream().map(m -> conteo.getOrDefault(m, 0L)).toList();

        return new ChartDto(
                "line",
                titulo,
                etiquetas,
                List.of(new ChartDatasetDto("Eventos", datos))
        );
    }
}
