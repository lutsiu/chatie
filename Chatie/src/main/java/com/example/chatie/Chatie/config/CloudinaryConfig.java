package com.example.chatie.Chatie.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        Dotenv env = Dotenv.configure()
                .ignoreIfMissing()
                .ignoreIfMalformed()
                .load();

        String cloud  = pick(env.get("CLOUDINARY_CLOUD_NAME"), System.getenv("CLOUDINARY_CLOUD_NAME"));
        String key    = pick(env.get("CLOUDINARY_API_KEY"),    System.getenv("CLOUDINARY_API_KEY"));
        String secret = pick(env.get("CLOUDINARY_API_SECRET"), System.getenv("CLOUDINARY_API_SECRET"));

        System.out.println("[Cloudinary] cloud=" + cloud +
                " key=" + (key != null && key.length() > 4 ? "***" + key.substring(key.length() - 4) : "null") +
                " secret?=" + (secret != null));

        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloud,
                "api_key",    key,
                "api_secret", secret
        ));
    }

    private static String pick(String a, String b) {
        return (a != null && !a.isBlank()) ? a : (b != null && !b.isBlank() ? b : null);
    }
}
