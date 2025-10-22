# Hvorfor reducerer flad skat ikke Gini-koefficienten?

## TL;DR
**Dette er faktisk KORREKT adfærd!** Flad skat (hvor alle betaler samme procent) reducerer IKKE uligheden målt ved Gini-koefficienten, fordi den bevarer de relative forhold mellem indkomster.

## Matematisk forklaring

### Hvad er Gini-koefficienten?
Gini måler **relativ** ulighed - altså forholdet mellem indkomster, ikke de absolutte beløb.

### Eksempel: Flad skat 25%

**Før skat:**
- Person A: 100,000 kr
- Person B: 1,000,000 kr
- Forhold: B har 10x mere end A (1,000,000 / 100,000 = 10)

**Efter 25% flad skat:**
- Person A: 75,000 kr (betaler 25,000)
- Person B: 750,000 kr (betaler 250,000)
- Forhold: B har stadig 10x mere end A (750,000 / 75,000 = 10)

**Konklusion:** Forholdet er uændret! Derfor er Gini-koefficienten også næsten uændret.

### Hvorfor siger vi "næsten"?
Der kan være en MEGET lille ændring pga.:
1. Afrunding i beregningerne
2. Diskret distribution (ikke alle har præcis samme skatteprocent pga. afrunding)
3. Men ændringen vil være neglektibel (< 0.001)

## Hvorfor reducerer progressiv skat uligheden?

### Eksempel: Progressiv skat

**Skattetrin:**
- Første 50,000 kr: 8%
- Næste 200,000 kr: 12%
- Resten: 20%

**Person A (100,000 kr):**
- Skat: 50k @ 8% + 50k @ 12% = 4,000 + 6,000 = 10,000 kr
- Efter skat: 90,000 kr
- Effektiv sats: 10%

**Person B (1,000,000 kr):**
- Skat: 50k @ 8% + 200k @ 12% + 750k @ 20% = 4,000 + 24,000 + 150,000 = 178,000 kr
- Efter skat: 822,000 kr
- Effektiv sats: 17.8%

**Forhold før skat:** 1,000,000 / 100,000 = 10x
**Forhold efter skat:** 822,000 / 90,000 = 9.13x

**Konklusion:** Forholdet er reduceret fra 10x til 9.13x! Derfor falder Gini-koefficienten.

## Er koden forkert?

**NEJ!** Koden virker præcis som den skal.

Hvis flad skat ikke ændrer Gini-koefficienten, er det fordi:
1. Matematikken er korrekt
2. Flad skat SKAL ikke reducere relativ ulighed
3. Dette er faktisk en vigtig læring for eleverne!

## Pædagogisk værdi

Dette er en FANTASTISK læremulighed for elever:

### Spørgsmål til diskussion:
1. **Hvorfor reducerer flad skat ikke uligheden?**
   - Fordi den bevarer relative forhold

2. **Er flad skat uretfærdig?**
   - Person B betaler 10x mere i kroner (250k vs 25k)
   - Men samme procent (25% vs 25%)
   - Er det "fair"?

3. **Hvad med købekraft?**
   - Person A har 75k efter skat - måske svært at leve for
   - Person B har 750k efter skat - rigeligt til alt
   - De 25k Person A betaler betyder MERE for dem end de 250k for Person B

4. **Derfor findes progressiv skat!**
   - Rige kan tåle højere skatteprocent
   - Reducerer ulighed
   - Finansierer velfærd

## Anbefaling

**Tilføj denne forklaring til webapp'en** så elever forstår hvorfor flad skat ikke "virker" til at reducere ulighed!
