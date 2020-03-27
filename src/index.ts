import { Area } from "./area";
import { map } from "rxjs/operators";
import { State } from "./types";
import { fromEvent } from "rxjs";
import { Chart } from "./chart";

function main() {
  const button: HTMLButtonElement = document.getElementById(
    "button"
  ) as HTMLButtonElement;
  const canvas: HTMLCanvasElement = document.getElementById(
    "simulador"
  ) as HTMLCanvasElement;
  const graficaCanvas: HTMLCanvasElement = document.getElementById(
    "grafica"
  ) as HTMLCanvasElement;
  const select: HTMLSelectElement = document.getElementById(
    "dencidad"
  ) as HTMLSelectElement;

  const healthyCount = document.querySelector(".healthy .count");
  const sickCount = document.querySelector(".sick .count");
  const recoveredCount = document.querySelector(".recovered .count");
  const area = new Area(canvas);
  const grafica = new Chart(graficaCanvas);

  /**
   * Observa los cambios de las particulas
   */
  area.particulas
    .pipe(
      /**
       * filtra las particulas por el estado de cada una
       */
      map(particulas => ({
        healthy: particulas.filter(p => p.state === State.HEALTHY).length,
        sick: particulas.filter(p => p.state === State.SICK).length,
        recovered: particulas.filter(p => p.state === State.RECOVERED).length
      }))
    )
    .subscribe(particulasCount => {
      healthyCount &&
        (healthyCount.innerHTML = particulasCount.healthy.toString());

      sickCount && (sickCount.innerHTML = particulasCount.sick.toString());

      recoveredCount &&
        (recoveredCount.innerHTML = particulasCount.recovered.toString());
      const graphPoints = [
        { value: particulasCount.healthy, color: "#38b2ac77" },
        { value: particulasCount.recovered, color: "#3182ce77" },
        { value: particulasCount.sick, color: "#ecc94b77" }
      ];

      grafica.drawPoint(graphPoints);
      /**
       * termina la simulación si ya no hay particulas enfermas
       */
      if (particulasCount.recovered > 0 && particulasCount.sick === 0) {
        area.pause();
      }
    });

  fromEvent(button, "click").subscribe(() => {
    if (area.paused) {
      grafica.clearCanvas();
      const dencity = Number(select.value);
      area.iniciarSimulacion(dencity);
      button.classList.add("opacity-50", "cursor-wait", "pointer-events-none");
      select.classList.add("opacity-50", "cursor-wait", "pointer-events-none");
    }
  });
}

main();
