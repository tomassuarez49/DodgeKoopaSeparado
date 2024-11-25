package org.example;

import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/send") // Ruta a la que los clientes enviarán mensajes
    @SendTo("/topic/messages") // Ruta donde se enviarán los mensajes a los suscriptores
    public Message send(Message message) {
        return message; // Devuelve el mensaje a todos los suscriptores
    }
}
