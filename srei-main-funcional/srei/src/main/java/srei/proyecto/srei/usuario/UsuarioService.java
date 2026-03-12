package srei.proyecto.srei.usuario;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import srei.proyecto.srei.usuario.dto.RolDto;
import srei.proyecto.srei.usuario.dto.UsuarioCrearRequest;
import srei.proyecto.srei.usuario.dto.UsuarioDto;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder encoder;

    public List<UsuarioDto> listar() {
        return usuarioRepository.findAll().stream().map(this::toDto).toList();
    }

    public UsuarioDto crear(UsuarioCrearRequest req) {
        if (usuarioRepository.existsByCorreoIgnoreCase(req.correo())) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }

        RolNombre rolNombre = req.rol() == null ? RolNombre.ASISTENTE : req.rol();
        Rol rol = rolRepository.findByNombre(rolNombre).orElseThrow();

        Usuario u = Usuario.builder()
                .nombres(req.nombres())
                .apellidos(req.apellidos())
                .correo(req.correo())
                .contrasenaHash(encoder.encode(req.contrasena()))
                .habilitado(true)
                .facultad(req.facultad())
                .carrera(req.carrera())
                .roles(Set.of(rol))
                .build();

        return toDto(usuarioRepository.save(u));
    }

    public UsuarioDto setHabilitado(Long id, boolean valor) {
        Usuario u = usuarioRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Usuario no existe"));
        u.setHabilitado(valor);
        return toDto(usuarioRepository.save(u));
    }

    public UsuarioDto asignarRol(Long id, RolNombre rolNombre) {
        Usuario u = usuarioRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Usuario no existe"));
        Rol rol = rolRepository.findByNombre(rolNombre).orElseThrow(() -> new IllegalArgumentException("Rol no existe"));
        u.getRoles().add(rol);
        return toDto(usuarioRepository.save(u));
    }

    private UsuarioDto toDto(Usuario u) {
        return new UsuarioDto(
                u.getId(),
                u.getNombres(),
                u.getApellidos(),
                u.getCorreo(),
                u.isHabilitado(),
                u.getFacultad(),
                u.getCarrera(),
                u.getRoles().stream().map(r -> r.getNombre().name()).toList()
        );
    }

    public List<RolDto> listarRol() {
        return rolRepository.findAll().stream().map(this::RtoDto).toList();
    }
    
    private RolDto RtoDto(Rol r) {
        return new RolDto(
                r.getId(),
                r.getNombre()
        );
    }

}
