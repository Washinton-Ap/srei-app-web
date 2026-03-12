package srei.proyecto.srei.evento;

import org.springframework.data.jpa.repository.JpaRepository;
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
}
