/**
 * Grafica  que muestra la cantidad de particulas que hay en el area de simulacion a lo largo del tiempo
 */
export class Chart {
  ctx: CanvasRenderingContext2D;
  curentPoint: number = 0;
  lastHeight: number = 0;
  size: number = 1;
  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }
  drawPoint(values: Array<{ value: number; color: string }>) {
    this.lastHeight = 0;
    const total = values.map(v => v.value).reduce((a, b) => a + b);
    const valuesHeight = values.map(({ value, color }) => ({
      value: (value * this.canvas.height) / total,
      color
    }));
    valuesHeight.map(({ value, color }) => {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(this.curentPoint, this.lastHeight, this.size, value);
      this.lastHeight += value;
    });
    this.curentPoint += this.size;
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.lastHeight = 0;
    this.curentPoint = 0;
  }
}
