import { Utils } from "./utils";
import { State } from "./types";

/**
 * Objeto base para simulador de epidemia
 */
export class Particula {
  public dx: number = Utils.randomDx();
  public dy: number = Utils.randomDy();
  mass: number;
  constructor(
    public x: number,
    public y: number,
    public size: number,
    public state: State = State.HEALTHY
  ) {
    this.mass = size ** 3;
  }
  /**
   * Función para dibujar la particula
   * @param ctx Contexto del canvas html
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(Math.round(this.x), Math.round(this.y), this.size, 0, 2 * Math.PI);
    ctx.fillStyle = Utils.getFillColor(this.state);
    ctx.fill();
    ctx.strokeStyle = Utils.getStrokeColor(this.state);
    ctx.stroke();
    ctx.closePath();
  }
  /**
   * Velocidad de movimiento
   */
  get speed() {
    return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
  }
  /**
   * Angulo de Movimiento
   */
  get angle() {
    return Math.atan2(this.dy, this.dx);
  }
  /**
   * Calcula si la particula sigue dentro del area de dibujado
   * @param canvas canvas donde se dibuja la particula
   */
  onGround(canvas: HTMLCanvasElement) {
    return this.y + this.size >= canvas.height;
  }

  /**
   *
   */
  sick() {
    this.state = State.SICK;
    setTimeout(() => {
      this.state = State.RECOVERED;
    }, 10000);
  }
}
