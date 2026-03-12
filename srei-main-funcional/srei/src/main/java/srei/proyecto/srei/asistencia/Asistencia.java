package srei.proyecto.srei.asistencia;

import jakarta.persistence.*;
import lombok.*;
import srei.proyecto.srei.evento.Evento;
import srei.proyecto.srei.usuario.Usuario;

import java.time.Instant;

@Entity
@Table(name = "asistencias", uniqueConstraints = {
        @UniqueConstraint(name = "uk_evento_asistente", columnNames = {"evento_id", "asistente_id"}),
        @UniqueConstraint(name = "uk_qr_token", columnNames = {"qrToken"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "evento_id")
    private Evento evento;

    @ManyToOne(optional = false)
    @JoinColumn(name = "asistente_id")
    private Usuario asistente;

    @Column(nullable = false, length = 120)
    private String qrToken;

    @Column(nullable = false)
    @Builder.Default
    private boolean confirmada = false;

    private Instant confirmadoEn;

    @Column(nullable = false)
    @Builder.Default
    private Instant creadoEn = Instant.now();

    @PrePersist
    public void antesDeInsertar() {
        if (creadoEn == null) creadoEn = Instant.now();
    }
}
