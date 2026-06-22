# Chatie 

**Chatie** is a full-stack real-time messaging application inspired by WhatsApp and Telegram, built as an Engineering thesis project. It supports private and group chats, media sharing, and live messaging — all without page reloads.

>  Built as a Bachelor's Engineering thesis at Akademia Finansów i Biznesu Vistula (2025)

---

##  Features

- 🔐 **Authentication** — JWT-based register/login with protected routes
- 💬 **Real-time messaging** — instant delivery via WebSockets (STOMP over SockJS)
- 👤 **Private chats** — one-on-one conversations with any contact
- 👥 **Group chats** — create and manage group conversations
- 📎 **Media sharing** — send images and files via Cloudinary cloud storage
- 🔍 **User search** — find and add contacts by username
- 📱 **Responsive UI** — works across desktop and mobile screen sizes
- 🔒 **Route protection** — unauthenticated users are redirected automatically

---

##  Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + TypeScript | UI framework |
| Vite | Build tool |
| Zustand | Global state management |
| React Router | Client-side navigation (SPA) |
| Tailwind CSS | Styling |
| Axios | HTTP client |
| SockJS + STOMP | WebSocket client |

### Backend
| Technology | Purpose |
|---|---|
| Java 17 + Spring Boot | REST API + WebSocket server |
| Spring Security + JWT | Authentication & authorization |
| Spring Data JPA | Database ORM |
| MySQL | Relational database |
| Cloudinary | Media file storage |
| Maven | Build & dependency management |

---

##  Architecture

```
chatie/
├── client/                  # React frontend (Vite + TypeScript)
│   └── src/
│       ├── components/      # UI components (Chat, Sidebar, Viewer, etc.)
│       ├── pages/           # Route-level pages
│       ├── store/           # Zustand global state
│       ├── realtime/        # WebSocket connection logic
│       ├── types/           # TypeScript interfaces
│       └── utils/           # Helper functions
│
└── Chatie/                  # Spring Boot backend
    └── src/main/java/com/example/chatie/
        ├── config/          # Security, CORS, WebSocket config
        ├── controller/      # REST endpoints
        ├── service/         # Business logic
        ├── repository/      # JPA data access
        ├── entity/          # Database models
        ├── dto/             # Request/response objects
        ├── security/        # JWT filters & auth
        ├── mapper/          # Entity ↔ DTO mapping
        └── ws/              # WebSocket event publisher
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Java 17+
- MySQL 8+
- A free [Cloudinary](https://cloudinary.com) account

### 1. Clone the repository

```bash
git clone https://github.com/lutsiu/chatie.git
cd chatie
```

### 2. Backend setup

```bash
cd Chatie
```

Create `src/main/resources/application.properties` (or `.env` equivalent):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/chatie
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.jpa.hibernate.ddl-auto=update

jwt.secret=YOUR_JWT_SECRET_KEY

cloudinary.cloud-name=YOUR_CLOUD_NAME
cloudinary.api-key=YOUR_API_KEY
cloudinary.api-secret=YOUR_API_SECRET
```

Run the SQL schema (optional if using `ddl-auto=update`):
```bash
# The schema is in Chatie/src/main/java/com/example/chatie/Chatie/code.sql
```

Start the server:
```bash
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`.

### 3. Frontend setup

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:8080
VITE_WS_URL=http://localhost:8080/ws
```

Start the dev server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/users/search?query=` | Search users by name |
| GET | `/api/chats` | Get all chats for current user |
| POST | `/api/chats` | Create a new chat |
| POST | `/api/messages` | Send a message |
| WS | `/ws` | WebSocket endpoint (STOMP) |

---

##  Real-time Flow

```
Client A sends message
    → REST POST /api/messages (persisted to MySQL)
    → Spring publishes WebSocket event via WsEventPublisher
    → All connected clients in the chat receive the event via STOMP subscription
    → Client B's UI updates instantly without page reload
```

---

## 📸 Screenshots

> 
<img width="1612" height="690" alt="obraz" src="https://github.com/user-attachments/assets/8fb3e3b4-f836-415e-a41d-a4b31dd70402" />
<img width="317" height="695" alt="obraz" src="https://github.com/user-attachments/assets/74b0ff81-fcc7-43b8-985e-b17f53f50d25" />
<img width="1335" height="701" alt="obraz" src="https://github.com/user-attachments/assets/df700c49-091a-44e6-9f86-45d87401e339" />

---

## 🎓 Academic Context

This project was developed as a Bachelor's Engineering thesis at **Akademia Finansów i Biznesu Vistula**, Warsaw (2025), under the supervision of dr hab. Paweł Gburzyński.

**Thesis title:** *Chatie – aplikacja messenger wykorzystująca technologie Java Spring Boot, React oraz MySQL*

The thesis covered: technology selection rationale (React vs Angular/Vue, Spring Boot vs Node.js/Django, MySQL vs PostgreSQL/MongoDB), system architecture design, security implementation, and real-time communication patterns.

---

## 🔮 Potential Improvements

- [ ] Docker + Docker Compose setup for one-command local run
- [ ] CI/CD pipeline (GitHub Actions → Railway/Render)
- [ ] Message read receipts
- [ ] Push notifications
- [ ] Message search
- [ ] Voice/video calls

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
