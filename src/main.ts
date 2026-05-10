import { controllers } from "./controllers.ts";
import { games } from "./games.ts";
import { Renderer } from "./renderer.ts";
import type { AssignmentMap, ControllerLayout, GameDef } from "./types.ts";
import "./style.css";

class App {
  private renderer: Renderer;
  private currentLayout: ControllerLayout;
  private currentGame: GameDef;
  private assignments: AssignmentMap = {};
  private selectedButtonId: string | null = null;
  private animationId = 0;

  private controllerSelect: HTMLSelectElement;
  private gameSelect: HTMLSelectElement;
  private actionPanel: HTMLElement;
  private canvas: HTMLCanvasElement;

  constructor() {
    this.canvas = document.getElementById("layout-canvas") as HTMLCanvasElement;
    this.controllerSelect = document.getElementById("controller-select") as HTMLSelectElement;
    this.gameSelect = document.getElementById("game-select") as HTMLSelectElement;
    this.actionPanel = document.getElementById("action-buttons") as HTMLElement;

    this.renderer = new Renderer(this.canvas);
    this.currentLayout = controllers[0];
    this.currentGame = games[0];

    this.populateSelects();
    this.setupEventListeners();
    this.renderActionPanel();
    this.resize();
    this.draw();
  }

  private populateSelects(): void {
    for (const c of controllers) {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.name;
      this.controllerSelect.appendChild(opt);
    }
    for (const g of games) {
      const opt = document.createElement("option");
      opt.value = g.id;
      opt.textContent = g.name;
      this.gameSelect.appendChild(opt);
    }
  }

  private setupEventListeners(): void {
    this.controllerSelect.addEventListener("change", () => {
      const layout = controllers.find((c) => c.id === this.controllerSelect.value);
      if (layout) {
        this.currentLayout = layout;
        this.assignments = {};
        this.selectedButtonId = null;
        this.resize();
        this.draw();
      }
    });

    this.gameSelect.addEventListener("change", () => {
      const game = games.find((g) => g.id === this.gameSelect.value);
      if (game) {
        this.currentGame = game;
        this.assignments = {};
        this.selectedButtonId = null;
        this.renderActionPanel();
        this.draw();
      }
    });

    this.canvas.addEventListener("click", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const btn = this.renderer.hitTest(this.currentLayout, x, y);
      if (btn) {
        this.selectedButtonId = btn.id;
      } else {
        this.selectedButtonId = null;
      }
      this.draw();
      this.updateActionPanelHighlight();
    });

    this.canvas.addEventListener("icon-loaded", () => {
      this.draw();
    });

    document.getElementById("btn-save")!.addEventListener("click", () => {
      this.savePng();
    });
  }

  private renderActionPanel(): void {
    this.actionPanel.innerHTML = "";

    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear";
    clearBtn.className = "action-btn action-btn-clear";
    clearBtn.addEventListener("click", () => this.assignAction(null));
    this.actionPanel.appendChild(clearBtn);

    for (const action of this.currentGame.actions) {
      const btn = document.createElement("button");
      btn.className = "action-btn";
      btn.style.borderColor = action.color;
      btn.style.backgroundColor = action.color + "22";
      btn.dataset.actionId = action.id;

      const iconUrl = this.currentGame.icons?.[action.id];
      if (iconUrl) {
        const iconImg = document.createElement("img");
        iconImg.className = "action-btn-icon";
        iconImg.src = iconUrl;
        btn.appendChild(iconImg);
      } else {
        const circle = document.createElement("span");
        circle.className = "action-btn-circle";
        circle.style.color = action.color;
        circle.textContent = action.abbr;
        btn.appendChild(circle);
      }

      const labelSpan = document.createElement("span");
      labelSpan.textContent = action.label;
      btn.appendChild(labelSpan);

      btn.addEventListener("click", () => this.assignAction(action.id));
      this.actionPanel.appendChild(btn);
    }
  }

  private assignAction(actionId: string | null): void {
    if (!this.selectedButtonId) return;
    if (actionId === null) {
      delete this.assignments[this.selectedButtonId];
    } else {
      this.assignments[this.selectedButtonId] = actionId;
    }
    this.draw();
  }

  private updateActionPanelHighlight(): void {
    const currentAction = this.selectedButtonId
      ? this.assignments[this.selectedButtonId] ?? null
      : null;
    const buttons = this.actionPanel.querySelectorAll<HTMLButtonElement>(".action-btn");
    for (const btn of buttons) {
      const actionId = btn.dataset.actionId;
      btn.classList.toggle("active", actionId != null && actionId === currentAction);
    }
  }

  private resize(): void {
    this.renderer.resize(this.currentLayout);
  }

  private draw(): void {
    cancelAnimationFrame(this.animationId);
    if (this.selectedButtonId) {
      this.startAnimation();
    } else {
      this.renderer.render(
        this.currentLayout,
        this.currentGame,
        this.assignments,
        null,
      );
    }
  }

  private startAnimation(): void {
    const frame = (time: number) => {
      this.renderer.render(
        this.currentLayout,
        this.currentGame,
        this.assignments,
        this.selectedButtonId,
        false,
        time,
      );
      if (this.selectedButtonId) {
        this.animationId = requestAnimationFrame(frame);
      }
    };
    this.animationId = requestAnimationFrame(frame);
  }

  private async savePng(): Promise<void> {
    this.renderer.render(this.currentLayout, this.currentGame, this.assignments, null, true);
    const blob = await this.renderer.toBlob();
    this.draw();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `button-layout-${this.currentGame.id}-${this.currentLayout.id}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

new App();
