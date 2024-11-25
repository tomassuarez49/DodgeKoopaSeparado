package org.example;

import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.Map;

public class GameLogic {
    private final Map<WebSocketSession, Character> players = new HashMap<>();

    public void addPlayer(WebSocketSession session) {
        players.put(session, new Character(session.getId(), 0, 0)); // Posición inicial (0, 0)
    }

    public void removePlayer(WebSocketSession session) {
        players.remove(session);
    }

    public void movePlayer(WebSocketSession session, int deltaX, int deltaY) {
        Character character = players.get(session);
        if (character != null) {
            character.setX(character.getX() + deltaX);
            character.setY(character.getY() + deltaY);
        }
    }

    public Map<WebSocketSession, Character> getPlayers() {
        return players;
    }
}