# PokeStats - Pokemon Database & Stats Comparator
# LIENNN YOUTUBEEEEEEE
https://www.youtube.com/watch?v=LL_8Sb36opY












A full-stack CRUD application for browsing, managing, and comparing Pokemon, built with React, TypeScript, and an Express/MongoDB backend.

> **For detailed technical documentation, architecture, and data flows, see [TECHNICAL_DOCS.md](./TECHNICAL_DOCS.md)**

## Features

### Pokemon Browser
- Paginated card grid displaying all Pokemon from the database (20 per page)
- TCG-style card design with type-colored backgrounds, image, HP, and attack preview
- Search by name (English, French, Japanese, Chinese) with 400ms debounce
- Click any card to navigate to its detail page

### Full CRUD Operations
- **Create**: Add a new Pokemon with names (4 languages), types, base stats, and optional image URL
- **Read**: Browse the paginated list or view individual Pokemon detail pages
- **Update**: Edit any Pokemon's data in-place from the detail page
- **Delete**: Remove a Pokemon with a confirmation modal

### Favorites System
- Toggle favorites via the heart icon on any card or detail page
- Favorites persist across sessions using `localStorage`
- Dedicated favorites view on the list page (heart toggle next to search bar)
- Batch-fetches favorited Pokemon from the backend in a single request

### Type & Stat Filters (Poke-Filter)
- Collapsible filter panel with 18 type toggle buttons (multi-select)
- Min/max range inputs for all 6 base stats (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed)
- Filters are server-side with full pagination support
- Active filter count displayed as a badge on the filter button
- Reset button to clear all filters at once
- Search and filters are mutually exclusive; favorites mode disables filters

### Stats Comparator
- Dedicated `/compare` page accessible from the navbar
- Pick two Pokemon via a searchable modal (instant client-side filtering of all Pokemon)
- Side-by-side stat comparison with dual horizontal bars (blue vs red)
- Winning stat highlighted per row
- Base Stat Total (BST) comparison with winner badge or draw indicator
- Overlaid radar chart showing both Pokemon's stat profiles on a single chart
- Reset and re-pick at any time

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI Framework | React 19 |
| Language | TypeScript 5.8 |
| Build Tool | Vite 6 |
| Routing | React Router 7 |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Styling | Tailwind CSS (CDN) + custom CSS |
| Font | Patrick Hand (Google Fonts) |
| Backend | Express + MongoDB (separate project) |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running on `localhost:27017`
- Backend server (`Pokestats_with_battlemode_back`) running on port 3000

### Installation

```bash
# Install frontend dependencies
cd pokestats_with_battlemode
npm install

# Start the development server (default port 5173)
npm run dev

# In a separate terminal, start the backend
cd Pokestats_with_battlemode_back
npm install
node index.js
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |

## API Connection

The frontend communicates with the backend through a Vite dev server proxy:

```
Frontend (localhost:5173)  --->  /api/*  --->  Backend (localhost:3000)
```

The `/api` prefix is stripped by the proxy, so `/api/pokemon` becomes `http://localhost:3000/pokemon`.

### Endpoints Used

| Method | Frontend Path | Backend Route | Purpose |
|--------|--------------|---------------|---------|
| GET | `/api/pokemon?page=1&limit=20` | `/pokemon` | Paginated Pokemon list |
| GET | `/api/pokemon/search?name=pikachu` | `/pokemon/search` | Search by name |
| GET | `/api/pokemon/by-ids?ids=1,4,7` | `/pokemon/by-ids` | Batch fetch by IDs (favorites) |
| GET | `/api/pokemon/filter?types=Fire&minAttack=80` | `/pokemon/filter` | Filter by type and stats |
| GET | `/api/pokemon/list-all` | `/pokemon/list-all` | Lightweight list for comparator picker |
| GET | `/api/pokemon/:id` | `/pokemon/:id` | Single Pokemon by ID |
| POST | `/api/pokemon` | `/pokemon` | Create new Pokemon |
| PUT | `/api/pokemon/:id` | `/pokemon/:id` | Update existing Pokemon |
| DELETE | `/api/pokemon/:id` | `/pokemon/:id` | Delete a Pokemon |

## Project Structure

```
pokestats_with_battlemode/
├── index.html              # Entry HTML with Tailwind CDN, custom CSS, font
├── index.tsx               # React root with BrowserRouter + FavoritesProvider
├── App.tsx                 # Navbar + route definitions
├── types.ts                # TypeScript interfaces & TYPE_COLORS constant
├── vite.config.ts          # Vite config with /api proxy
├── tsconfig.json           # TypeScript config
├── package.json            # Dependencies & scripts
│
├── components/
│   ├── PokemonListPage.tsx     # Main list with search, pagination, favorites, filters
│   ├── PokemonDetailPage.tsx   # Detail view with stats, chart, edit/delete/favorite
│   ├── AddPokemonPage.tsx      # Create new Pokemon page
│   ├── PokemonCard.tsx         # TCG-style card component with favorite heart
│   ├── PokemonForm.tsx         # Reusable form for create & edit
│   ├── StatChart.tsx           # Recharts radar chart for a single Pokemon
│   ├── DeleteConfirmModal.tsx  # Confirmation modal for delete action
│   ├── PokeFilter.tsx          # Type & stat range filter panel
│   ├── ComparatorPage.tsx      # Side-by-side stats comparator page
│   └── PokemonPicker.tsx       # Searchable Pokemon selection modal
│
├── contexts/
│   └── FavoritesContext.tsx    # Favorites state (Set<number>) + localStorage
│
├── services/
│   └── pokemonApi.ts           # All API functions (9 total)
│
└── utils/                      # Utility helpers
```

## User Interactions

### Browsing
1. Open the app -> the Pokemon list loads (page 1, 20 cards)
2. Scroll through the grid, click Previous/Next for pagination
3. Type in the search bar -> results update after 400ms debounce
4. Click any card -> navigates to `/pokemon/:id` detail page

### Favorites
1. Click the heart icon on any card or on the detail page -> toggles favorite
2. Heart appears filled red when favorited, gray outline when not
3. On the list page, click the heart button next to the search bar -> shows only favorites
4. Favorites persist across browser sessions (stored in `localStorage` as `pokestats-favorites`)

### Filtering
1. Click the sliders icon next to the search bar -> opens the filter panel
2. Click type buttons to select/deselect types (multiple allowed)
3. Enter min/max values for any stat
4. The list updates automatically with each change (server-side filtering, paginated)
5. A red badge on the sliders icon shows the count of active filters
6. Click "Reset Filters" to clear everything

### Creating a Pokemon
1. Click "Add Pokemon" in the navbar -> navigates to `/pokemon/new`
2. Fill in names, select types, set base stats, optionally add image URL
3. Submit -> redirects to the new Pokemon's detail page

### Editing & Deleting
1. On a detail page, click the pencil icon -> edit form appears inline
2. Modify fields and click "Update Pokemon"
3. Click the trash icon -> confirmation modal appears
4. Confirm -> Pokemon is deleted and user returns to the list

### Comparing
1. Click "Compare" in the navbar -> navigates to `/compare`
2. Click "+" on the left or right slot -> Pokemon picker modal opens
3. Search or scroll to find a Pokemon, click to select
4. Once both slots are filled, the comparison section appears:
   - 6 dual-bar rows showing each stat side by side
   - BST total with winner/draw indicator
   - Overlaid radar chart with both Pokemon's profiles
5. Click on a filled slot to swap it, or click "Reset" to clear both

## Styling

The app uses a hand-drawn notebook aesthetic:
- **Font**: Patrick Hand (Google Fonts) for a handwritten feel
- **Background**: Cream paper (`#fffdf5`) with dotted grid pattern
- **Borders**: Solid 2px black borders on all interactive elements
- **Shadows**: Custom `draw-shadow` (4px offset) and `draw-shadow-sm` (2px offset) classes
- **Colors**: Yellow (`#fbbf24`) as primary accent, type-specific colors for badges and backgrounds
- **Interactions**: `active:translate-y-0.5` press effect, hover color transitions

## Data Model

### Pokemon (full)
```typescript
{
  _id?: string;          // MongoDB ObjectId
  id: number;            // Sequential integer (1, 2, 3...)
  name: {
    english: string;
    japanese: string;
    chinese: string;
    french: string;
  };
  type: string[];        // e.g. ["Fire", "Flying"]
  base: {
    HP: number;
    Attack: number;
    Defense: number;
    SpecialAttack: number;
    SpecialDefense: number;
    Speed: number;
  };
  image: string;         // URL to Pokemon image
}
```

### PokemonMini (lightweight, for comparator picker)
```typescript
{
  id: number;
  name: { english: string };
  type: string[];
  image: string;
}
```

## License
This project is for educational purposes. Pokemon is a trademark of Nintendo, Game Freak, and The Pokemon Company.
