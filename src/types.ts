export interface User {
  discordId: string;
  name: string;
  badges: number;
  money: number;
  encounters: number;
  newEncounters: number;
  sprite: string;
  delay: number;
}

export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchCurrentUser: (discordId: string) => Promise<void>;
  clearUser: () => void;
  setUser: (user: User | null) => void;
}

export interface BackendPokemon {}

export interface AdjustedPokemon {}

export interface Item {}
