# PokeStats - Pokemon TCG Card Viewer & Battle Simulator

A modern, interactive web application for browsing Pokemon Trading Card Game (TCG) cards and comparing Pokemon stats in a battle arena.

> **📚 For technical documentation, architecture details, and sequence diagrams, see [TECHNICAL_DOCS.md](./TECHNICAL_DOCS.md)**

## Features

### 🎴 TCG Card Browser
- Browse real Pokemon TCG cards from different series and sets
- High-quality card images powered by [TCGdex API](https://www.tcgdex.net/)
- Search functionality to quickly find specific Pokemon
- Automatic filtering to show only Pokemon cards (hides Trainer, Energy, and Stadium cards)

### 📊 Pokemon Stats Viewer
- Click any card to view detailed Pokemon information
- Stats visualization with interactive radar charts
- Type information with color-coded badges
- Abilities and characteristics display
- Pokemon cries audio playback

### ⚔️ Battle Arena
- Compare two Pokemon side-by-side
- Visual stat comparison with color-coded bars
- Radar chart overlay to see stat differences
- Predict battle outcomes based on stats
- Type advantage/disadvantage system

### 🎯 Smart Card Handling
- **Unified Pokemon Cards**: All variants of a Pokemon (ex, V, VMAX, VSTAR, GX, etc.) show the same base Pokemon stats
  - Example: "Pikachu ex", "Pikachu V", and "Pikachu VMAX" all display regular Pikachu's stats
  - This ensures consistent battle comparisons across different card variants
- **Category Filtering**: Automatically filters out non-Pokemon cards
  - Only shows Pokemon cards in the grid
  - Hides Trainer, Energy, Stadium, and other card types

## Technical Implementation

### Architecture
```
pokestats_with_battlemode/
├── components/          # React components
│   ├── PokemonCard.tsx         # Card display with TCG images
│   ├── PokemonDetail.tsx       # Detailed Pokemon view modal
│   ├── BattleArena.tsx         # Battle comparison interface
│   ├── StatChart.tsx           # Recharts radar chart
│   ├── TradingCard.tsx         # TCG-style card generator
│   └── PokemonCardGenerator.tsx # Card download functionality
├── services/            # API integration
│   ├── tcgdex.ts               # TCGdex API for card images
│   └── pokeapi.ts              # PokeAPI for Pokemon data
├── types.ts            # TypeScript interfaces
└── App.tsx             # Main application component
```

### Key Technologies
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Recharts** - Data visualization
- **Lucide React** - Icon system
- **Tailwind CSS** - Styling (via classes)
- **html2canvas** - Card image generation

### APIs Used
1. **TCGdex API** (`https://api.tcgdex.net/v2/en`)
   - Fetches Pokemon TCG series, sets, and card images
   - Provides high-quality card artwork
   - Returns card categories (Pokemon, Trainer, Energy)

2. **PokeAPI** (`https://pokeapi.co/api/v2`)
   - Fetches Pokemon stats, types, and abilities
   - Provides official Pokemon artwork
   - Returns Pokemon cries audio

### Name Normalization System
The app uses a smart name normalization system to handle TCG card variants:

```typescript
// Removes TCG-specific suffixes
normalizePokemonName("Charizard ex") → "charizard"
normalizePokemonName("Pikachu VMAX") → "pikachu"
normalizePokemonName("Mewtwo GX") → "mewtwo"
```

**Supported suffixes:**
- ex, EX
- V, VMAX, VSTAR
- GX
- Radiant, Prime
- LEGEND, BREAK
- Tag Team variants

This ensures all card variants fetch the same base Pokemon data for consistency.

### Card Filtering
Cards are filtered in real-time:
- **Search filter**: Matches Pokemon names (case-insensitive)
- **Category filter**: Shows only Pokemon cards, hides:
  - Trainer cards (Supporter, Item, Stadium, Tool)
  - Energy cards (Basic, Special)
  - Other special card types

## User Interface

### Navigation Bar
- **Series Selector**: Choose Pokemon TCG series (e.g., Scarlet & Violet, Sword & Shield)
- **Set Selector**: Choose specific sets within a series
- **Battle Button**: Opens battle arena (shows count of selected Pokemon)
- **Search Bar**: Filter cards by name

### Card Grid
- Responsive grid layout (1-4 columns based on screen size)
- Real TCG card images with lazy loading
- Click any card to view details
- In battle mode, click cards to select fighters

### Battle Selection Mode
- Activated when selecting Pokemon for battle
- Yellow banner shows selected Pokemon
- Visual indicators on cards
- "Clear" and "Done" buttons for easy management
- Auto-opens battle arena when 2 Pokemon are selected

### Battle Arena
- Split-screen layout comparing two Pokemon
- Stat bars with color coding (higher values in green)
- Overlay radar chart showing stat profiles
- "Reset" to clear selection
- "Select New" to choose different Pokemon

## Installation

### Prerequisites
- Node.js 16+ and npm

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd pokestats_with_battlemode

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

### Project Structure
- `App.tsx` - Main app logic, state management, TCG data loading
- `components/` - Reusable React components
- `services/` - API integration functions
- `types.ts` - TypeScript type definitions

### Key State Management
```typescript
// TCG Data
- series: Available TCG series
- sets: Sets in selected series
- cardList: Cards in selected set
- filteredList: Filtered cards (search + category)

// Modal State
- selectedPokemon: Currently viewed Pokemon details

// Battle State
- fighter1, fighter2: Selected Pokemon for comparison
- showComparison: Battle arena visibility
- isSelectionMode: Battle selection active
```

### Styling Approach
- Custom CSS classes with "draw" prefix for retro/TCG aesthetic
- Tailwind-style utility classes
- Responsive design with mobile-first approach
- Custom shadows and borders for card effects

## Recent Updates

### Version 2.0 - Smart Card Handling
1. **Name Normalization**: All TCG card variants now map to base Pokemon
2. **Category Filtering**: Non-Pokemon cards are automatically hidden
3. **Unified Modals**: Same Pokemon shows same stats regardless of card variant
4. **Battle Consistency**: All variants of a Pokemon can be compared equally

### Code Cleanup
- Removed temporary files
- Updated .gitignore for temporary files
- Organized service layer
- Improved type definitions

## Usage Tips

1. **Browse Cards**: Select a series and set to load cards
2. **View Details**: Click any card to see detailed stats
3. **Compare Pokemon**:
   - Click the battle icon (⚔️)
   - Select two Pokemon from the grid
   - Battle arena opens automatically
4. **Search**: Use the search bar to find specific Pokemon quickly

## Future Enhancements
- Save favorite Pokemon
- More detailed battle mechanics
- Type effectiveness calculations
- Move sets and abilities in battle view
- Card collection tracker
- Advanced filtering (by type, HP, etc.)

## Credits
- [TCGdex](https://www.tcgdex.net/) - Pokemon TCG card data and images
- [PokeAPI](https://pokeapi.co/) - Pokemon game data and stats
- Icons by [Lucide](https://lucide.dev/)
- Built with React, TypeScript, and Vite

## License
This project is for educational purposes. Pokemon and Pokemon TCG are trademarks of Nintendo, Game Freak, and The Pokemon Company.
