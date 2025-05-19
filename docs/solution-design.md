# Solution Design: “Where I’ve Worked” Map App

---

## 1. Project Structure

### Monorepo Layout

```
/projects/
  nextjs/
    app/
      page.tsx               # Homepage or landing
      map/
        page.tsx             # World map sub-app
        components/
          WorldMap.tsx
          PinList.tsx
          CountryHighlight.tsx
        hooks/
          useMapData.ts
        styles/
          map.module.css
    public/
      data/
        pins.json            # Static pin data
    bunfig.toml              # Bun project config
/dist/
  nextjs/                    # Cloudflare Pages build output
/bunfig.toml                 # Root monorepo config
```

---

## 2. User Flow

### Initial View (/map)

- Dark-themed world map with solid countries and white borders.
- Pins visible where people were worked with.
- Pins visually distinguish between exact vs approximate locations.
- No country is selected/highlighted.

### Click a Pin

- Zooms into the country with a smooth animation.
- Highlight the country by applying a different fill color.
- Show a list of pins within that country below the map (mobile) or to the side (desktop).
- Tooltip shows on pins in this zoomed-in view.

### Back to World View

- Clicking “Back to World View” zooms out with animation.
- Highlights and list are cleared.

---

## 3. Data Model (`pins.json`)

```json
[
  {
    "lat": 51.5074,
    "lng": -0.1278,
    "label": "London, UK",
    "company": "Acme Ltd",
    "year": 2021,
    "exact": true,
    "note": "Cool fintech project with global team"
  },
  {
    "lat": 48.8566,
    "lng": 2.3522,
    "label": "France",
    "company": "Startup XYZ",
    "year": 2019,
    "exact": false
  }
]
```

---

## 4. Components

| Component            | Purpose |
|----------------------|---------|
| `WorldMap.tsx`       | Renders SVG map using `react-simple-maps`. Manages zoom and highlights. |
| `PinList.tsx`        | Shows filtered list of pins per selected country. |
| `CountryHighlight.tsx` | Highlights selected country via fill color change. |
| `BackButton.tsx`     | Resets view to world map. |
| `useMapData.ts`      | Loads and filters pin data. |

---

## 5. Technology Choices

| Purpose        | Tool                      | Notes |
|----------------|---------------------------|-------|
| UI Framework   | Next.js                   | App Router (`/app`), deployed via Cloudflare Pages |
| Styling        | TailwindCSS               | Dark mode, clean layout |
| Map Rendering  | `react-simple-maps`       | SVG-based, zero tile/server dependencies |
| Animation      | `framer-motion`           | Smooth transitions for zoom and highlights |
| Data           | Static JSON               | Loaded from `/public/data/pins.json` |
| Hosting        | Cloudflare Pages          | Output to `/dist/nextjs/`, optimized for static serving |

---

## 6. Responsiveness & UI Design

| Device   | Layout |
|----------|--------|
| Mobile   | Stack vertically: Map → Pin List |
| Desktop  | Split screen: Map (2/3 left), List (1/3 right) |
| Theme    | Dark background, bright blue fills, white borders, soft shadows, modern sans-serif |

- “Back to World View” is a fixed button when zoomed.
- Tooltips only show when a country is selected.

---

## 7. Performance Considerations

- Use `ZoomableGroup` with controlled `center` and `zoom` props.
- Animate transitions with `framer-motion` based on selected country.
- GeoJSON Topology and pins loaded once and memoized.
- Render only visible SVG paths to keep mobile performance crisp.
- iPhone 15 Pro Max will have zero issues even with 200+ pins.

---

## 8. Future Enhancements

| Feature            | Plan |
|--------------------|------|
| Admin UI           | Auth-gated route (`/admin`) using Cloudflare Access or CF Identity |
| Editable Pins      | Save to Cloudflare KV, D1, or Durable Objects |
| Auth               | CF Access via GitHub or custom token |
| Offline Support    | Built-in via static Next.js + JSON |
| Hosting Other Sub-Apps | Add new folders under `/projects/`, build into `/dist/[name]/` |

---

## 9. MVP Acceptance Criteria

- [ ] Next.js renders map at `/map`
- [ ] Static JSON loads and displays pins
- [ ] World map shows all pins with visual distinction for `exact`
- [ ] Clicking a pin zooms into country and highlights it
- [ ] Pin list displays below or beside map (responsive)
- [ ] Back button resets to world view
- [ ] Smooth transitions for zoom/highlight
- [ ] All styling matches modern dark/futuristic theme
