package srei.proyecto.srei.asistencia;

import org.springframework.data.jpa.repository.JpaRepository;
import srei.proyecto.srei.evento.Evento;
import srei.proyecto.srei.usuario.Usuario;

import java.util.List;
import java.util.Optional;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {
    Optional<Asistencia> findByEventoAndAsistente(Evento evento, Usuario asistente);
    Optional<Asistencia> findByQrToken(String qrToken);
    long countByEventoAndConfirmadaIsTrue(Evento evento);
    long countByEvento(Evento evento);
    List<Asistencia> findByEvento(Evento evento);

    long countByConfirmadaIsTrue();
}
