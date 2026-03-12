package srei.proyecto.srei.evento.dto;

import srei.proyecto.srei.evento.AmbitoEvento;
import srei.proyecto.srei.evento.EstadoAprobacion;

import java.time.LocalDate;

public record EventoDto(
        Long id,
        String titulo,
        String descripcion,
        LocalDate fecha,
        String lugar,
        AmbitoEvento ambito,
        String facultad,
        String carrera,
        EstadoAprobacion estado,
        String observaciones,
        String docenteCorreo,
        String rutaImagen,
        String rutaInformePdf
) {
}
