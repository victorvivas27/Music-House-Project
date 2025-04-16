package com.musichouse.api.music.config;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

@Configuration
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        cacheManager.setCaches(Arrays.asList(
                buildCache("categories", 100, 10),
                buildCache("themes", 100, 10),
                buildCache("users", 100, 10),
                buildCache("instruments", 100, 10),
                buildCache("favorites", 100, 10)
        ));
        return cacheManager;
    }

    private CaffeineCache buildCache(String name, int maxSize, int expireAfterWrite) {
        Caffeine<Object, Object> caffeineBuilder = Caffeine.newBuilder()
                .maximumSize(maxSize)
                .expireAfterWrite(expireAfterWrite, TimeUnit.MINUTES);
        Cache<Object, Object> cache = caffeineBuilder.build();
        return new CaffeineCache(name, cache);
    }
}
