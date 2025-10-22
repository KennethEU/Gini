# Gini-koefficient Simulator 📊

En interaktiv webapplikation til at udforske indkomstulighed og effekten af forskellige skattesystemer.

## 🎯 Formål

Denne webapp gør det muligt for elever at:
- Forstå hvad Gini-koefficienten er og hvordan den måles
- Visualisere indkomstfordeling med Lorenz-kurver
- Eksperimentere med forskellige skattesystemer
- Se hvordan progressive skatter påvirker ulighed
- Sammenligne med virkelige landes Gini-koefficienter

## 🚀 Sådan kommer du i gang

### Åbn applikationen

Du kan åbne applikationen på flere måder:

1. **Direkte i browser**:
   - Dobbeltklik på `index.html`
   - Eller højreklik og vælg "Åbn med" → din foretrukne browser

2. **Med lokal webserver** (anbefalet for bedste ydeevne):
   ```bash
   # I webapp mappen:
   python -m http.server 8000
   # Åbn derefter http://localhost:8000 i din browser
   ```

   Eller med Node.js:
   ```bash
   npx http-server -p 8000
   ```

## 📚 Hvordan man bruger simulatoren

### 1. Hurtstart med præ-definerede scenarier

Klik på en af scenarie-knapperne for straks at se hvordan forskellige lande ser ud:
- 🇩🇰 **Danmark**: Moderat ulighed med progressiv skat (Gini ~0.28)
- 🇺🇸 **USA**: Højere ulighed med lavere skatter (Gini ~0.41)
- 🇸🇪 **Sverige**: Lav ulighed med høj progressiv skat (Gini ~0.27)
- ⚖️ **Perfekt Lighed**: Teoretisk scenarie hvor alle har samme indkomst

### 2. Tilpas befolkningen

**Antal personer**: Juster hvor mange individer der skal simuleres (50-1000)

**Indkomstgrupper**: Vælg hvor mange indkomstgrupper befolkningen skal opdeles i (5-20)

**Indkomstspredning**: Bestem indkomstforskellen mellem grupper (50,000-300,000 kr)

### 3. Vælg indkomstfordeling

Vælg hvordan befolkningen er fordelt over indkomstgrupper:
- **Ligeligt fordelt**: Samme antal i hver gruppe
- **Normal fordeling**: Mest i midten (bell curve)
- **Skæv fordeling**: Flere i lavere indkomstgrupper (mest realistisk)
- **Ekstrem ulighed**: Meget få rige, mange fattige

### 4. Design et skattesystem

**Tilføj skattetrin**:
- Klik "+ Tilføj skattetrin" for at tilføje flere
- Indtast tærskel (fx 50,000 kr) og sats (fx 15%)
- Progressive skatter har højere satser for højere indkomster

**Eksempel på progressiv skat**:
```
Trin 1: 50,000 kr @ 8%   → Første 50k beskattes med 8%
Trin 2: 200,000 kr @ 12%  → Næste 200k beskattes med 12%
Trin 3: 400,000 kr @ 15%  → Resten beskattes med 15%
```

### 5. Beregn og analyser

Klik på "Beregn Gini-koefficient" for at se resultaterne:
- **Lorenz-kurven**: Viser fordelingen af indkomst
- **Gini før skat**: Ulighed uden indgriben
- **Gini efter skat**: Ulighed efter omfordeling
- **Ændring**: Hvor meget skatterne reducerede uligheden

## 📊 Hvordan man læser graferne

### Lorenz-kurven

- **X-aksen**: Andel af befolkningen (0-100%)
- **Y-aksen**: Andel af total indkomst (0-100%)
- **Blå kurve**: Den faktiske indkomstfordeling
- **Lilla stiplet linje**: Perfekt lighed (45-graders linje)

**Jo længere kurven er fra 45-graders linjen, jo større er uligheden**

### Gini-koefficienten

- **0.00-0.25**: Meget lav ulighed (som Norge, Sverige)
- **0.25-0.35**: Lav-moderat ulighed (som Danmark, Tyskland)
- **0.35-0.45**: Moderat-høj ulighed (som USA, UK)
- **0.45+**: Høj ulighed (som Brasilien, Sydafrika)

## 🎓 Uddannelsesmæssige udfordringer

Webapp'en inkluderer udfordringer for at lære mere:

1. "Reducer uligheden til under 0.30 ved kun at ændre skattesystemet"
2. "Skab en fordeling der ligner Danmarks med Gini omkring 0.28"
3. "Reducer uligheden med mindst 20% gennem beskatning"

Prøv at løse udfordringerne for at forstå hvordan forskellige faktorer påvirker ulighed!

## 🔧 Teknisk information

### Teknologier
- **HTML5/CSS3**: Moderne responsive design
- **Vanilla JavaScript**: Ingen frameworks nødvendige
- **Chart.js**: Lorenz-kurve visualisering
- **Porteret fra Java**: Samme beregningslogik som original kodebase

### Filstruktur
```
webapp/
├── index.html              # Hovedside
├── css/
│   └── style.css          # Styling
├── js/
│   ├── gini-calc.js       # Beregningslogik (porteret fra Java)
│   ├── chart-handler.js   # Chart.js integration
│   ├── scenarios.js       # Præ-definerede scenarier
│   └── ui-controller.js   # UI kontroller (main entry point)
└── README.md              # Denne fil
```

### Browser kompatibilitet
- Chrome/Edge: ✅ Fuld support
- Firefox: ✅ Fuld support
- Safari: ✅ Fuld support
- Internet Explorer: ❌ Ikke supporteret

## 🎯 Læringsmål

Efter at have brugt simulatoren skulle eleverne kunne:

1. **Forklare** hvad Gini-koefficienten måler
2. **Forstå** hvordan Lorenz-kurven visualiserer ulighed
3. **Analysere** effekten af progressive vs. flade skatter
4. **Sammenligne** forskellige landes tilgange til omfordeling
5. **Diskutere** afvejningen mellem lighed og økonomiske incitamenter

## 💡 Undervisningsforslag

### Aktivitet 1: Udforsk scenarier
- Lad eleverne prøve alle 4 præ-definerede scenarier
- Diskutér: Hvorfor er der så stor forskel mellem landene?

### Aktivitet 2: Design et skattesystem
- Gruppe-opgave: Design et "perfekt" skattesystem
- Mål: Reducer ulighed men behold incitamenter til at arbejde

### Aktivitet 3: Sammenlign med virkeligheden
- Brug sammenlignings-sektionen nederst
- Diskutér: Hvad gør de nordiske lande anderledes end USA?

### Aktivitet 4: Ekstreme eksperimenter
- Hvad sker der med perfekt flad skat (samme % for alle)?
- Hvad sker der hvis kun de rigeste betaler al skat?

## 🐛 Fejlfinding

**Problem**: Grafer vises ikke
- **Løsning**: Tjek at du har internet-forbindelse (Chart.js loader fra CDN)

**Problem**: Beregninger virker ikke
- **Løsning**: Åbn browser console (F12) og tjek for fejl

**Problem**: Layout ser mærkeligt ud
- **Løsning**: Brug en moderne browser (Chrome, Firefox, Safari)

## 📝 Licens

Dette projekt er lavet til uddannelsesformål og kan bruges frit i undervisning.

## 🤝 Bidrag

Forslag til forbedringer er velkomne! Kontakt udvikler eller opret en issue.

---

**God fornøjelse med at udforske indkomstulighed! 📊🎓**
