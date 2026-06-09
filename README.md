# Bar & Bench Publishers Ltd.

## Run locally
```bash
npm start
```
Opens at http://localhost:3000

## Deploy

### Render / Railway / Fly.io
- Build command: *(none)*
- Start command: `node server.js`
- Environment variable: `PORT` (set automatically by platform)

### VPS (Nginx reverse proxy)
Point Nginx to `localhost:3000` and handle SSL termination there.

## Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT`   | `3000`  | Port to listen on |
