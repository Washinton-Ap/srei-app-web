package srei.proyecto.srei.comentario;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import srei.proyecto.srei.comentario.dto.ComentarioCrearRequest;
import srei.proyecto.srei.comentario.dto.ComentarioDto;
import srei.proyecto.srei.common.util.UsuarioActualService;
import srei.proyecto.srei.evento.EventoRepository;
import srei.proyecto.srei.usuario.RolNombre;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComentarioService {

    private final ComentarioRepository comentarioRepository;
    private final EventoRepository eventoRepository;
    private final UsuarioActualService usuarioActualService;

    public List<ComentarioDto> listarPorEvento(Long eventoId) {
        var evento = eventoRepository.findById(eventoId).orElseThrow(() -> new IllegalArgumentException("Evento no existe"));
        return comentarioRepository.findByEventoOrderByCreadoEnDesc(evento)
                .stream().map(this::toDto).toList();
    }

    public ComentarioDto crear(Long eventoId, ComentarioCrearRequest req) {
        var usuario = usuarioActualService.obtener();
        var evento = eventoRepository.findById(eventoId).orElseThrow(() -> new IllegalArgumentException("Evento no existe"));

        Comentario c = Comentario.builder()
                .evento(evento)
                .autor(usuario)
                .contenido(req.contenido())
                .censurado(false)
                .build();

        return toDto(comentarioRepository.save(c));
    }

    public ComentarioDto censurar(Long comentarioId, boolean valor) {
        var usuario = usuarioActualService.obtener();
        boolean esAdmin = usuario.getRoles().stream().anyMatch(r -> r.getNombre() == RolNombre.ADMIN);
        if (!esAdmin) throw new IllegalArgumentException("Solo ADMIN puede censurar");

        Comentario c = comentarioRepository.findById(comentarioId)
                .orElseThrow(() -> new IllegalArgumentException("Comentario no existe"));
        c.setCensurado(valor);
        return toDto(comentarioRepository.save(c));
    }

    private ComentarioDto toDto(Comentario c) {
        return new ComentarioDto(
                c.getId(),
                c.getEvento().getId(),
                c.getAutor().getCorreo(),
                c.isCensurado() ? "[CENSURADO]" : c.getContenido(),
                c.isCensurado(),
                c.getCreadoEn()
        );
    }
}
