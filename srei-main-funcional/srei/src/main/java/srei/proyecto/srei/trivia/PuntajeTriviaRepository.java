package srei.proyecto.srei.trivia;

import org.springframework.data.jpa.repository.JpaRepository;
import srei.proyecto.srei.evento.Evento;

import java.util.List;
import java.util.Optional;

public interface PuntajeTriviaRepository extends JpaRepository<PuntajeTrivia, Long> {
    Optional<PuntajeTrivia> findByEventoIdAndUsuarioId(Long eventoId, Long usuarioId);
    List<PuntajeTrivia> findByEventoIdOrderByPuntajeDesc(Long eventoId);
}
