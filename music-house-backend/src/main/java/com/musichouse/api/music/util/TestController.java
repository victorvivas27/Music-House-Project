package com.musichouse.api.music.util;

import com.musichouse.api.music.service.AvailableDateService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class TestController {
    private final AvailableDateService availableDateService;

    @GetMapping("/test-delete-past-dates")
    public void testDeletePastAvailableDates() {
        availableDateService.deletePastAvailableDates();
    }
}
