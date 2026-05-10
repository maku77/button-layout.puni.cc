import type { GameDef } from "./types.ts";
import { ggstIcons } from "./icons/ggst-icons.ts";

const guiltyGearStrive: GameDef = {
  id: "ggst",
  name: "Guilty Gear Strive",
  actions: [
    { id: "P", label: "Punch", color: "rgb(252, 115, 255)", abbr: "P" },
    { id: "K", label: "Kick", color: "rgb(90, 195, 254)", abbr: "K" },
    { id: "S", label: "Slash", color: "rgb(57, 234, 144)", abbr: "S" },
    { id: "HS", label: "Heavy Slash", color: "rgb(252, 28, 42)", abbr: "HS" },
    { id: "D", label: "Dust", color: "rgb(252, 138, 43)", abbr: "D" },
    { id: "Dash", label: "Dash", color: "#ffffff", abbr: "Dash" },
    { id: "FD", label: "FD", color: "rgb(115, 254, 160)", abbr: "FD" },
    { id: "RC", label: "Roman Cancel", color: "rgb(252, 19, 139)", abbr: "RC" },
    { id: "Burst", label: "Burst", color: "rgb(137, 38, 42)", abbr: "Burst" },
    { id: "Taunt", label: "Taunt", color: "rgb(255, 247, 139)", abbr: "Taunt" },
  ],
  icons: ggstIcons,
};

export const games: GameDef[] = [guiltyGearStrive];
