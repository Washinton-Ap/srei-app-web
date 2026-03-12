package srei.proyecto.srei.asistencia;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import srei.proyecto.srei.asistencia.dto.QrDto;
import srei.proyecto.srei.asistencia.dto.ConfirmacionDto;
import srei.proyecto.srei.common.util.UsuarioActualService;
import srei.proyecto.srei.evento.EstadoAprobacion;
import srei.proyecto.srei.evento.Evento;
import srei.proyecto.srei.evento.EventoRepository;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AsistenciaService {

    private final AsistenciaRepository asistenciaRepository;
    private final EventoRepository eventoRepository;
    private final UsuarioActualService usuarioActualService;
    private final QrService qrService;

    public QrDto asistir(Long eventoId) {
        Evento evento = eventoRepository.findById(eventoId).orElseThrow(() -> new IllegalArgumentException("Evento no existe"));
        if (evento.getEstado() != EstadoAprobacion.APROBADO) {
            throw new IllegalArgumentException("Solo puedes asistir a eventos aprobados");
        }

        var asistente = usuarioActualService.obtener();

        Asistencia asistencia = asistenciaRepository.findByEventoAndAsistente(evento, asistente)
                .orElseGet(() -> {
                    Asistencia a = Asistencia.builder()
                            .evento(evento)
                            .asistente(asistente)
                            .qrToken(UUID.randomUUID().toString())
                            .confirmada(false)
                            .build();
                    return asistenciaRepository.save(a);
                });

        String urlConfirmacion = "http://localhost:8080/api/asistencias/confirmar?token=" + asistencia.getQrToken();
        String png = qrService.generarPngBase64(urlConfirmacion);
        return new QrDto(asistencia.getQrToken(), png);
    }

    public QrDto miQr(Long eventoId) {
        Evento evento = eventoRepository.findById(eventoId).orElseThrow(() -> new IllegalArgumentException("Evento no existe"));
        var asistente = usuarioActualService.obtener();

        Asistencia asistencia = asistenciaRepository.findByEventoAndAsistente(evento, asistente)
                .orElseThrow(() -> new IllegalArgumentException("No estás registrado en este evento"));

        String urlConfirmacion = "http://localhost:8080/api/asistencias/confirmar?token=" + asistencia.getQrToken();
        String png = qrService.generarPngBase64(urlConfirmacion);
        return new QrDto(asistencia.getQrToken(), png);
    }

    public String confirmar(String token) {
        Asistencia a = asistenciaRepository.findByQrToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token inválido"));
        if (a.isConfirmada()) {
            return "Asistencia ya confirmada";
        }
        a.setConfirmada(true);
        a.setConfirmadoEn(Instant.now());
        asistenciaRepository.save(a);
        return "Asistencia confirmada";
    }


    public ConfirmacionDto confirmarDto(String token) {
        try {
            String msg = confirmar(token);
            return new ConfirmacionDto(true, msg);
        } catch (Exception e) {
            return new ConfirmacionDto(false, e.getMessage());
        }
    }

    public ConfirmacionDto confirmarEventoActual(Long eventoId) {
        Evento evento = eventoRepository.findById(eventoId).orElseThrow(() -> new IllegalArgumentException("Evento no existe"));
        var asistente = usuarioActualService.obtener();
        Asistencia a = asistenciaRepository.findByEventoAndAsistente(evento, asistente)
                .orElseThrow(() -> new IllegalArgumentException("No estás registrado en este evento"));
        if (a.isConfirmada()) {
            return new ConfirmacionDto(true, "Asistencia ya confirmada");
        }
        a.setConfirmada(true);
        a.setConfirmadoEn(Instant.now());
        asistenciaRepository.save(a);
        return new ConfirmacionDto(true, "Asistencia confirmada");
    }

}
