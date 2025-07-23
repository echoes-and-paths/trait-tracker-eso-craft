# ESO Crafting Research Tracker

A comprehensive Elder Scrolls Online crafting research tracker built with React, TypeScript, and TailwindCSS. Track your trait research progress across all crafting professions with multiple character profile support.

## Features

- **Multi-Character Support**: Create and manage multiple character profiles
- **Complete Crafting Coverage**: Track all four major crafting lines:
  - Blacksmithing (Weapons & Heavy Armor)
  - Clothing (Light & Medium Armor)
  - Woodworking (Weapons & Shields)
  - Jewelry Crafting (Rings & Necklaces)
- **Progress Tracking**: Visual checkboxes for each trait research with progress bars
- **Notes System**: Add research notes for each item with modal interface
- **Smart Search**: Filter items and traits in real-time
- **Theme Support**: Toggle between light and dark themes (saved per profile)
- **Data Persistence**: Data synced to Supabase with online persistence
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom ESO-themed design system
- **UI Components**: shadcn/ui component library
- **State Management**: React hooks with Supabase synchronization
- **Icons**: Lucide React icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd eso-crafting-research-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Copy the example environment file and add your Supabase credentials:
```bash
cp .env.example .env
# then edit .env to include your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```
4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:8080`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage Guide

### Creating Your First Profile

1. Click the "+" button next to the profile selector
2. Enter your character name
3. Click "Create Profile" to get started

### Tracking Research Progress

1. Navigate to any crafting section (Blacksmithing, Clothing, etc.)
2. Click the checkboxes next to traits you've researched
3. Watch your progress bar update in real-time
4. Use the search bar to quickly find specific items or traits

### Adding Notes

1. Click the 📝 icon next to any item name
2. Add your research notes in the modal
3. Notes are automatically saved and the icon highlights when notes exist

### Managing Profiles

- **Switch Profiles**: Use the dropdown to change between characters
- **Rename Profile**: Click the edit (✏️) button
- **Delete Profile**: Click the trash (🗑️) button (requires confirmation)
- **Reset Progress**: Use the reset button to clear all research for current profile

### Themes

Click the sun/moon icon to toggle between light and dark themes. Your preference is saved per character profile.

## Data Storage

Data is now synced with a Supabase backend. The following tables are used:

- `trait_progress`
- `item_notes`
- `bank_status`
- `research_timers`

On first login any existing localStorage data will be uploaded to Supabase and localStorage is cleared. Subsequent changes are written directly through the API so your progress is kept in sync across devices.

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Controls.tsx    # Search and theme controls
│   ├── CraftingTable.tsx # Main research tracking table
│   ├── NotesModal.tsx  # Notes editing modal
│   ├── ProgressBar.tsx # Progress visualization
│   └── ProfileManager.tsx # Character profile management
├── data/               # Crafting data and types
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── pages/              # Application pages
```

### Adding New Crafting Data

To add new items or traits, edit `src/data/craftingData.ts`:

```typescript
export const CRAFTING_DATA = {
  newSection: {
    name: "New Crafting Section",
    traits: ["Trait1", "Trait2", "Trait3"],
    items: [
      { name: "Item Name", traits: [] }
    ]
  }
};
```

### Customizing Themes

Edit the CSS variables in `src/index.css` to customize colors:

```css
:root {
  --primary: 45 90% 55%;  /* ESO Gold */
  --accent: 200 95% 60%;  /* ESO Blue */
  /* ... other colors */
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Elder Scrolls Online by Bethesda Game Studios
- ESO crafting community for trait research data
- shadcn/ui for the excellent component library
- Lucide React for beautiful icons

---

**Note**: This is a fan-made tool and is not affiliated with or endorsed by Bethesda Game Studios or ZeniMax Online Studios.