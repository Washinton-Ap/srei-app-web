package srei.proyecto.srei.evento;

import jakarta.persistence.*;
import lombok.*;
import srei.proyecto.srei.usuario.Usuario;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "eventos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(nullable = false, length = 2000)
    private String descripcion;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false, length = 200)
    private String lugar;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AmbitoEvento ambito;

    @Column(length = 120)
    private String facultad; // requerido si ambito=FACULTAD

    @Column(length = 120)
    private String carrera; // requerido si ambito=CARRERA

    @ManyToOne(optional = false)
    @JoinColumn(name = "docente_id")
    private Usuario docente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EstadoAprobacion estado = EstadoAprobacion.PENDIENTE;

    @Column(length = 2000)
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "aprobado_por_id")
    private Usuario aprobadoPor;

    @Column(length = 255)
    private String rutaImagen;

    @Column(length = 255)
    private String rutaInformePdf;

    @Column(nullable = false)
    @Builder.Default
    private Instant creadoEn = Instant.now();

    @PrePersist
    public void antesDeInsertar() {
        if (estado == null) estado = EstadoAprobacion.PENDIENTE;
        if (creadoEn == null) creadoEn = Instant.now();
    }
}
