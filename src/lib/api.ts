import { User, BackendPokemon, Item } from '../types';

const API_BASE_URL = '/api/backend';

export async function fetchUser(userId: string): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const userData: User = await response.json();
    console.log(`Fetched user data for ${userId}:`, userData);
    return userData;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
}

export async function fetchPokedex(userId: string): Promise<BackendPokemon[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/pokedex/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const pokedexData: BackendPokemon[] = await response.json();
    return pokedexData;
  } catch (error) {
    console.error(`Error fetching Pokedex for user ${userId}:`, error);
    throw error;
  }
}

export async function fetchItems(userId: string): Promise<Item[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/items/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const itemData: Item[] = await response.json();
    return itemData;
  } catch (error) {
    console.error(`Error fetching items for user ${userId}:`, error);
    throw error;
  }
}
