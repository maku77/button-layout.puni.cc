/** A physical button on the controller */
export interface ButtonDef {
  id: string;
  x: number;
  y: number;
  radius: number;
  label: string;
}

/** Controller layout definition */
export interface ControllerLayout {
  id: string;
  name: string;
  width: number;
  height: number;
  buttons: ButtonDef[];
}

/** A game action that can be assigned to a button */
export interface GameAction {
  id: string;
  label: string;
  color: string;
  abbr: string;
}

/** Game definition with available actions */
export interface GameDef {
  id: string;
  name: string;
  actions: GameAction[];
  icons?: Record<string, string>;
}

/** Button-to-action assignment map (buttonId -> actionId) */
export type AssignmentMap = Record<string, string>;
