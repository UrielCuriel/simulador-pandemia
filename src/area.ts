import { Particula } from "./particula";
import { Utils } from "./utils";
import { State } from "./types";
import { Subject } from "rxjs";

/**
 * Area de simulación
 */
export class Area {
  /**
   * contexto del canvas para dibujar la animación
   */
  ctx: CanvasRenderingContext2D;
  /**
   * partículas a observar en la simulación
   */
  private _particulas: Particula[] = [];

  /**
   * Variables para realizar la animación del simulador
   */
  dt: number = 0;
  currentTime: number = 0;
  lastTime: number = 0;
  _clearCanvas: boolean = true;
  paused: boolean = true;
 
  /**
   * almacena cada cambio que se hace sobre las partículas
   */
  private _onChangeParticulas = new Subject<Particula[]>();

  constructor(public canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.draw = this.draw.bind(this);
  }
  /**
   * Función para generar las condiciones necesarias para la simulación
   * @param densidad cantidad de partículas en el area de simulación
   */
  iniciarSimulacion(densidad = 90) {
    this.paused = false;
    /**
     * Genera las partículas y las ubica de forma aleatoria en el area de simulación 
     */
    this._particulas = new Array(densidad)
      .fill({})
      .map(
        () =>
          new Particula(
            Utils.randomRange(0, this.canvas.height - 4),
            Utils.randomRange(0, this.canvas.width - 4),
            4
          )
      );
    
    this.draw();
    /**
     * Genera el paciente cero que inicia la epidemia de forma aleatoria
     * el timeout es para esperar a que las partículas se hayan esparcido por el area
     */
    setTimeout(() => {
      const zeroPatient = Utils.randomRange(0, this._particulas.length);
      this._particulas[zeroPatient].sick();
    }, 1000);
  }
  /**
   * pausa la simulación 
   */
  pause() {
    this.paused = true;
  }
  /**
   * limpia el area de simulación
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  /**
   * Evita que las partículas se sobre pongan (solo para efectos visuales)
   * @param part1 partícula 1
   * @param part2 partícula 2
   */
  staticCollision(part1: Particula, part2: Particula) {
    let overlap = part1.size + part2.size - Utils.distance(part1, part2);
    let theta = Math.atan2(part1.y - part2.y, part1.x - part2.x);
    part2.x -= overlap * Math.cos(theta);
    part2.y -= overlap * Math.sin(theta);
  }
  /**
   * Genera el contagio al contacto entre partículas si se cumplen las condiciones
   * Condiciones:
   * alguna de las 2 esté enferma 
   * la partícula a contagiar no esté enferma
   * @param part1 partícula 1
   * @param part2 partícula 2
   */
  sickParticula(part1: Particula, part2: Particula) {
    if ([part1, part2].every(p => p.state !== State.SICK)) {
      return;
    }
    if (part1.state === State.SICK && part2.state === State.HEALTHY) {
      part2.sick();
    }
    if (part2.state === State.SICK && part1.state === State.HEALTHY) {
      part1.sick();
    }
  }
  /**
   * Evita que las partículas salgan del area de simulación
   * @param particula partícula
   */
  wallCollision(particula: Particula) {
    if (
      particula.x - particula.size + particula.dx < 0 ||
      particula.x + particula.size + particula.dx > this.canvas.width
    ) {
      particula.dx *= -1;
    }
    if (
      particula.y - particula.size + particula.dy < 0 ||
      particula.y + particula.size + particula.dy > this.canvas.height
    ) {
      particula.dy *= -1;
    }
    if (particula.y + particula.size > this.canvas.height) {
      particula.y = this.canvas.height - particula.size;
    }
    if (particula.y - particula.size < 0) {
      particula.y = particula.size;
    }
    if (particula.x + particula.size > this.canvas.width) {
      particula.x = this.canvas.width - particula.size;
    }
    if (particula.x - particula.size < 0) {
      particula.x = particula.size;
    }
  }
  /**
   * Verifica la colisión de las partículas 
   */
  partCollision() {
    for (let i = 0; i < this._particulas.length - 1; i++) {
      for (let j = i + 1; j < this._particulas.length; j++) {
        let part1 = this._particulas[i];
        let part2 = this._particulas[j];
        let dist = Utils.distance(part1, part2);

        if (dist < part1.size + part2.size) {
          let theta1 = part1.angle;
          let theta2 = part2.angle;
          let phi = Math.atan2(part2.y - part1.y, part2.x - part1.x);
          let m1 = part1.mass;
          let m2 = part2.mass;
          let v1 = part1.speed;
          let v2 = part2.speed;

          let dx1F =
            ((v1 * Math.cos(theta1 - phi) * (m1 - m2) +
              2 * m2 * v2 * Math.cos(theta2 - phi)) /
              (m1 + m2)) *
              Math.cos(phi) +
            v1 * Math.sin(theta1 - phi) * Math.cos(phi + Math.PI / 2);
          let dy1F =
            ((v1 * Math.cos(theta1 - phi) * (m1 - m2) +
              2 * m2 * v2 * Math.cos(theta2 - phi)) /
              (m1 + m2)) *
              Math.sin(phi) +
            v1 * Math.sin(theta1 - phi) * Math.sin(phi + Math.PI / 2);
          let dx2F =
            ((v2 * Math.cos(theta2 - phi) * (m2 - m1) +
              2 * m1 * v1 * Math.cos(theta1 - phi)) /
              (m1 + m2)) *
              Math.cos(phi) +
            v2 * Math.sin(theta2 - phi) * Math.cos(phi + Math.PI / 2);
          let dy2F =
            ((v2 * Math.cos(theta2 - phi) * (m2 - m1) +
              2 * m1 * v1 * Math.cos(theta1 - phi)) /
              (m1 + m2)) *
              Math.sin(phi) +
            v2 * Math.sin(theta2 - phi) * Math.sin(phi + Math.PI / 2);

          part1.dx = dx1F;
          part1.dy = dy1F;
          part2.dx = dx2F;
          part2.dy = dy2F;
          this.sickParticula(part1, part2);
          this.staticCollision(part1, part2);
        }
      }
      this.wallCollision(this._particulas[i]);
    }

    if (this._particulas.length > 0)
      this.wallCollision(this._particulas[this._particulas.length - 1]);
  }
  /**
   * Mueve cada partícula en la dirección y velocidad determinada en cada una
   */
  moveParticulas() {
    for (let i = 0; i < this._particulas.length; i++) {
      let ob = this._particulas[i];
      ob.x += ob.dx * this.dt;
      ob.y += ob.dy * this.dt;
    }
  }
  /**
   * dibuja cada partícula en el area de simulación
   */
  drawParticulas() {
    for (let part in this._particulas) {
      this._particulas[part].draw(this.ctx);
    }
  }
  /**
   * Hace la animación del area de simulación
   */
  draw() {
    this.currentTime = new Date().getTime();
    this.dt = (this.currentTime - this.lastTime) / 1000;
    this.dt *= 50;
    if (this._clearCanvas) this.clearCanvas();

    if (!this.paused) {
      this.moveParticulas();
      this.partCollision();
      /**
       * notifica los cambios de las partículas en cada ciclo de animación
       */
      this._onChangeParticulas.next(this._particulas);
    }
    this.drawParticulas();
    this.lastTime = this.currentTime;
    window.requestAnimationFrame(this.draw);
  }
  /**
   * retorna un observador de las partículas
   */
  get particulas() {
    return this._onChangeParticulas.asObservable();
  }
}
