package srei.proyecto.srei.reporte;

import lombok.RequiredArgsConstructor;

import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import srei.proyecto.srei.asistencia.AsistenciaRepository;
import srei.proyecto.srei.comentario.ComentarioRepository;
import srei.proyecto.srei.common.util.UsuarioActualService;
import srei.proyecto.srei.evento.*;
import srei.proyecto.srei.reporte.dto.ComentarioAutorDto;
import srei.proyecto.srei.reporte.dto.ComentarioCensuradoDto;
import srei.proyecto.srei.reporte.dto.EventoAsistenciaDto;
import srei.proyecto.srei.reporte.dto.ReporteEventoDto;
import srei.proyecto.srei.reporte.dto.ReporteFacultadCarreraDto;
import srei.proyecto.srei.reporte.dto.ReporteFacultadCarreraDtoevento;
import srei.proyecto.srei.reporte.dto.ReporteFacultadEventoDto;
import srei.proyecto.srei.reporte.dto.ReporteResumenDto;
import srei.proyecto.srei.reporte.dto.SerieDto;
import srei.proyecto.srei.reporte.dto.UsuarioRolDto;
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


/*nicio  */

public List<ComentarioAutorDto> eventos_comentadosDtoListarReporte( @Param("asistenteId") Long asistenteId)  {
var coord = usuarioActualService.obtener();
boolean ok = coord.getRoles().stream()
        .anyMatch(r -> RolNombre.ADMIN.equals(r.getNombre()));
    if (!ok) throw new IllegalArgumentException("No autorizado");
    List<ComentarioAutorDto> reporte = eventoRepository.comentariosPorAutor(asistenteId);
    reporte.forEach(r -> 
        System.out.println("titulo: " + r.gettitulo() +
                           ",contenido: " + r.getcontenido() +
                           ",apellido: " + r.getapellidos() +
                           ",nombre: " + r.getnombres()
                        ));
    return reporte;
    }

public List<EventoAsistenciaDto> EventoAsistenciaDtoListarReporte( @Param("asistenteId") Long asistenteId)  {
var coord = usuarioActualService.obtener();
boolean ok = coord.getRoles().stream()
        .anyMatch(r -> RolNombre.ADMIN.equals(r.getNombre()));
    if (!ok) throw new IllegalArgumentException("No autorizado");
    List<EventoAsistenciaDto> reporte = eventoRepository.reporteEventosAsistidos(asistenteId);
    reporte.forEach(r -> 
        System.out.println("titulo: " + r.gettitulo() +
                           ",FACULTAD: " + r.getfacultad() +
                           ",CARRERA: " + r.getcarrera() +
                           ",TOTAL: " + r.gettotal()
                        ));
    return reporte;
    }
public List<ComentarioCensuradoDto> comentarios_ListarReporte()  {
var coord = usuarioActualService.obtener();
boolean ok = coord.getRoles().stream()
        .anyMatch(r -> RolNombre.ADMIN.equals(r.getNombre()));
    if (!ok) throw new IllegalArgumentException("No autorizado");
    List<ComentarioCensuradoDto> reporte = eventoRepository.listarComentariosCensurados();
    reporte.forEach(r -> 
        System.out.println("titulo: " + r.gettitulo() +
                           ",contenido: " + r.getcontenido() +
                           ",creadoEn: " + r.getcreadoEn() +
                           ",apellidos: " + r.getapellidos() +
                           ",nombres: " + r.getnombres()
                        ));
    return reporte;
    }
public List<UsuarioRolDto> usuariosListarReporte()  {

    var coord = usuarioActualService.obtener();

boolean ok = coord.getRoles().stream()
        .anyMatch(r -> RolNombre.ADMIN.equals(r.getNombre()));
    if (!ok) throw new IllegalArgumentException("No autorizado");
    List<UsuarioRolDto> reporte = eventoRepository.listarUsuariosConRol();

    reporte.forEach(r -> 
        System.out.println("apellidos: " + r.getapellidos() +
                           ",nombres: " + r.getnombres() +
                           ",rol: " + r.getrol() +
                           ",fecha: " + r.getcreadoEn() +
                           ",habilitado: " + r.gethabilitado()
                        ));
    return reporte;
    }

public List<ReporteFacultadEventoDto> facultad_eventosCoordinadorReporte()  {
  List<ReporteFacultadEventoDto> reporte = eventoRepository.obtenerReporteFacultadPorEvento();

    // Imprime cada registro en consola
    reporte.forEach(r -> 
        System.out.println(", Carrera: " + r.getfacultad() +
                           ", Total: " + r.getTotal())
    );

    return reporte;
    }


public List<ReporteFacultadCarreraDtoevento> carreras_eventosCoordinadorReporte()  {
  List<ReporteFacultadCarreraDtoevento> reporte = eventoRepository.obtenerReporteFacultadCarreraPorEvento();

    // Imprime cada registro en consola
    reporte.forEach(r -> 
        System.out.println("titulo: " + r.getevento() +
                           ", Carrera: " + r.getCarrera() +
                           ", Total: " + r.getTotal())
    );

    return reporte;
    }
public List<ReporteFacultadCarreraDto> participantesCoordinadorReporte()  {
  List<ReporteFacultadCarreraDto> reporte = eventoRepository.obtenerReporteFacultadCarrera();

    // Imprime cada registro en consola
    reporte.forEach(r -> 
        System.out.println("Facultad: " + r.getFacultad() +
                           ", Carrera: " + r.getCarrera() +
                           ", Total: " + r.getTotal())
    );

    return reporte;
    }

public List<ReporteEventoDto> AprobadosCoordinadorReporte()  {
    var coord = usuarioActualService.obtener();

boolean ok = coord.getRoles().stream()
        .anyMatch(r -> RolNombre.COORDINADOR.equals(r.getNombre()) 
                    || RolNombre.DECANO.equals(r.getNombre()) 
                    || RolNombre.DOCENTE.equals(r.getNombre()));

    if (!ok) throw new IllegalArgumentException("No autorizado");

    return eventoRepository
            .findByEstadoOrderByFechaAsc(EstadoAprobacion.APROBADO)
            .stream()
            .map(this::reporteEvento)
            .toList();
    }
    
public List<ReporteEventoDto> RerechazadosCoordinadorReporte()  {
    var coord = usuarioActualService.obtener();

   boolean ok = coord.getRoles().stream()
        .anyMatch(r -> RolNombre.COORDINADOR.equals(r.getNombre()) 
                    || RolNombre.DECANO.equals(r.getNombre()) 
                    || RolNombre.DOCENTE.equals(r.getNombre()));

    if (!ok) throw new IllegalArgumentException("No autorizado");

    return eventoRepository
            .findByEstadoOrderByFechaAsc(EstadoAprobacion.RECHAZADO)
            .stream()
            .map(this::reporteEvento)
            .toList();
    }
public List<ReporteEventoDto> PendientesCoordinadorReporte()  {
    var coord = usuarioActualService.obtener();

    boolean ok = coord.getRoles().stream()
        .anyMatch(r -> RolNombre.COORDINADOR.equals(r.getNombre()) 
                    || RolNombre.DECANO.equals(r.getNombre()) 
                    || RolNombre.DOCENTE.equals(r.getNombre()));

    if (!ok) throw new IllegalArgumentException("No autorizado");

    return eventoRepository
            .findByEstadoOrderByFechaAsc(EstadoAprobacion.PENDIENTE)
            .stream()
            .map(this::reporteEvento)
            .toList();
    }

/* fin nuvo*/

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
