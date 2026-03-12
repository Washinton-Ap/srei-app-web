package srei.proyecto.srei.usuario;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usuarios")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nombres;

    @Column(nullable = false, length = 120)
    private String apellidos;

    @Column(nullable = false, unique = true, length = 180)
    private String correo;

    @Column(nullable = false)
    private String contrasenaHash;

    @Column(nullable = false)
    private boolean habilitado = true;

    // Para filtrar aprobación/reportes
    @Column(length = 120)
    private String facultad;

    @Column(length = 120)
    private String carrera;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "usuario_roles",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "rol_id")
    )
    @Builder.Default
    private Set<Rol> roles = new HashSet<>();

    @Column(name = "creado_en", nullable = false)
    @Builder.Default
    private Instant creadoEn = Instant.now();

    @PrePersist
    public void antesDeInsertar() {
        if (creadoEn == null) creadoEn = Instant.now();
        if (roles == null) roles = new HashSet<>();
    }

}