# mycicle – KI-gestützte Zyklusgesundheits-App

Demo einer React/TypeScript App für Zyklusmonitoring mit KI-Insights und Wearable-Integration.

## Demo-Zugangsdaten

| Nutzer | E-Mail | Passwort |
|--------|--------|----------|
| Sarah (Hauptnutzerin) | `sarah@demo.mycicle.app` | `demo2026` |
| Tom (Partner) | `tom@demo.mycicle.app` | `partner2026` |

Partner-Login über: `/partner-login`
Pitch-Präsentation: `/pitch`

## Lokales Setup

```bash
npm install
npm run dev
```

Build:
```bash
npm run build
```

## Tech Stack

- **Vite + React 18 + TypeScript** – Build-Tooling und Framework
- **Tailwind CSS v3** – Utility-first Styling
- **react-router-dom v6** – Client-side Routing
- **zustand** – State Management
- **recharts** – Datenvisualisierung (Charts)
- **lucide-react** – Icons
- **framer-motion** – Animationen

## Projektstruktur

```
src/
  components/
    ui/          # Basis-Komponenten (Button, Card, Badge, Chip, ...)
    layout/      # Sidebar, Header, AppLayout
    charts/      # Recharts-Komponenten (HRV, Schlaf, Temperatur, ...)
    *.tsx        # Feature-Komponenten
  pages/
    Dashboard.tsx      # Hauptansicht mit Zyklusdaten
    Wearables.tsx      # Wearable-Charts und Geräte
    Insights.tsx       # KI-Insights und Empfehlungen
    Partner.tsx        # Partner-Ansicht
    PartnerLogin.tsx   # Login für Partner
    Pitch.tsx          # Pitch-Präsentation (5 Folien)
  data/mock/     # Beispieldaten (6 Monate Zyklus, 90 Tage Wearable)
  store/         # Zustand (cycleStore, wearableStore, userStore, uiStore)
  utils/         # cycleUtils (Sensiplan, Prognosen)
  types/         # TypeScript-Interfaces
  hooks/         # useDemoDelay
```

## Phasenübersicht

| Phase | Feature |
|-------|---------|
| 0 | Vite + Tailwind + Dependencies Setup |
| 1 | Design System (Button, Card, Badge, Sidebar, Header) |
| 2 | Mock-Daten (6 Monate Zyklus, 90 Tage Wearable) + Stores |
| 3 | Dashboard (Temperaturkurve, Kalender, FertileWindow, History) |
| 4 | Wearables (HRV-Chart, Schlaf-Chart, ActivityRing, Korrelationen) |
| 5 | KI-Insights (Feed, Anomalie-Banner, HealthScore, Empfehlungen) |
| 6 | Partner-Ansicht (Login, Ampel, Bildungsinhalt, FamilyPlanning) |
| 7 | Polish (DemoModeBanner, OnboardingTour, PageTransition, Pitch) |

## V2 Features

- ✨ KI-Chat-Interface mit 6 vorbereiteten Demo-Konversationen
- 📄 Echter PDF-Arzt-Export (jsPDF, 4 Seiten)
- 🌙 Dark Mode (System-Präferenz + manueller Toggle)
- 🔔 Notification Center mit 8 simulierten Push-Benachrichtigungen
- 📊 Symptom-Heatmap (GitHub-Style Jahresübersicht, 3 Ansichtsmodi)
- 📈 Multi-Zyklus-Overlay + Konfidenzband-Prognose
