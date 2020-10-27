import { Player } from "./player";
import { Round } from "./round";

export interface Episode {
  id: number;
  players: Player[];
  rounds: Round[];
}
