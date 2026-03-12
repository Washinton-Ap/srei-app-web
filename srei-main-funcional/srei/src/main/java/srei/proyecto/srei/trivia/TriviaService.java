package srei.proyecto.srei.trivia;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import srei.proyecto.srei.common.util.UsuarioActualService;
import srei.proyecto.srei.evento.EventoRepository;
import srei.proyecto.srei.trivia.dto.*;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TriviaService {

    private final EventoRepository eventoRepository;
    private final PreguntaTriviaRepository preguntaRepo;
    private final PuntajeTriviaRepository puntajeRepo;
    private final UsuarioActualService usuarioActualService;

    public PreguntaDto crearPregunta(Long eventoId, PreguntaCrearRequest req) {
        var evento = eventoRepository.findById(eventoId).orElseThrow(() -> new IllegalArgumentException("Evento no existe"));
        var usuario = usuarioActualService.obtener();
        if (!evento.getDocente().getId().equals(usuario.getId())) {
            throw new IllegalArgumentException("Solo el docente creador puede agregar trivia");
        }
        if (req.indiceCorrecto() < 0 || req.indiceCorrecto() >= req.opciones().size()) {
            throw new IllegalArgumentException("Indice correcto inválido");
        }

        PreguntaTrivia p = PreguntaTrivia.builder()
                .evento(evento)
                .enunciado(req.enunciado())
                .opciones(req.opciones())
                .indiceCorrecto(req.indiceCorrecto())
                .build();

        PreguntaTrivia guardada = preguntaRepo.save(p);
        return new PreguntaDto(guardada.getId(), guardada.getEnunciado(), guardada.getOpciones());
    }

    public List<PreguntaDto> preguntasPorEvento(Long eventoId) {
        var evento = eventoRepository.findById(eventoId).orElseThrow(() -> new IllegalArgumentException("Evento no existe"));
        return preguntaRepo.findByEventoOrderByIdAsc(evento)
                .stream().map(p -> new PreguntaDto(p.getId(), p.getEnunciado(), p.getOpciones()))
                .toList();
    }

    public int responder(Long eventoId, Long preguntaId, ResponderRequest req) {
        var evento = eventoRepository.findById(eventoId).orElseThrow(() -> new IllegalArgumentException("Evento no existe"));
        PreguntaTrivia pregunta = preguntaRepo.findById(preguntaId)
                .orElseThrow(() -> new IllegalArgumentException("Pregunta no existe"));

        if (!pregunta.getEvento().getId().equals(evento.getId())) {
            throw new IllegalArgumentException("Pregunta no pertenece al evento");
        }

        int puntos = (req.indiceSeleccionado() != null && req.indiceSeleccionado() == pregunta.getIndiceCorrecto()) ? 10 : 0;

        var usuario = usuarioActualService.obtener();
        PuntajeTrivia pt = puntajeRepo.findByEventoIdAndUsuarioId(eventoId, usuario.getId())
                .orElseGet(() -> PuntajeTrivia.builder().evento(evento).usuario(usuario).puntaje(0).build());

        pt.setPuntaje(pt.getPuntaje() + puntos);
        puntajeRepo.save(pt);

        return puntos;
    }

    public List<RankingItemDto> ranking(Long eventoId) {
        return puntajeRepo.findByEventoIdOrderByPuntajeDesc(eventoId).stream()
                .map(p -> new RankingItemDto(
                        p.getUsuario().getCorreo(),
                        p.getUsuario().getNombres(),
                        p.getUsuario().getApellidos(),
                        p.getPuntaje()
                ))
                .toList();
    }
}
