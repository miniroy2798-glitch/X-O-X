export type Player = 'X' | 'O' | null;

export type GameState = {
  board: Player[];
  xIsNext: boolean;
  winner: Player | 'Draw';
  winningLine: number[] | null;
};
