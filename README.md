# IT-Quiz

En nettside hvor brukere kan lage og ta ulike IT-quizzer, laget for IT-utdanning.no.

## Funksjonalitet

- Brukergenererte quizzer (tilsvarende Kahoot/Sporcle)
- Innlogging for brukere og administratorer
- Mulighet for brukere å lage egne quizzer
- Admin-panel for å administrere brukere og slette quizzer
- FAQ-side
- Varierte spørsmål og svarformater med fokus på IT-faglige temaer

## Teknisk oppsett

- Backend: Node.js med Express
- Databaseserver: MongoDB på 10.12.3.98
- Frontend: EJS-templates med Tailwind CSS
- Hosting: Virtuell server (VM)

## Prosjektstruktur

```
IT-Quiz/
├── server/           # Backend-kode
│   ├── models/       # MongoDB-modeller
│   ├── routes/       # API-ruter
│   ├── controllers/  # Kontrollere for håndtering av forespørsler
│   ├── middleware/   # Middleware (auth, etc.)
│   └── config/       # Konfigurasjonsfiler
├── views/            # EJS-templates
├── public/           # Statiske filer (CSS, JS, bilder)
└── docs/             # Dokumentasjon
```

## Kom i gang

1. Klone repoet
2. Installer avhengigheter: `npm install`
3. Start serveren: `npm start`
4. Gå til `http://localhost:3000` i nettleseren

## Todo-liste

- [x] Sette opp prosjektstruktur
- [ ] Implementere brukerautentisering
- [ ] Lage databasemodeller
- [ ] Utvikle API-endepunkter
- [ ] Bygge brukergrensesnitt
- [ ] Implementere quiz-funksjonalitet
- [ ] Legge til admin-funksjonalitet
- [ ] Utvikle FAQ-side
- [ ] Lage minst tre eksempel-quizzer
- [ ] Deploye til VM-server
