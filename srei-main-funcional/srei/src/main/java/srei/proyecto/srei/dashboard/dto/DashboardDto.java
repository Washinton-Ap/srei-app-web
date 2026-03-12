package srei.proyecto.srei.dashboard.dto;

import java.util.List;

public record DashboardDto(
        String rol,
        List<CardDto> tarjetas,
        List<ChartDto> graficas
) {}
