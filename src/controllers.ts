import type { ControllerLayout } from "./types.ts";

/**
 * Standard 12-button leverless controller (hitbox-style)
 *
 * Layout reference:
 * - Left cluster: LEFT, DOWN side by side; RIGHT below-right of DOWN;
 *   UP (thumb) centered below the action buttons
 * - Right cluster: 2 rows of 4 action buttons with arc stagger
 *   (buttons rise slightly toward the center columns)
 */
const standard14: ControllerLayout = {
  id: "standard-14",
  name: "Standard 14-button",
  width: 420,
  height: 230,
  buttons: [
    // Movement buttons (left cluster)
    // LEFT and DOWN are on the same row, large buttons
    { id: "left", x: 30, y: 50, radius: 26, label: "←" },
    { id: "down", x: 90, y: 52, radius: 26, label: "↓" },
    // RIGHT is offset down-right from DOWN
    { id: "right", x: 145, y: 75, radius: 26, label: "→" },
    // UP (thumb button) is below, centered under the action area
    { id: "up", x: 186, y: 200, radius: 28, label: "↑" },

    // Action buttons - top row (4 buttons, arc stagger)
    { id: "btn1", x: 210, y: 52, radius: 26, label: "" },
    { id: "btn2", x: 270, y: 30, radius: 26, label: "" },
    { id: "btn3", x: 330, y: 33, radius: 26, label: "" },
    { id: "btn4", x: 390, y: 39, radius: 26, label: "" },

    // Action buttons - bottom row (4 buttons, arc stagger)
    { id: "btn5", x: 208, y: 112, radius: 26, label: "" },
    { id: "btn6", x: 266, y: 90, radius: 26, label: "" },
    { id: "btn7", x: 326, y: 93, radius: 26, label: "" },
    { id: "btn8", x: 386, y: 99, radius: 26, label: "" },

    // Additional buttons (optional, not part of the core 12-button layout)
    { id: "btn9", x: 126, y: 170, radius: 26, label: "" },
    { id: "btn10", x: 250, y: 160, radius: 26, label: "" },
  ],
};

export const controllers: ControllerLayout[] = [standard14];
