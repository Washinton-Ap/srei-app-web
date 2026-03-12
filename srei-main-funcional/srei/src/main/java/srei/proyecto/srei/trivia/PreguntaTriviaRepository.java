package srei.proyecto.srei.trivia;

import org.springframework.data.jpa.repository.JpaRepository;
import srei.proyecto.srei.evento.Evento;

import java.util.List;

public interface PreguntaTriviaRepository extends JpaRepository<PreguntaTrivia, Long> {
    List<PreguntaTrivia> findByEventoOrderByIdAsc(Evento evento);
}
