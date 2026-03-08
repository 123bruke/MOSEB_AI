import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const db = new Database("edusocial.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    username TEXT UNIQUE,
    email TEXT,
    phone TEXT,
    country TEXT,
    university TEXT,
    universityId TEXT,
    skill TEXT,
    avatar TEXT,
    theme TEXT DEFAULT 'dark',
    fontColor TEXT DEFAULT '#ffffff',
    animation TEXT DEFAULT 'none',
    timezone TEXT DEFAULT 'UTC'
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    type TEXT, -- 'image', 'video', 'short'
    content TEXT,
    description TEXT,
    category TEXT,
    tags TEXT, -- JSON array of tags
    country TEXT,
    university TEXT,
    location TEXT, -- Google Maps location string or coordinates
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    postId INTEGER,
    type TEXT, -- 'like', 'comment', 'share', 'repost', 'report'
    comment TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    content TEXT,
    type TEXT, -- 'video'
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    name TEXT,
    username TEXT,
    email TEXT,
    phone TEXT,
    avatar TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed Database
const seedPosts = [
  { userId: 'system', type: 'image', content: 'https://picsum.photos/seed/python/800/600', description: 'Python Programming Basics #python #coding', category: 'Computer Science', tags: '["python", "coding"]', country: 'USA', university: 'MIT', location: 'Cambridge, MA' },
  { userId: 'system', type: 'image', content: 'https://picsum.photos/seed/algo/800/600', description: 'Visualizing Algorithms #algorithms #cs', category: 'Computer Science', tags: '["algorithms", "cs"]', country: 'UK', university: 'Oxford', location: 'Oxford, UK' },
  { userId: 'system', type: 'video', content: 'https://www.youtube.com/embed/8hly31xKli0', description: 'Data Structures Deep Dive #datastructures', category: 'Computer Science', tags: '["datastructures"]', country: 'India', university: 'IIT Delhi', location: 'New Delhi, India' },
  { userId: 'system', type: 'image', content: 'https://picsum.photos/seed/cpp/800/600', description: 'C++ Memory Management #cpp #programming', category: 'Computer Science', tags: '["cpp", "programming"]', country: 'Germany', university: 'TU Munich', location: 'Munich, Germany' },
  { userId: 'system', type: 'image', content: 'https://picsum.photos/seed/js/800/600', description: 'Modern JavaScript Features #js #webdev', category: 'Computer Science', tags: '["js", "webdev"]', country: 'Canada', university: 'UofT', location: 'Toronto, Canada' },
  { userId: 'system', type: 'image', content: 'https://picsum.photos/seed/anatomy/800/600', description: 'Human Skeletal System #medicine #anatomy', category: 'Medicine', tags: '["medicine", "anatomy"]', country: 'USA', university: 'Harvard', location: 'Boston, MA' },
  { userId: 'system', type: 'video', content: 'https://www.youtube.com/embed/9bZkp7q19f0', description: 'CRISPR Gene Editing #genetics #science', category: 'Medicine', tags: '["genetics", "science"]', country: 'China', university: 'Tsinghua', location: 'Beijing, China' },
  { userId: 'system', type: 'image', content: 'https://picsum.photos/seed/neuro/800/600', description: 'Brain Mapping Techniques #neuroscience', category: 'Medicine', tags: '["neuroscience"]', country: 'Japan', university: 'Tokyo University', location: 'Tokyo, Japan' },
  { userId: 'system', type: 'image', content: 'https://picsum.photos/seed/ethics/800/600', description: 'Medical Ethics in 2024 #ethics', category: 'Medicine', tags: '["ethics"]', country: 'Australia', university: 'Melbourne Uni', location: 'Melbourne, Australia' },
  { userId: 'system', type: 'image', content: 'https://picsum.photos/seed/surgery/800/600', description: 'Basic Surgical Instruments #surgery', category: 'Medicine', tags: '["surgery"]', country: 'Brazil', university: 'USP', location: 'Sao Paulo, Brazil' },
  // Images
  { userId: 'system', type: 'image', content: 'https://picsum.photos/seed/edu1/800/600', description: 'Campus Library View #campus #library', category: 'Education', tags: '["campus", "library"]', country: 'USA', university: 'Stanford', location: 'Stanford, CA' },
  { userId: 'system', type: 'image', content: 'https://picsum.photos/seed/edu2/800/600', description: 'Study Group Session #study #group', category: 'Education', tags: '["study", "group"]', country: 'France', university: 'Sorbonne', location: 'Paris, France' },
  { userId: 'system', type: 'image', content: 'https://picsum.photos/seed/edu3/800/600', description: 'Graduation Day! #graduation #success', category: 'Education', tags: '["graduation", "success"]', country: 'South Africa', university: 'UCT', location: 'Cape Town, SA' },
  // 20 Shorts (Mixed Images, Videos, and Multi-Images)
  ...Array.from({ length: 20 }).map((_, i) => ({
    userId: 'system',
    type: i % 4 === 0 ? 'video' : i % 4 === 1 ? 'multi-image' : 'image',
    content: i % 4 === 0 
      ? `https://www.youtube.com/embed/${['dQw4w9WgXcQ', 'zOjov-2OZ0E', 'rfscVS0vtbw', '8hly31xKli0', 'vLnPwxZdW4Y', 'PkZNo7MFNFg', 'f_f5W91SogM', '9bZkp7q19f0', 'vo4pMVb0z6M', '7Vp_t8r2y7A'][i % 10]}`
      : i % 4 === 1
        ? JSON.stringify([
            `https://picsum.photos/seed/short${i}a/1080/1920`,
            `https://picsum.photos/seed/short${i}b/1080/1920`,
            `https://picsum.photos/seed/short${i}c/1080/1920`
          ])
        : `https://picsum.photos/seed/short${i}/1080/1920`,
    description: `Educational Short #${i + 1}: ${i % 4 === 0 ? 'Video Lesson' : i % 4 === 1 ? 'Visual Gallery' : 'Visual Concept'} #short #edu`,
    category: 'Education',
    tags: '["short", "edu"]',
    country: 'Global',
    university: 'EduSocial Network',
    location: 'Online'
  }))
];

const count = db.prepare("SELECT COUNT(*) as count FROM posts").get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare("INSERT INTO posts (userId, type, content, description, category, tags, country, university, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  seedPosts.forEach(p => insert.run(p.userId, p.type, p.content, p.description, p.category, p.tags, p.country, p.university, p.location));
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  const PORT = 3000;

  // API Routes
  app.post("/api/auth/signup", async (req, res) => {
    const { name, username, email, phone, country, university, universityId, skill, avatar } = req.body;
    
    try {
      const id = Math.random().toString(36).substr(2, 9);
      db.prepare(`
        INSERT INTO users (id, name, username, email, phone, country, university, universityId, skill, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, name, username, email, phone, country, university, universityId, skill, avatar);

      res.json({ id, name, username, avatar });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/user/:id", (req, res) => {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });

  app.post("/api/user/:id/update", (req, res) => {
    const { name, university, universityId, skill, avatar, timezone, fontColor, animation } = req.body;
    db.prepare(`
      UPDATE users 
      SET name = COALESCE(?, name), 
          university = COALESCE(?, university), 
          universityId = COALESCE(?, universityId), 
          skill = COALESCE(?, skill), 
          avatar = COALESCE(?, avatar),
          timezone = COALESCE(?, timezone),
          fontColor = COALESCE(?, fontColor),
          animation = COALESCE(?, animation)
      WHERE id = ?
    `).run(name, university, universityId, skill, avatar, timezone, fontColor, animation, req.params.id);
    res.json({ success: true });
  });

  app.get("/api/posts", (req, res) => {
    const { category, type } = req.query;
    let query = "SELECT * FROM posts";
    const params: any[] = [];
    
    if (category || type) {
      query += " WHERE";
      if (category) {
        query += " category = ?";
        params.push(category);
      }
      if (type) {
        if (category) query += " AND";
        query += " type = ?";
        params.push(type);
      }
    }
    
    query += " ORDER BY createdAt DESC";
    const posts = db.prepare(query).all(...params);
    res.json(posts);
  });

  app.post("/api/interactions", (req, res) => {
    const { userId, postId, type, comment } = req.body;
    db.prepare("INSERT INTO interactions (userId, postId, type, comment) VALUES (?, ?, ?, ?)")
      .run(userId, postId, type, comment);
    res.json({ success: true });
  });

  app.post("/api/stories", (req, res) => {
    const { userId, content } = req.body;
    db.prepare("INSERT INTO stories (userId, content, type) VALUES (?, ?, 'video')")
      .run(userId, content);
    res.json({ success: true });
  });

  app.get("/api/stories", (req, res) => {
    const stories = db.prepare("SELECT * FROM stories ORDER BY createdAt DESC").all();
    res.json(stories);
  });

  app.post("/api/posts", (req, res) => {
    const { userId, type, content, description, category, tags, country, university, location } = req.body;
    db.prepare("INSERT INTO posts (userId, type, content, description, category, tags, country, university, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(userId, type, content, description, category, JSON.stringify(tags), country, university, location);
    res.json({ success: true });
  });

  app.post("/api/search", async (req, res) => {
    const { query, mode } = req.body;
    
    if (mode === 'accounts') {
      const results = db.prepare("SELECT * FROM users WHERE name LIKE ? OR username LIKE ?")
        .all(`%${query}%`, `%${query}%`);
      res.json({ results });
    } else if (mode === 'photos') {
      const results = db.prepare("SELECT * FROM posts WHERE (type = 'image' OR type = 'multi-image') AND (description LIKE ? OR tags LIKE ?)")
        .all(`%${query}%`, `%${query}%`);
      res.json({ results });
    } else {
      res.json({ results: [] });
    }
  });

  app.get("/api/contacts/:userId", (req, res) => {
    const contacts = db.prepare("SELECT * FROM contacts WHERE userId = ? ORDER BY createdAt DESC").all(req.params.userId);
    res.json(contacts);
  });

  app.post("/api/contacts", (req, res) => {
    const { userId, name, username, email, phone } = req.body;
    const avatar = `https://picsum.photos/seed/${username}/200/200`;
    db.prepare("INSERT INTO contacts (userId, name, username, email, phone, avatar) VALUES (?, ?, ?, ?, ?, ?)")
      .run(userId, name, username, email, phone, avatar);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
