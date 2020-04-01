import { State } from "./types";

export namespace Utils {
  /**
   * Genera la dirección inicial en el eje x
   */
  export const randomDx = () => {
    return Math.floor(Math.random() * 10 - 4);
  };
  /**
   * Genera la dirección inicial en el eje y
   */
  export const randomDy = () => {
    return Math.floor(Math.random() * 10 - 3);
  };
  /**
   * Regresa el color de relleno dependiendo del estado del pa partícula
   * @param state Estado de la partícula
   */
  export const getFillColor = (state: State) => {
    const colors = ["#81E6D9", "#ECC94B", "#4299E1"];
    return colors[state];
  };
  /**
   * Regresa el color del contorno dependiendo del estado del pa partícula
   * @param state Estado de la partícula
   */
  export const getStrokeColor = (state: State) => {
    const colors = ["#319795", "#975A16", "#2C5282"];
    return colors[state];
  };

  /**
   * Calcula la distancia entre dos partículas
   * @param a - Objeto 1 para comparar
   * @param b - Objeto 2 para comparar
   */
  export const distance = (
    a: { x: number; y: number },
    b: { x: number; y: number }
  ) => {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  };
  export const randomRange = (min: number, max: number) => {
    return Math.floor(Math.random() * max + min);
  };
}
