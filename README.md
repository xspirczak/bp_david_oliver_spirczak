# bp_spirczak - CipherMatcher

Webová aplikácia na mapovanie substitučných šifrovacích kľúčov na šifrované texty.  
Projekt je vytvorený pomocou MERN stacku (MongoDB, Express, React, Node.js).\
Súčasť bakalárskej práce.
---

## Požiadavky

- [Node.js](https://nodejs.org/en/download) – JavaScript runtime
- [MongoDB Compass](https://www.mongodb.com/try/download/compass) – vizuálny nástroj na správu databázy

---

## Klonovanie projektu

Naklonuj si repozitár do svojho počítača:

```bash
git clone https://github.com/xspirczak/bp_david_oliver_spirczak.git
cd bp_david_oliver_spirczak
```

### Inštalácia balíkov

V termináli otvor adresár `bp_david_oliver_spirczak` a spusti:

```bash
npm install
```

### Nastavenie databázy

- Spusti MongoDB Compass.

- Pripoj sa k lokálnej databáze cez URI:
    - `mongodb://localhost:27017`
- Vytvor novú databázu:
  - Názov databázy: `keys`
- Vytvor kolekcie v databáze
  - Kolekcia s názvom: `keys`
  - Kolekcia s názvom: `texts`
  - Kolekcia s názvom: `users`


## Konfigurácia prostredia (.env)

V koreňovom adresári projektu vytvor súbor `.env` so nasledujúcim obsahom:

```bash
EMAIL_USER=váš_email
EMAIL_PASS=heslo
JWT_SECRET=tajny_jwt_string
VITE_API_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/keys
VITE_GOOGLE_CLIENT_ID=google_client_id
PORT=3000
```