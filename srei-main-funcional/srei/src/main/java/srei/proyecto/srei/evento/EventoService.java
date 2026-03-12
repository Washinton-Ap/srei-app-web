package srei.proyecto.srei.evento;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import srei.proyecto.srei.common.util.UsuarioActualService;
import srei.proyecto.srei.evento.dto.DecisionRequest;
import srei.proyecto.srei.evento.dto.EventoDto;
import srei.proyecto.srei.usuario.RolNombre;
import srei.proyecto.srei.usuario.Usuario;

import java.time.LocalDate;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventoService {

    private final EventoRepository eventoRepository;
    private final FileStorageService fileStorageService;
    private final UsuarioActualService usuarioActualService;

    public EventoDto proponer(
            String titulo,
            String descripcion,
            LocalDate fecha,
            String lugar,
            AmbitoEvento ambito,
            String facultad,
            String carrera,
            MultipartFile imagen,
            MultipartFile informePdf
    ) {
        Usuario docente = usuarioActualService.obtener();

        if (ambito == null) throw new IllegalArgumentException("Debe indicar el ámbito");
        if (ambito == AmbitoEvento.FACULTAD && (facultad == null || facultad.isBlank())) {
            throw new IllegalArgumentException("Debe indicar facultad");
        }
        if (ambito == AmbitoEvento.CARRERA && (carrera == null || carrera.isBlank())) {
            throw new IllegalArgumentException("Debe indicar carrera");
        }

        String rutaImg = fileStorageService.guardar(imagen, "evento_img");
        String rutaPdf = fileStorageService.guardar(informePdf, "evento_informe");

        Evento e = Evento.builder()
                .titulo(titulo)
                .descripcion(descripcion)
                .fecha(fecha)
                .lugar(lugar)
                .ambito(ambito)
                .facultad(facultad)
                .carrera(carrera)
                .docente(docente)
                .estado(EstadoAprobacion.PENDIENTE)
                .rutaImagen(rutaImg)
                .rutaInformePdf(rutaPdf)
                .build();

        return toDto(eventoRepository.save(e));
    }

    public List<EventoDto> misEventos(Optional<EstadoAprobacion> estado) {
        Usuario docente = usuarioActualService.obtener();
        List<Evento> eventos = estado
                .map(s -> eventoRepository.findByDocenteAndEstadoOrderByFechaDesc(docente, s))
                .orElseGet(() -> eventoRepository.findByDocenteOrderByFechaDesc(docente));
        return eventos.stream().map(this::toDto).toList();
    }

    public EventoDto reenviar(
            Long id,
            String titulo,
            String descripcion,
            LocalDate fecha,
            String lugar,
            AmbitoEvento ambito,
            String facultad,
            String carrera,
            MultipartFile imagen,
            MultipartFile informePdf
    ) {
        Usuario docente = usuarioActualService.obtener();
        Evento e = eventoRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Evento no existe"));

        if (e.getDocente() == null || !e.getDocente().getId().equals(docente.getId())) {
            throw new IllegalArgumentException("Solo el docente creador puede reenviar el evento");
        }
        if (e.getEstado() != EstadoAprobacion.RECHAZADO) {
            throw new IllegalArgumentException("Solo puede reenviar eventos RECHAZADOS");
        }

        if (ambito == null) throw new IllegalArgumentException("Debe indicar el ámbito");
        if (ambito == AmbitoEvento.FACULTAD && (facultad == null || facultad.isBlank())) {
            throw new IllegalArgumentException("Debe indicar facultad");
        }
        if (ambito == AmbitoEvento.CARRERA && (carrera == null || carrera.isBlank())) {
            throw new IllegalArgumentException("Debe indicar carrera");
        }

        e.setTitulo(titulo);
        e.setDescripcion(descripcion);
        e.setFecha(fecha);
        e.setLugar(lugar);
        e.setAmbito(ambito);
        e.setFacultad(facultad);
        e.setCarrera(carrera);

        // Si adjunta archivos nuevos, reemplazamos.
        String rutaImg = fileStorageService.guardar(imagen, "evento_img");
        if (rutaImg != null) e.setRutaImagen(rutaImg);
        String rutaPdf = fileStorageService.guardar(informePdf, "evento_informe");
        if (rutaPdf != null) e.setRutaInformePdf(rutaPdf);

        // vuelve a flujo de aprobación
        e.setEstado(EstadoAprobacion.PENDIENTE);
        e.setAprobadoPor(null);
        // mantenemos observaciones del último rechazo para que el docente lo vea.

        return toDto(eventoRepository.save(e));
    }

    public List<EventoDto> publicos() {
        return eventoRepository.findByEstadoOrderByFechaAsc(EstadoAprobacion.APROBADO)
                .stream().map(this::toDto).toList();
    }

    public EventoDto detalle(Long id) {
        Evento e = eventoRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Evento no existe"));
        return toDto(e);
    }

    public List<EventoDto> pendientesDecano() {
        Usuario u = usuarioActualService.obtener();
        if (u.getRoles().stream().noneMatch(r -> r.getNombre() == RolNombre.DECANO)) {
            throw new IllegalArgumentException("No autorizado");
        }

        // Regla principal: DECANO aprueba eventos por FACULTAD.
        // Para evitar que no se muestren por diferencias de escritura, listamos por ámbito.
        return eventoRepository.findByEstadoAndAmbitoOrderByFechaAsc(EstadoAprobacion.PENDIENTE, AmbitoEvento.FACULTAD)
                .stream().map(this::toDto).toList();
    }

    public List<EventoDto> pendientesCoordinador() {
        Usuario u = usuarioActualService.obtener();
        if (u.getRoles().stream().noneMatch(r -> r.getNombre() == RolNombre.COORDINADOR)) {
            throw new IllegalArgumentException("No autorizado");
        }

        // Regla principal: COORDINADOR aprueba eventos por CARRERA.
        return eventoRepository.findByEstadoAndAmbitoOrderByFechaAsc(EstadoAprobacion.PENDIENTE, AmbitoEvento.CARRERA)
                .stream().map(this::toDto).toList();
    }

    public EventoDto decidir(Long eventoId, DecisionRequest req) {
        if (req.estado() == EstadoAprobacion.PENDIENTE) {
            throw new IllegalArgumentException("Estado inválido");
        }

        // Si se rechaza, la observación es obligatoria.
        if (req.estado() == EstadoAprobacion.RECHAZADO) {
            if (req.observaciones() == null || req.observaciones().isBlank()) {
                throw new IllegalArgumentException("Debe ingresar una observación/motivo del rechazo");
            }
        }

        Evento e = eventoRepository.findById(eventoId).orElseThrow(() -> new IllegalArgumentException("Evento no existe"));
        Usuario aprobador = usuarioActualService.obtener();

        boolean esDecano = aprobador.getRoles().stream().anyMatch(r -> r.getNombre() == RolNombre.DECANO);
        boolean esCoord = aprobador.getRoles().stream().anyMatch(r -> r.getNombre() == RolNombre.COORDINADOR);

        if (e.getAmbito() == AmbitoEvento.FACULTAD) {
            if (!esDecano) throw new IllegalArgumentException("Solo DECANO puede aprobar eventos por FACULTAD");
        }
        if (e.getAmbito() == AmbitoEvento.CARRERA) {
            if (!esCoord) throw new IllegalArgumentException("Solo COORDINADOR puede aprobar eventos por CARRERA");
        }

        e.setEstado(req.estado());
        e.setObservaciones(req.observaciones());
        e.setAprobadoPor(aprobador);

        return toDto(eventoRepository.save(e));
    }

    private EventoDto toDto(Evento e) {
        return new EventoDto(
                e.getId(),
                e.getTitulo(),
                e.getDescripcion(),
                e.getFecha(),
                e.getLugar(),
                e.getAmbito(),
                e.getFacultad(),
                e.getCarrera(),
                e.getEstado(),
                e.getObservaciones(),
                e.getDocente() == null ? null : e.getDocente().getCorreo(),
                e.getRutaImagen(),
                e.getRutaInformePdf()
        );
    }


    public ResponseEntity<byte[]> verImagen(Long id) {
        Evento e = eventoRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Evento no existe"));
        if (e.getRutaImagen() == null || e.getRutaImagen().isBlank()) {
            throw new IllegalArgumentException("El evento no tiene imagen");
        }
        try {
            Path p = Path.of(e.getRutaImagen());
            byte[] bytes = Files.readAllBytes(p);
            MediaType tipo = MediaType.IMAGE_PNG;
            String lower = p.getFileName().toString().toLowerCase();
            if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) tipo = MediaType.IMAGE_JPEG;
            else if (lower.endsWith(".gif")) tipo = MediaType.IMAGE_GIF;
            return ResponseEntity.ok()
                    .contentType(tipo)
                    .body(bytes);
        } catch (Exception ex) {
            throw new IllegalArgumentException("No se pudo leer la imagen");
        }
    }

    public ResponseEntity<byte[]> verInforme(Long id) {
        Evento e = eventoRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Evento no existe"));
        if (e.getRutaInformePdf() == null || e.getRutaInformePdf().isBlank()) {
            throw new IllegalArgumentException("El evento no tiene informe");
        }
        try {
            Path p = Path.of(e.getRutaInformePdf());
            byte[] bytes = Files.readAllBytes(p);
            String nombre = p.getFileName().toString();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + nombre)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(bytes);
        } catch (Exception ex) {
            throw new IllegalArgumentException("No se pudo leer el informe");
        }
    }

}
