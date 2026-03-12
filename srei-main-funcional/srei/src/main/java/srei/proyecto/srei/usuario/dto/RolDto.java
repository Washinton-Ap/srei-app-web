package srei.proyecto.srei.usuario.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import srei.proyecto.srei.usuario.RolNombre;


public record RolDto(
        Long id,
        RolNombre nombre
) {}