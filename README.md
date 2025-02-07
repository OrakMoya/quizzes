# Quizzes

#### Upute za postavljanje

1. Izvršiti `npm install `  unutar glavnog direktorija
2. Stvoriti `.env` datoteku unutar glavnog direktorija
	1. Definirati varijablu `DATABASE_URL` koja sadrži putanje do SQLite baze podataka koju će projekt koristiti.
	2. Definirati varijablu `APP_SECRET` koji sadrži sekvencu od 32 nasumično generiranih slova i brojeva koji će se koristiti za enkriptiranje Json Web Tokena.
3. Stvoriti praznu datoteku na lokaciji `DATABASE_URL` environment varijable u koju će se spremati SQLite baza podataka.
4. Pokrenuti `npm run db:push` kako bi se stvorila inicijalna baza podataka
5. Pokrenuti `npm run dev` kako bi se pokrenuo development server ili `npm run build` te `npm run start` kako bi se pokrenuo produkcijski server
6. Stvoriti prvog korisnika, koji će ujedno biti dodjeljen ulogu "App Owner" unutar projekta