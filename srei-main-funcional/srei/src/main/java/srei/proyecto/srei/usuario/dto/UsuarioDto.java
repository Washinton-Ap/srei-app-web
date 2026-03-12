package srei.proyecto.srei.usuario.dto;

import java.util.List;

public record UsuarioDto(
        Long id,
        String nombres,
        String apellidos,
        String correo,
        boolean habilitado,
        String facultad,
        String carrera,
        List<String> roles
) {
}

