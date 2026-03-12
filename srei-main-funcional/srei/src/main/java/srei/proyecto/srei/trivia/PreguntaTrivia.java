package srei.proyecto.srei.trivia;

import jakarta.persistence.*;
import lombok.*;
import srei.proyecto.srei.evento.Evento;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "preguntas_trivia")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PreguntaTrivia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "evento_id")
    private Evento evento;

    @Column(nullable = false, length = 1000)
    private String enunciado;

    @ElementCollection
    @CollectionTable(name = "opciones_trivia", joinColumns = @JoinColumn(name = "pregunta_id"))
    @Column(name = "opcion", nullable = false, length = 600)
    @Builder.Default
    private List<String> opciones = new ArrayList<>();

    @Column(nullable = false)
    private int indiceCorrecto;
}
