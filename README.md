# mycycle – KI-gestützte Zyklusgesundheits-App

Demo einer React/TypeScript App für ganzheitliches Zyklusmonitoring mit KI-Insights, Wearable-Integration, zyklusbasiertem Coaching und Community.

## Demo-Zugangsdaten

| Nutzer | E-Mail | Passwort |
|--------|--------|----------|
| Sarah (Hauptnutzerin) | `sarah@demo.mycycle.app` | `demo2026` |
| Tom (Partner) | `tom@demo.mycycle.app` | `partner2026` |

### Einstiegspunkte

| Route | Beschreibung |
|-------|-------------|
| `/welcome` | Landing Page (Gast-Ansicht) |
| `/login` | Login-Formular |
| `/signup` | 4-stufige Registrierung mit DSGVO-Konsent |
| `/nutrition` | Zyklusbasierte Ernährung & Training |
| `/community` | Community-Forum |
| `/partner-login` | Partner-Login (Tom) |
| `/pitch` | Pitch-Präsentation (5 Folien) |

## Auth-System

Die App kennt drei Zustände:

| Zustand | Beschreibung |
|---------|-------------|
| `guest` | Nicht eingeloggt — nur Welcome, Login, Signup, Partner-Login und Pitch erreichbar |
| `demo` | Demo-Modus mit Beispieldaten von Sarah M. — alle Features sichtbar |
| `authenticated` | Eigener Account — Empty States mit CTA zum Demo-Modus |

- **Signup** speichert Credentials in `localStorage` (kein Backend)
- **Login** prüft gespeicherte oder Demo-Credentials
- **Demo-Modus** jederzeit aktivierbar, auch für authentifizierte Nutzer
- **DSGVO Art. 9**: Einwilligung zur Verarbeitung von Gesundheitsdaten im Signup-Flow

## Features

### Zyklustracking (Dashboard)
- Basaltemperaturkurve mit Sensiplan-Auswertung
- Zykluskalender mit Tageseintrag-Slideover und Medikamenten-Indikator
- Fruchtbarkeitsfenster-Prognose mit Konfidenzband
- Zyklusfortschritt und -historie
- Symptom-Heatmap (GitHub-Style Jahresübersicht)

### Ernährung & Training
- Tab-Ansicht: Ernährung und Training auf einer Seite
- **Ernährung**: Wichtige Nährstoffe pro Phase (oben), Mahlzeitenempfehlungen (unten)
- **Training**: Zyklusbasierte Workout-Empfehlungen mit Intensität, Dauer und Benefits
- Sportmedizinische Hinweise und Warnungen pro Zyklusphase
- Phasen-Guide mit Ernährungs- und Trainingstipps für alle 4 Phasen
- Dynamische Anpassung an aktuelle Zyklusphase

### Medikamenten-/Pillentracker
- Medikamente im Profil-Menü verwalten (hinzufügen, entfernen, aktivieren/deaktivieren)
- Tägliche Einnahme im Tageseintrag abhaken
- Kalender zeigt lila Punkt bei eingenommenen Medikamenten
- Push-Notifications bei vergessener Einnahme (Pille, Eisenpräparat etc.)
- Demo-Daten: Mikropille, Eisenpräparat, Magnesium

### Wearable-Integration (mycycle+)
- Verbundene Geräte (Oura Ring, Apple Watch, Garmin)
- HRV-, Schlaf- und Temperatur-Charts
- Activity Rings (Schritte, Schlaf, Kalorien)
- Multi-Zyklus-Overlay-Vergleich
- KI-Korrelationen (HRV & Schlaf vs. Zyklusphase)

### KI-Insights (mycycle+)
- Insight-Feed mit Tabs (Alle, Anomalien, Empfehlungen, Positiv)
- Anomalie-Banner für kritische Muster
- HealthScore-Widget und Monatszusammenfassung
- Tägliche Empfehlungen (Schlaf, Bewegung, Ernährung)
- PDF-Arzt-Export im Calm Medical Corporate Design (4 Seiten)

### Community
- Forum mit Mock-Posts zu Zyklusgesundheitsthemen
- 6 Kategorien: Zykluswissen, Kinderwunsch, Verhütung, Ernährung & Fitness, Erfahrungen
- Trending-Themen-Widget und Community-Regeln
- Pro-Beiträge mit Premium-Badge

### Partner-Ansicht (mycycle+)
- **Management-UI** (Demo): Verbundener Partner, Einladungslink, 6 Freigabe-Toggles
- **Inline-Vorschau**: Zeigt live, was der Partner sehen würde
- **Partner-Login** (Tom): Reduzierte Ansicht mit Status, Fruchtbarkeitsampel, Bildung
- **Familienplanung**: Kinderwunsch / Verhütung-Toggle beeinflusst Ampelfarben

### Monetarisierung
- **Freemium/Pro-Modell**: Basis kostenlos, mycycle+ ab 4,99 €/Monat (44,99 €/Jahr)
- **Pro-Badges** in Sidebar-Navigation bei Premium-Features
- **Upgrade-Banner** auf Wearables, Insights und Partner-Seiten
- **Basis (kostenlos)**: Zyklustracking, Ernährung & Training, Medikamenten-Tracker, Community
- **mycycle+**: Wearable-Integration, KI-Insights, Arzt-Export, Partner-Zugang

### Profil & UX
- Profilmenü (Name, E-Mail, Avatar-Upload, Medikamenten-Verwaltung)
- Dark Mode (System-Präferenz + Toggle)
- OnboardingTour für neue Nutzer
- Demo-Modus-Banner mit Wechsel zum eigenen Account
- KI-Chat-Interface mit 6 vorbereiteten Konversationen
- Notification Center mit simulierten Push-Benachrichtigungen
- Skeleton-Loading-States auf allen Seiten
- Responsive Mobile-Layout mit optimierter Bottom-Navigation

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

- **Vite 8 + React 19 + TypeScript 6** – Build-Tooling und Framework
- **Tailwind CSS v3** – Utility-first Styling mit Calm Medical Design-Tokens
- **react-router-dom v7** – Client-side Routing mit Auth-Guards
- **zustand** – State Management mit localStorage-Persistenz
- **recharts** – Datenvisualisierung (Charts)
- **jsPDF + jspdf-autotable** – PDF-Export
- **lucide-react** – Icons
- **framer-motion** – Page-Transitions und Animationen

## Design-Tokens (Calm Medical)

| Token | Farbe | Verwendung |
|-------|-------|-----------|
| Periwinkle | `#6F7CFF` | Primärfarbe, Buttons, Links |
| Purple | `#B391C8` | Akzent, Gradienten, Medikamenten-Indikator |
| Teal | `#7CC8B5` | Erfolg, Fruchtbarkeit, Wearable |
| Warm | `#E9DCC6` | Hintergrund-Akzente |
| Text | `#1A1625` | Haupttext |
| Muted | `#68627A` | Sekundärtext |
| BG | `#F8F7FA` | Seitenhintergrund |

## Projektstruktur

```
src/
  components/
    ui/          # Basis-Komponenten (Button, Card, Badge, Avatar, Skeleton, ...)
    layout/      # Sidebar, Header, AppLayout
    charts/      # Recharts-Komponenten (HRV, Schlaf, Temperatur, ...)
    *.tsx        # Feature-Komponenten (CurrentStatusCard, ProfileMenu, ProBadge, ...)
  pages/
    Welcome.tsx        # Landing Page
    Login.tsx          # Login-Formular
    Signup.tsx         # 4-stufige Registrierung
    Dashboard.tsx      # Hauptansicht mit Zyklusdaten
    Nutrition.tsx      # Phasenbasierte Ernährung & Training
    Wearables.tsx      # Wearable-Charts und Geräte
    Insights.tsx       # KI-Insights und Empfehlungen
    Community.tsx      # Community-Forum
    Partner.tsx        # Partner-Management und -Ansicht
    PartnerLogin.tsx   # Login für Partner
    Pitch.tsx          # Pitch-Präsentation (5 Folien)
  data/mock/     # Beispieldaten (6 Monate Zyklus, 90 Tage Wearable)
  store/         # Zustand (cycleStore, wearableStore, userStore, uiStore, medicationStore)
  utils/         # cycleUtils (Sensiplan, Prognosen)
  types/         # TypeScript-Interfaces (CycleDay, Medication, ...)
  hooks/         # useDemoDelay
```

## Releases

| Version | Highlights |
|---------|-----------|
| v1.0.0 | Grundgerüst: Design System, Mock-Daten, Dashboard, Wearables |
| v2.0.0 | KI-Chat, PDF-Export, Dark Mode, Notifications, Symptom-Heatmap |
| v3.0.0 | Calm Medical Design-Overhaul, neue Farbpalette |
| v4.0.0 | Auth-Flow (Login/Signup/DSGVO), PDF-Redesign im Corporate Design |
| v4.1.0 | Profil-Menü, Empty States, Partner-Management-UI, Inline-Vorschau |
| v5.0.0 | Community-Forum, Ernährungs-Seite, Pro/Freemium-Monetarisierung |
| v5.1.0 | Zyklusbasierte Trainingsempfehlungen, Ernährung & Sport kombiniert |
| v5.2.0 | Medikamenten-/Pillentracker, KI-Chat-Blase Fix, Nährstoffe priorisiert |
| v5.3.0 | Mobile-Layout-Fixes, Responsive Dropdowns, Namenskorrektur mycycle |
