package org.example;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {

    @RequestMapping(value = {"/", "/login", "/register", "/game", "/join", "/create_game"})
    public String index() {
        // Devuelve el archivo index.html desde /static
        return "forward:/index.html";
    }

    @GetMapping("/login") // Maneja la ruta para el inicio de sesión
    public String login() {
        return "login"; // Devuelve la vista login.html
    }

    @GetMapping("/register") // Maneja la ruta para el inicio de sesión
    public String register() {
        return "register"; // Devuelve la vista login.html
    }

    @GetMapping("/game") // Maneja la ruta para el inicio de sesión
    public String game() {
        return "game"; // Devuelve la vista login.html
    }

    @GetMapping("/join") // Maneja la ruta para el inicio de sesión
    public String join() {
        return "join"; // Devuelve la vista login.html
    }

    @GetMapping("/create_game") // Maneja la ruta para el inicio de sesión
    public String create_game() {
        return "create_game"; // Devuelve la vista login.html
    }
}
