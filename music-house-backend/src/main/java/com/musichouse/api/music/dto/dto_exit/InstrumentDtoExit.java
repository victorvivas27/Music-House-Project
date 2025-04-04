package com.musichouse.api.music.dto.dto_exit;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.musichouse.api.music.entity.Characteristics;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;


@Service
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InstrumentDtoExit {

    private UUID idInstrument;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date registDate;

    private String name;

    private String description;

    private String measures;

    private BigDecimal weight;

    private BigDecimal rentalPrice;

    private CategoryDtoExit category;

    private ThemeDtoExit theme;

    private List<ImagesUrlsDtoExit> imageUrls;

    private Characteristics characteristics;


    // ✅ Método para devolver el peso formateado con unidad

    /**
     * Devuelve el peso del instrumento formateado en kilogramos o gramos.
     * - Si el peso es menor a 1 kg, se muestra en gramos.
     * - Si es mayor o igual a 1 kg, se muestra en kg con separador de miles.
     */
    @JsonProperty("formattedWeight")
    public String getFormattedWeight() {
        if (weight == null) {
            return "Peso no disponible";
        }

        BigDecimal mil = BigDecimal.valueOf(1000); // 1kg = 1000g
        BigDecimal gramos = weight.multiply(mil); // Convertir a gramos

        if (weight.compareTo(BigDecimal.ONE) < 0) {
            // 🔹 Si es menor a 1 kg, solo mostrar gramos
            return gramos.stripTrailingZeros().toPlainString() + " gramos";
        } else {
            // 🔹 Si es 1 kg o más, mostrar en formato "X kilos Y gramos"
            BigDecimal kilos = weight.setScale(0, BigDecimal.ROUND_DOWN); // Parte entera en kg
            BigDecimal gramosRestantes = gramos.remainder(mil); // Gramos restantes

            if (gramosRestantes.compareTo(BigDecimal.ZERO) == 0) {
                return kilos + (kilos.equals(BigDecimal.ONE) ? " kilo" : " kilos"); // "1 kilo" o "2 kilos"
            } else {
                return kilos + (kilos.equals(BigDecimal.ONE) ? " kilo " : " kilos ") +
                        gramosRestantes.stripTrailingZeros().toPlainString() + " gramos";
            }
        }
    }
}
