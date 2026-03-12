package srei.proyecto.srei.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import srei.proyecto.srei.usuario.*;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DatosInicialesConfig {

    @Bean
    CommandLineRunner initRolesUsuarios(RolRepository rolRepository, UsuarioRepository usuarioRepository, PasswordEncoder encoder) {
        return args -> {
            for (RolNombre rn : RolNombre.values()) {
                rolRepository.findByNombre(rn).orElseGet(() -> rolRepository.save(Rol.builder().nombre(rn).build()));
            }

            crearSiNoExiste(usuarioRepository, rolRepository, encoder,
                    "admin@uteq.edu.ec", "Admin", "UTEQ", "Admin123*", RolNombre.ADMIN, null, null);

            crearSiNoExiste(usuarioRepository, rolRepository, encoder,
                    "decano@uteq.edu.ec", "Decano", "UTEQ", "Admin123*", RolNombre.DECANO, "Ciencias de la Computación", null);

            crearSiNoExiste(usuarioRepository, rolRepository, encoder,
                    "coordinador@uteq.edu.ec", "Coordinador", "UTEQ", "Admin123*", RolNombre.COORDINADOR, null, "Software");

            crearSiNoExiste(usuarioRepository, rolRepository, encoder,
                    "docente@uteq.edu.ec", "Docente", "UTEQ", "Admin123*", RolNombre.DOCENTE, "Ciencias de la Computación", "Software");

            crearSiNoExiste(usuarioRepository, rolRepository, encoder,
                    "asistente@gmail.com", "Asistente", "Invitado", "Admin123*", RolNombre.ASISTENTE, null, null);
        };
    }

    private void crearSiNoExiste(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            PasswordEncoder encoder,
            String correo,
            String nombres,
            String apellidos,
            String contrasena,
            RolNombre rolNombre,
            String facultad,
            String carrera
    ) {
        if (usuarioRepository.existsByCorreoIgnoreCase(correo)) return;

        Rol rol = rolRepository.findByNombre(rolNombre).orElseThrow();

        Usuario u = Usuario.builder()
                .correo(correo)
                .nombres(nombres)
                .apellidos(apellidos)
                .contrasenaHash(encoder.encode(contrasena))
                .habilitado(true)
                .facultad(facultad)
                .carrera(carrera)
                .roles(Set.of(rol))
                .build();

        usuarioRepository.save(u);
    }
}
