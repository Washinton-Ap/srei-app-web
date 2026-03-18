package srei.proyecto.srei.evento;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import srei.proyecto.srei.reporte.dto.ComentarioAutorDto;
import srei.proyecto.srei.reporte.dto.ComentarioCensuradoDto;
import srei.proyecto.srei.reporte.dto.EventoAsistenciaDto;
import srei.proyecto.srei.reporte.dto.ReporteFacultadCarreraDto;
import srei.proyecto.srei.reporte.dto.ReporteFacultadCarreraDtoevento;
import srei.proyecto.srei.reporte.dto.ReporteFacultadEventoDto;
import srei.proyecto.srei.reporte.dto.UsuarioRolDto;
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
            e.carrera as carrera,
            count(e.id) as total
        from eventos e
        inner join asistencias a on e.id = a.evento_id
        where e.estado='APROBADO'
          and e.fecha <= current_date
        group by e.titulo, e.carrera
        """, nativeQuery = true)
    List<ReporteFacultadCarreraDtoevento> obtenerReporteFacultadCarreraPorEvento();

@Query(value = """
        select 
            e.facultad as facultad,
            count(e.id) as total
        from eventos e
        inner join asistencias a on e.id = a.evento_id
        where e.estado='APROBADO'
          and e.fecha <= current_date
        group by e.titulo, e.facultad
        """, nativeQuery = true)
    List<ReporteFacultadEventoDto> obtenerReporteFacultadPorEvento();

      @Query(value = """
        select 
            u.id as id,
            coalesce(u.apellidos,'') as apellidos,
            coalesce(u.nombres,'') as nombres,
            coalesce(r.nombre,'') as rol,
            coalesce(u.carrera,'') as carrera,
            coalesce(u.contrasena_hash,'') as contrasenaHash,
            coalesce(u.correo,'') as correo,
            to_char(u.creado_en, 'YYYY-MM-DD HH24:MI:SS') as creadoEn,
            coalesce(u.facultad,'') as facultad,
            u.habilitado as habilitado
        from usuarios u
        inner join usuario_roles ur on u.id = ur.usuario_id
        inner join roles r on r.id = ur.rol_id
        """, nativeQuery = true)
    List<UsuarioRolDto> listarUsuariosConRol();

     @Query(value = """
        select 
             coalesce(e.titulo,'') as titulo,
             coalesce(c.contenido,'') as contenido,
            to_char(c.creado_en, 'YYYY-MM-DD HH24:MI:SS') as creadoEn,
             coalesce(u.apellidos,'') as apellidos,
             coalesce(u.nombres,'') as nombres
        from comentarios c
        inner join eventos e on c.evento_id = e.id
        inner join usuarios u on u.id = c.autor_id
        where c.censurado = true
        """, nativeQuery = true)
    List<ComentarioCensuradoDto> listarComentariosCensurados();

    /*--eventos_asistidos */
    @Query(value = """
        select 
            e.titulo as titulo,
            e.facultad as facultad,
            e.carrera as carrera,
            count(a.confirmada) as total
        from eventos e
        inner join asistencias a on e.id = a.evento_id
        where a.asistente_id = :asistenteId
        and a.confirmada = true
        group by e.titulo, e.facultad, e.carrera
        """, nativeQuery = true)
List<EventoAsistenciaDto> reporteEventosAsistidos(Long asistenteId);

      /*--eventos_comentados*/

@Query(value = """
        select 
            e.titulo as titulo,
            c.contenido as contenido,
            to_char(c.creado_en, 'YYYY-MM-DD HH24:MI:SS') as creadoEn,
            u.apellidos as apellidos,
            u.nombres as nombres
        from comentarios c
        inner join eventos e on c.evento_id = e.id
        inner join usuarios u on u.id = c.autor_id
        where c.autor_id = :autorId
        """, nativeQuery = true)
List<ComentarioAutorDto> comentariosPorAutor(
        @Param("autorId") Long autorId
);

    

}
