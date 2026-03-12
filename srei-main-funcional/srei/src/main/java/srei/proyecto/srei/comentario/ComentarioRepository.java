package srei.proyecto.srei.comentario;

import org.springframework.data.jpa.repository.JpaRepository;
import srei.proyecto.srei.evento.Evento;

import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    List<Comentario> findByEventoOrderByCreadoEnDesc(Evento evento);

    long countByCensuradoIsTrue();
}
