package org.example;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

public class ChatHandler extends TextWebSocketHandler {

    // Lista de sesiones activas
    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());

    // Información de los jugadores
    private final Map<String, Map<String, Object>> players = Collections.synchronizedMap(new HashMap<>());

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session); // Añadir la nueva sesión a la lista de sesiones activas
        System.out.println("Conexión establecida: " + session.getId());

        // Envía las posiciones actuales de todos los jugadores al nuevo cliente
        ObjectMapper objectMapper = new ObjectMapper();
        session.sendMessage(new TextMessage(
            objectMapper.writeValueAsString(
                Map.of("type", "initialPositions", "players", players)
            )
        ));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("Mensaje recibido: " + message.getPayload());

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> data = objectMapper.readValue(message.getPayload(), Map.class);

                if ("updatePosition".equals(data.get("type"))) {
            // Actualiza la posición del jugador
            String username = (String) data.get("username");
            int position = (int) data.get("position");
            String color = (String) players.getOrDefault(username, Map.of("color", "#FFFFFF")).get("color");

            players.put(username, Map.of("position", position, "color", color));

            // Notificar a todos los clientes con el estado global
            synchronized (sessions) {
                for (WebSocketSession webSocketSession : sessions) {
                    if (webSocketSession.isOpen()) {
                        webSocketSession.sendMessage(new TextMessage(
                            objectMapper.writeValueAsString(
                                Map.of("type", "initialPositions", "players", players)
                            )
                        ));
                    }
                }
            }
        }


        // Retransmitir el mensaje a todas las sesiones conectadas
        synchronized (sessions) {
            for (WebSocketSession webSocketSession : sessions) {
                if (webSocketSession.isOpen()) {
                    webSocketSession.sendMessage(message);
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session); // Remover la sesión de la lista cuando se desconecta
        System.out.println("Conexión cerrada: " + session.getId());

        // Identificar al jugador que se desconectó
        String disconnectedUsername = players.entrySet().stream()
            .filter(entry -> session.equals(entry.getValue().get("session")))
            .map(Map.Entry::getKey)
            .findFirst()
            .orElse(null);

        if (disconnectedUsername != null) {
            players.remove(disconnectedUsername); // Eliminar al jugador del mapa

            // Notificar a los demás clientes
            ObjectMapper objectMapper = new ObjectMapper();
            synchronized (sessions) {
                for (WebSocketSession webSocketSession : sessions) {
                    if (webSocketSession.isOpen()) {
                        webSocketSession.sendMessage(new TextMessage(
                            objectMapper.writeValueAsString(
                                Map.of("type", "disconnect", "username", disconnectedUsername)
                            )
                        ));
                    }
                }
            }
        }
    }
}
