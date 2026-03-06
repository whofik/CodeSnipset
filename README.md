# Fik Snipset

Website untuk share snippet code dengan backend Express.js dan data snippet diambil dari GitHub Gist API.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install --no-bin-links
```

### 2. Configure Environment
Edit `.env` file:
```
PORT=8080
GITHUB_TOKEN=your_github_token_here
SECRET_KEY=your_secret_key_here
```

### 3. Start Server
```bash
npm start
```

Server akan berjalan di `http://localhost:8080`

## 📁 Struktur Project

```
fik-snipset/
├── app.js                 # Main entry point
├── package.json
├── vercel.json            # Vercel deployment config
├── .env
├── routes/
│   ├── index.js           # Home route
│   ├── files.js           # Snippet view route
│   ├── api.js             # Admin API routes
│   └── admin.js           # Admin dashboard route
├── services/
│   └── gistService.js     # GitHub Gist API service
├── middleware/
│   ├── authKey.js         # Secret key authentication
│   └── rateLimit.js       # Rate limiting
├── views/
│   ├── layout/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs          # Home page
│   ├── file.ejs           # Snippet view
│   ├── admin.ejs          # Admin dashboard
│   └── 404.ejs            # 404 page
├── public/
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   └── js/
│       └── main.js        # Frontend JavaScript
└── utils/
    └── parser.js          # Code parser/sanitizer
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server

## 🌐 Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Home page - list all snippets |
| `/files/:filename` | GET | View snippet |
| `/admin` | GET | Admin dashboard |
| `/api/add` | POST | Add new snippet |
| `/api/edit` | POST | Edit snippet |
| `/api/delete` | POST | Delete snippet |
| `/api/snippet/:filename` | GET | Get snippet data for editing |

## 🔐 Authentication

Admin routes menggunakan Secret Key authentication.

Header: `secret_key: YOUR_SECRET_KEY`

## 🎨 UI Features

- Modern clean design
- No focus rings (clean UI)
- Smooth animations
- Responsive design
- Copy code button
- Loading spinner
- Toast notifications

## 📝 API Examples

### Add Snippet
```bash
curl -X POST http://localhost:8080/api/add \
  -H "Content-Type: application/json" \
  -H "secret_key: YOUR_SECRET_KEY" \
  -d '{
    "filename": "hello.js",
    "description": "Hello World",
    "code": "console.log(\"Hello\")"
  }'
```

### Edit Snippet
```bash
curl -X POST http://localhost:8080/api/edit \
  -H "Content-Type: application/json" \
  -H "secret_key: YOUR_SECRET_KEY" \
  -d '{
    "gistId": "gist_id_here",
    "filename": "hello.js",
    "description": "Updated",
    "code": "console.log(\"Updated\")"
  }'
```

### Delete Snippet
```bash
curl -X POST http://localhost:8080/api/delete \
  -H "Content-Type: application/json" \
  -H "secret_key: YOUR_SECRET_KEY" \
  -d '{"gistId": "gist_id_here"}'
```

## 🛡️ Security Features

- Rate limiting (100 req / 15 min)
- Secret key authentication
- Input sanitization
- Helmet.js for HTTP headers
- XSS protection

## 📦 Dependencies

- express - Web framework
- ejs - Template engine
- axios - HTTP client
- dotenv - Environment variables
- express-rate-limit - Rate limiting
- helmet - Security headers

## 🚀 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Add environment variables in Vercel dashboard:
- `GITHUB_TOKEN` - Your GitHub personal access token
- `SECRET_KEY` - Your secret key for admin authentication
- `PORT` - Set to 8080

5. For production deploy:
```bash
vercel --prod
```

### Other Hosting Options

Support untuk hosting gratis:
- Render
- Railway
- Cyclic

## 📄 License

ISC
