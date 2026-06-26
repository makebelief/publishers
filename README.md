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
| `GMAIL_PASS` | *(required)* | Gmail app password for `barbenchpublishers72@gmail.com`; required for the contact form |

For local testing, create a `.env` file from `.env.example` and put the real Gmail app password there. Use a Gmail app password, not the normal Gmail login password.
