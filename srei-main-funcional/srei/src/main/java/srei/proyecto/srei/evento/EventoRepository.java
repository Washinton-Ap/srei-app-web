package srei.proyecto.srei.evento;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import srei.proyecto.srei.reporte.dto.ReporteFacultadCarreraDto;
import srei.proyecto.srei.reporte.dto.ReporteFacultadCarreraDtoevento;
import srei.proyecto.srei.usuario.Usuario;

import java.util.List;

public interface EventoRepository extends JpaRepository<Evento, Long> {
    List<Evento> findByEstadoOrderByFechaAsc(EstadoAprobacion estado);

    // Pendientes por tipo (para DECANO / COORDINADOR)
    List<Evento> findByEstadoAndAmbitoOrderByFechaAsc(EstadoAprobacion estado, AmbitoEvento ambito);

    List<Evento> findByEstadoAndFacultadIgnoreCaseOrderByFechaAsc(EstadoAprobacion estado, String facultad);

    List<Evento> findByEstadoAndCarreraIgnoreCaseOrderByFechaAsc(EstadoAprobacion estado, String carrera);

    List<Evento> findByDocenteOrderByFechaDesc(Usuario docente);

    List<Evento> findByDocenteAndEstadoOrderByFechaDesc(Usuario docente, EstadoAprobacion estado);

    /* nuevo  */
    @Query(value = """
            select
                   coalesce(e.titulo,'') as evento,
                   coalesce(e.facultad,'') as facultad,
                   coalesce(e.carrera,'') as carrera,
                   count(a.id) as total
            from eventos e
            inner join asistencias a on e.id = a.evento_id
            where e.estado = 'APROBADO'
            and e.fecha <= CURRENT_DATE
            and a.confirmada = true
            group by e.titulo,e.facultad, e.carrera
            """, nativeQuery = true)
    List<ReporteFacultadCarreraDto> obtenerReporteFacultadCarrera();

    
 @Query(value = """
        select 
            e.titulo as titulo,
            e.carrera as carrera,
            count(e.id) as total
        from eventos e
        inner join asistencias a on e.id = a.evento_id
        where e.estado='APROBADO'
          and e.fecha <= current_date
        group by e.titulo, e.carrera
        """, nativeQuery = true)
    List<ReporteFacultadCarreraDtoevento> obtenerReporteFacultadCarreraPorEvento();

}
