import type { ControllerLayout, GameDef, AssignmentMap, ButtonDef } from "./types.ts";

const BG_COLOR = "#2a2a2a";
const PANEL_COLOR = "#1a1a1a";
const PANEL_BORDER_COLOR = "#555";
const TEXT_COLOR = "#ffffff";

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scale: number;
  private iconCache = new Map<string, HTMLImageElement>();

  constructor(canvas: HTMLCanvasElement, dpr = window.devicePixelRatio || 1) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.scale = dpr;
  }

  resize(layout: ControllerLayout): void {
    const padding = 50;
    const w = layout.width + padding * 2;
    const h = layout.height + padding * 2;
    this.canvas.width = w * this.scale;
    this.canvas.height = h * this.scale;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
  }

  render(
    layout: ControllerLayout,
    game: GameDef,
    assignments: AssignmentMap,
    selectedButtonId: string | null,
    transparent = false,
    time = 0,
  ): void {
    const padding = 50;
    const ctx = this.ctx;
    const w = layout.width + padding * 2;
    const h = layout.height + padding * 2;

    ctx.clearRect(0, 0, w, h);

    if (!transparent) {
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, w, h);
    }

    // Controller body panel
    const panelX = 30;
    const panelY = 30;
    const panelW = w - 60;
    const panelH = h - 60;
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelW, panelH, 16);
    ctx.fillStyle = PANEL_COLOR;
    ctx.fill();
    ctx.strokeStyle = PANEL_BORDER_COLOR;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw buttons
    for (const btn of layout.buttons) {
      const bx = btn.x + padding;
      const by = btn.y + padding;
      const isSelected = btn.id === selectedButtonId;
      const actionId = assignments[btn.id];
      const action = actionId
        ? game.actions.find((a) => a.id === actionId)
        : undefined;
      const iconUrl = actionId && game.icons ? game.icons[actionId] : undefined;

      this.drawButton(ctx, bx, by, btn, action, iconUrl, isSelected, time);
    }
  }

  private drawButton(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    btn: ButtonDef,
    action: { color: string; abbr: string; label: string } | undefined,
    iconUrl: string | undefined,
    isSelected: boolean,
    time: number,
  ): void {
    // All buttons: draw a filled dark circle as the base
    ctx.beginPath();
    ctx.arc(x, y, btn.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#333";
    ctx.fill();

    if (iconUrl) {
      // Draw icon image clipped to the same circle
      const img = this.getIconImage(iconUrl);
      const size = btn.radius * 2;
      if (img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, btn.radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
        ctx.restore();
      }
    } else if (action) {
      const fontSize = this.getFontSize(action.abbr, btn.radius);
      ctx.font = `900 ${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = action.color;
      ctx.fillText(action.abbr, x, y);
    } else {
      // Unassigned: direction arrows or button number
      ctx.fillStyle = TEXT_COLOR;
      const fontSize = this.getFontSize(btn.label, btn.radius);
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(btn.label, x, y);
    }

    // Animated glow ring
    if (isSelected) {
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.004);
      const glowRadius = btn.radius + 4 + pulse * 3;
      const alpha = 0.4 + pulse * 0.6;
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 10 + pulse * 8;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = 2 + pulse * 1.5;
      ctx.stroke();
      ctx.restore();
    }

  }

  private getFontSize(text: string, radius: number): number {
    if (text.length <= 1) return radius * 1.2;
    if (text.length <= 2) return radius * 0.95;
    if (text.length <= 4) return radius * 0.7;
    return radius * 0.55;
  }

  private getIconImage(url: string): HTMLImageElement {
    let img = this.iconCache.get(url);
    if (img) return img;

    img = new Image();
    img.src = url;
    img.onload = () => {
      this.canvas.dispatchEvent(new CustomEvent("icon-loaded"));
    };
    this.iconCache.set(url, img);
    return img;
  }

  hitTest(
    layout: ControllerLayout,
    canvasX: number,
    canvasY: number,
  ): ButtonDef | null {
    const padding = 50;
    for (const btn of layout.buttons) {
      const bx = btn.x + padding;
      const by = btn.y + padding;
      const dx = canvasX - bx;
      const dy = canvasY - by;
      if (dx * dx + dy * dy <= btn.radius * btn.radius) {
        return btn;
      }
    }
    return null;
  }

  toBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to export canvas"));
      }, "image/png");
    });
  }
}
