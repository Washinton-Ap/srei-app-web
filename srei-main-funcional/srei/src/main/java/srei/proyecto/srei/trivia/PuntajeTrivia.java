package srei.proyecto.srei.trivia;

import jakarta.persistence.*;
import lombok.*;
import srei.proyecto.srei.evento.Evento;
import srei.proyecto.srei.usuario.Usuario;

@Entity
@Table(name = "puntajes_trivia", uniqueConstraints = {
        @UniqueConstraint(name = "uk_evento_usuario", columnNames = {"evento_id", "usuario_id"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PuntajeTrivia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "evento_id")
    private Evento evento;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(nullable = false)
    private int puntaje = 0;
}
