# Rick and Morty Quiz

Rick and Morty Quiz is a React-based quiz application that tests users on their knowledge of Rick and Morty characters. The quiz dynamically generates questions using the [Rick and Morty API](https://rickandmortyapi.com/), and utilizes React Query for efficient data fetching, caching, and error handling. Users can toggle between dark and light themes, and the application ensures that new options are only displayed once the character image has fully loaded, preventing fast or premature clicks.

## Features

- **Dynamic Quiz Questions:**  
  Generates 5 random questions per quiz attempt for variety.
- **Image & Options Synchronization:**  
  Ensures the answer options are rendered only after the character image is fully loaded.

- **Progress Tracking:**  
  Displays the current score and question progress.

- **Quiz Completion:**  
  Provides a final score and an option to restart the quiz.

- **Theme Toggle:**  
  Offers dark and light mode functionality.

- **Modular Architecture:**  
  Organized file structure with separate modules for API calls, components, and UI elements.

## Tech Stack

- **React** – for building the user interface.
- **React Query** – for handling asynchronous data fetching and caching.
- **TypeScript** – for type safety and enhanced developer experience.
- **Vite** – for fast development and build times.
- **Tailwind CSS / Custom CSS** – for styling (as seen in the provided CSS).
- **Lucide React** – for iconography.

## Project Structure

```
rick-and-morty-quiz/
├── public/
│   └── rickmorty.png          # Static file
│
├── src/
│   ├── api/
│   │   └── quizApi.ts         # API functions for fetching and generating quiz data
│   │
│   ├── app/
│   │   ├── QuestionCard.tsx   # Component for displaying a single quiz question
│   │   └── Quiz.tsx           # Main quiz component
│   │
│   ├── components/
│   │   └── theme/             # Change Theme Functionality
│   │       ├── mode-toggle.tsx      # Toggle between light/dark modes
│   │       └── theme-provider.tsx   # Provides theme context to the entire app
│   │
│   ├── shared/                # Folder for all the common components, hooks, etc.
│      └── components/
│          └── ui/
│              ├── button.tsx        # Reusable Button component
│              ├── card.tsx          # Reusable Card component
│              ├── dropdown-menu.tsx # Example Dropdown Menu component
│              ├── index.ts          # Barrel file for UI exports
│              ├── separator.tsx     # Reusable Separator/Divider component
│          ├── index.tsx        #  Additional exports
│          │
│          ├── lib/                    # Utility libraries or helpers
│          └── styles/                 # Global or component-specific styles
│
├── .gitignore
├── components.json             # Config file or metadata for components
├── eslint.config.js            # ESLint configuration
├── index.html                  # Entry HTML file for Vite
├── index.tsx                   # Entry point for React
├── App.css                     # Global or root-level CSS
├── App.tsx                     # High-level App component
├── package.json                # Project metadata and dependencies.
└── README.md                   # This file.
```

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/gerasimostzivras/rick-and-morty-quiz.git
   cd rick-and-morty-quiz
   ```

2. **Install dependencies:**

   Using npm:

   ```bash
   npm install
   ```

   Or using Yarn:

   ```bash
   yarn install
   ```

3. **Development server:**

   Start the development server with:

   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

   The application should now be running at [http://localhost:5173](http://localhost:5173) (or the port specified in your configuration).

4. **Build for production:**

   To build the project for production, run:

   ```bash
   npm run build
   ```

   or

   ```bash
   yarn build
   ```

## Implementation Decisions & Notes

- **React Query for Data Fetching:**  
  All API calls, including fetching the total character count and generating quiz questions, are managed with React Query. This simplifies the handling of loading states, errors, and caching.

- **Conditional Rendering for Image Load:**  
  In the `QuestionCard` component, answer options are rendered only after the character image has fully loaded. This decision was made to prevent users from interacting with options before the image is ready, ensuring a better user experience.

- **Modular Code Structure:**  
  The project is divided into clear, reusable modules. The API logic is isolated in the `api/quizApi.ts` file, while UI components (Quiz, QuestionCard, ThemeToggle, etc.) are located in their respective directories. This enhances maintainability and scalability.

- **Theme Provider:**  
  A custom `ThemeProvider` is used to allow easy switching between dark and light modes throughout the application. The user’s theme preference is stored locally (using a key such as `ui-theme`).

- **UI Components & Styling:**  
  Reusable components like `Button`, `Card`, and others are implemented to promote consistency. Styling is applied using CSS (and optionally Tailwind CSS classes) for a responsive and modern UI.

- **TypeScript Interfaces (Question, Character)**
  These interfaces define the shapes of the data structures used in our quiz. 'Question' enforces that each quiz question has an image, a correct name, and an array of possible options. 'Character' reflects the Rick and Morty API's character data structure, providing consistency and type safety.

- **Base API URL (API_URL)**
  A single constant 'API_URL' for the Rick and Morty API ensures easy maintenance and prevents duplication. If the API endpoint changes, it can be updated here rather than across multiple files.

- **Fetching the Total Character Count (fetchTotalCount)**
  We first fetch the total count of characters to know the range of valid IDs (1 through totalCount). This approach allows us to generate random IDs in the correct range when selecting characters. We throw an error if the response is not OK, allowing React Query to handle it gracefully.

- **Fetching a Character by ID (fetchCharacter)**
  Separating the fetch logic for individual characters makes the code more reusable. This function is used for both the correct character and the four incorrect characters. Again, we throw an error if the response is not OK.

- **Shuffling Arrays (shuffleArray)**
  The Fisher-Yates algorithm is used to randomize the order of answer options. This prevents predictable patterns (e.g., correct answer always first) and ensures a fair quiz experience.

- **Generating a Single Question (generateQuestion)**
  We pick a random ID within the total character count to determine the correct character. Then we generate four unique incorrect characters: - We repeatedly generate a random ID and skip it if it matches the correct ID or if it was already selected. - Each valid random ID is used to fetch a new character from the API, ensuring a unique incorrect character.

  - Once we have the correct character and four incorrect characters, we combine their names into a single array.
  - We call 'shuffleArray' on this combined array to randomize the order of the answer options.

- **How We Show the Wrong Answers**
  The "wrong answers" come from these four unique incorrect characters we fetch in the while loop. Each incorrect character's 'name' is added to the options array, which is then shuffled together with the correct character's name. In the final 'Question' object, 'options' contains 1 correct name and 4 wrong names, all randomly ordered.

- **Generating 5 Quiz Questions (generateQuestions)**
  We create an array of five promises, each calling 'generateQuestion' to fetch and build a quiz question. Using 'Promise.all' runs these fetches in parallel, which is more efficient than sequential requests. The resulting array of 5 questions is returned, each containing a unique image, correct name, and shuffled answer options.

- **Error Handling**
  All fetch functions throw an error if the response is not OK. This is crucial for React Query's error boundary or error states to catch and handle errors properly. This keeps our UI clean and our logic consistent by letting React Query handle retries, error messages, etc.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your improvements.

## License

This project is licensed under the MIT License.

---

Happy Coding!
