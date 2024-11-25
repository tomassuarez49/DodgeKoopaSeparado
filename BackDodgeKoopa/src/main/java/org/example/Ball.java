package org.example;

public class Ball {
    private static Ball instance;
    private int x;
    private int y;

    // Constructor privado para evitar instanciación externa
    private Ball(int startX, int startY) {
        this.x = startX;
        this.y = startY;
    }

    // Método para obtener la instancia única de Ball
    public static synchronized Ball getInstance(int startX, int startY) {
        if (instance == null) {
            instance = new Ball(startX, startY);
        }
        return instance;
    }

    // Métodos sincronizados para actualizar la posición de la bola
    public synchronized void move(int deltaX, int deltaY) {
        this.x += deltaX;
        this.y += deltaY;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }
}
