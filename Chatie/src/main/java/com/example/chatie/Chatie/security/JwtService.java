package com.example.chatie.Chatie.security;

import com.example.chatie.Chatie.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    private final Key key;
    private final long accessMinutes;
    private final long refreshDays;

    public JwtService(
            @Value("${chatie.jwt.secret}") String secret,
            @Value("${chatie.jwt.access-minutes}") long accessMinutes,
            @Value("${chatie.jwt.refresh-days}") long refreshDays
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessMinutes = accessMinutes;
        this.refreshDays = refreshDays;
    }

    public String generateAccessToken(User u) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(String.valueOf(u.getId()))
                .addClaims(Map.of("username", u.getUsername(), "email", u.getEmail()))
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(accessMinutes, ChronoUnit.MINUTES)))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(User u) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(String.valueOf(u.getId()))
                .claim("type", "refresh")
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(refreshDays, ChronoUnit.DAYS)))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }

    public Long extractUserId(String token) {
        Claims claims = parse(token).getBody();
        String sub = claims.getSubject();
        return Long.parseLong(sub);
    }

    public boolean isRefreshToken(String token) {
        Claims claims = parse(token).getBody();
        String type = claims.get("type", String.class);
        return "refresh".equals(type);
    }

    public boolean isExpired(String token) {
        Claims claims = parse(token).getBody();
        Date exp = claims.getExpiration();
        return exp.before(new Date());
    }

    public boolean isTokenValid(String token, User user) {
        try {
            Claims claims = parse(token).getBody();
            String subject = claims.getSubject();
            Date exp = claims.getExpiration();

            return subject.equals(String.valueOf(user.getId()))
                    && exp.after(new Date());
        } catch (JwtException ex) {
            return false;
        }
    }
}

