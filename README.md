# Vremenska prognoza - Kosovska Mitrovica

Ovo je studentski projekat web aplikacije koja koristi javni JSON web servis i prikazuje realne podatke za vremensku prognozu.

## Tehnologije

- Node.js
- Express.js
- HTML
- CSS
- JavaScript
- Open-Meteo JSON API

## Šta aplikacija radi?

Aplikacija preko backend rute `/api/weather` poziva Open-Meteo web servis i preuzima JSON podatke za Kosovsku Mitrovicu.

Frontend ne prikazuje sirovi JSON, već podatke prikazuje smisleno:

- trenutna temperatura
- subjektivni osećaj
- opis vremena
- vlažnost vazduha
- padavine
- brzina vetra
- prognoza za 7 dana u tabeli

## Pokretanje projekta

1. Instalirati Node.js sa sajta: https://nodejs.org/
2. Otvoriti terminal u folderu projekta.
3. Pokrenuti komandu:

```bash
npm install
```

4. Zatim pokrenuti aplikaciju:

```bash
npm start
```

5. Otvoriti u browseru:

```text
http://localhost:3000
```

## Napomena

Za rad aplikacije je potrebna internet konekcija, jer se podaci povlače sa web servisa.


## PWA verzija

Aplikacija je dopunjena kao PWA (Progressive Web App). To znači da može da se instalira iz pregledača kao aplikacija na računar ili telefon.

Dodati PWA fajlovi:

- `public/manifest.json` - opis aplikacije, naziv, boje i ikonice
- `public/service-worker.js` - keširanje osnovnih fajlova i poslednje učitane prognoze
- `public/icons/` - ikonice aplikacije

## Instalacija kao aplikacija

1. Pokrenuti server komandom:

```bash
npm start
```

2. Otvoriti u Chrome-u ili Edge-u:

```text
http://localhost:3000
```

3. U adresnoj traci kliknuti na ikonicu za instalaciju aplikacije ili izabrati opciju:

```text
Install app / Instaliraj aplikaciju
```

Na telefonu se aplikacija može instalirati ako je projekat postavljen online preko HTTPS servera, npr. Render, Vercel ili Netlify za frontend.
