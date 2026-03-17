package srei.proyecto.srei.ia;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ia")
public class IaController {

    private final IaService iaService;

    public IaController(IaService iaService) {
        this.iaService = iaService;
    }

    @PostMapping("/generar-imagen")
    public ImagenResponse generar(@RequestBody PromptRequest request) {

        String url = iaService.generarImagen(request.getPrompt());

        return new ImagenResponse(url);
    }
}