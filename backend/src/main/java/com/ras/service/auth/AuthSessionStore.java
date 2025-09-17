// src/main/java/com/ras/service/auth/AuthSessionStore.java
package com.ras.service.auth;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class AuthSessionStore {
  public static class SessionData {
    public final Long accountId;
    public final Instant expiresAt;
    public SessionData(Long accountId, Instant expiresAt) {
      this.accountId = accountId; this.expiresAt = expiresAt;
    }
  }

  private final Map<String, SessionData> tokens = new ConcurrentHashMap<>();
  private static final Duration TTL = Duration.ofDays(7);

  public String issue(Long accountId) {
    String token = UUID.randomUUID().toString();
    tokens.put(token, new SessionData(accountId, Instant.now().plus(TTL)));
    return token;
  }

  public Long verify(String token) {
    SessionData s = tokens.get(token);
    if (s == null) return null;
    if (Instant.now().isAfter(s.expiresAt)) {
      tokens.remove(token);
      return null;
    }
    return s.accountId;
  }

  public void revoke(String token) { tokens.remove(token); }
}
    