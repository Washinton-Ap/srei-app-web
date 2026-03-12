package srei.proyecto.srei.comentario;

import jakarta.persistence.*;
import lombok.*;
import srei.proyecto.srei.evento.Evento;
import srei.proyecto.srei.usuario.Usuario;

import java.time.Instant;

@Entity
@Table(name = "comentarios")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "evento_id")
    private Evento evento;

    @ManyToOne(optional = false)
    @JoinColumn(name = "autor_id")
    private Usuario autor;

    @Column(nullable = false, length = 1500)
    private String contenido;

    @Column(nullable = false)
    @Builder.Default
    private boolean censurado = false;

    @Column(nullable = false)
    @Builder.Default
    private Instant creadoEn = Instant.now();

    @PrePersist
    public void antesDeInsertar() {
        if (creadoEn == null) creadoEn = Instant.now();
    }
}
