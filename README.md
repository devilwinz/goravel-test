## Get started
1. Get inside goravel folder

2. Copy .env.example to .env

   ```windows cmd
   copy .env.example .env
   ```

   ```linux
   cp .env.example .env
   ```

3. Set up the env
   - change APP_URL to http://0.0.0.0:{Your Chosen Port} 
   - change APP_HOST to 0.0.0.0 and APP_PORT to match your chosen port
   - change the DB settings to match your database

4. Run migration

   ```bash
   go run . artisan migrate:fresh --seed
   ```

5. Run goravel

   ```bash
   go run .
   ```

6. Open new terminal/command promt and get inside mobile-app folder

7. Install dependencies

   ```bash
   npm install
   ```

8. Start the app
   ```bash
   npx expo start --web
   ```