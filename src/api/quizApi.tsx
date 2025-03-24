/**
 * Represents a quiz question with an image, the correct answer, and multiple answer options.
 */
export interface Question {
  image: string;
  correctName: string;
  options: string[];
}

/**
 * Represents a Rick and Morty character.
 */
export interface Character {
  id: number;
  name: string;
  image: string;
}

const API_URL = "https://rickandmortyapi.com/api/character";

/**
 * Fetches the total number of characters from the Rick and Morty API.
 * @returns A promise that resolves to the total count of characters.
 * @throws Error if the API request fails.
 */
export async function fetchTotalCount(): Promise<number> {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error("Failed to fetch total character count.");
  }
  const data = await res.json();
  return data.info.count;
}

/**
 * Fetches a Rick and Morty character by its ID.
 * @param id - The ID of the character to fetch.
 * @returns A promise that resolves to the character data.
 * @throws Error if the API request fails.
 */
export async function fetchCharacter(id: number): Promise<Character> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch character with ID: ${id}`);
  }
  return res.json();
}

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * @param array - The array to shuffle.
 * @returns A new array with the elements in a randomized order.
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates a single quiz question by selecting one correct character and four unique incorrect characters.
 * @param totalCount - The total number of characters available.
 * @returns A promise that resolves to a quiz question.
 */
export async function generateQuestion(totalCount: number): Promise<Question> {
  // Pick a random correct character.
  const correctId = Math.floor(Math.random() * totalCount) + 1;
  const correctChar = await fetchCharacter(correctId);

  // Generate 4 unique incorrect characters.
  const incorrectChars: Character[] = [];
  while (incorrectChars.length < 4) {
    const randId = Math.floor(Math.random() * totalCount) + 1;
    if (randId === correctId) continue;
    if (incorrectChars.some((c) => c.id === randId)) continue;
    const char = await fetchCharacter(randId);
    incorrectChars.push(char);
  }

  // Combine and shuffle answer options.
  let options = [correctChar.name, ...incorrectChars.map((c) => c.name)];
  options = shuffleArray(options);

  return {
    image: correctChar.image,
    correctName: correctChar.name,
    options,
  };
}

/**
 * Generates 5 quiz questions.
 * @param totalCount - The total number of characters available.
 * @returns A promise that resolves to an array of quiz questions.
 */
export async function generateQuestions(
  totalCount: number
): Promise<Question[]> {
  const promises = Array.from({ length: 5 }, () =>
    generateQuestion(totalCount)
  );
  return Promise.all(promises);
}
