import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

if (!MONGODB_URI) {
  throw new Error("Missing required env var: MONGODB_URI");
}

if (!JWT_SECRET) {
  throw new Error("Missing required env var: JWT_SECRET");
}

// Mongoose Models
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'organizer', 'admin'], default: 'user' },
  bio: { type: String, default: "" },
  interests: [{ type: String }],
  photoURL: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  organizerName: { type: String, required: true },
  capacity: { type: Number, required: true },
  attendeeCount: { type: Number, default: 0 },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  image: { type: String, default: "" },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const allowedOrigins = FRONTEND_URL.split(',').map((origin) => origin.trim()).filter(Boolean);

  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).json({ ok: true, service: 'backend' });
  });

  app.get('/api/health', (_req, res) => {
    res.status(200).json({ ok: true, service: 'backend' });
  });

  // MongoDB Connection
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB");
      seedData();
    })
    .catch(err => console.error("MongoDB Connection Error:", err));

  // Auth Middleware
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword, role });
      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "User not found" });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(400).json({ message: "Invalid password" });

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, photoURL: user.photoURL, bio: user.bio, interests: user.interests } });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/auth/stats", authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const eventsJoined = await Event.countDocuments({ attendees: userId });
      const eventsCreated = await Event.countDocuments({ organizerId: userId });
      const user = await User.findById(userId);
      
      res.json({
        eventsJoined,
        eventsCreated,
        interestsCount: user.interests?.length || 0,
        points: (eventsJoined * 50) + (eventsCreated * 100) // Simple points logic
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.put("/api/auth/profile", authenticateToken, async (req, res) => {
    try {
      const { name, bio, photoURL, interests } = req.body;
      const user = await User.findByIdAndUpdate(req.user.id, { name, bio, photoURL, interests }, { new: true }).select('-password');
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Event Routes
  app.get("/api/events", async (req, res) => {
    try {
      const { category, organizerId, limit } = req.query;
      let query = {};
      if (category) query.category = new RegExp(category, 'i');
      if (organizerId) query.organizerId = organizerId;

      const events = await Event.find(query).sort({ date: 1 }).limit(parseInt(limit) || 0);
      res.json(events);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: "Event not found" });
      res.json(event);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/events", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Only organizers can create events" });
      }
      const user = await User.findById(req.user.id);
      const newEvent = new Event({ ...req.body, organizerId: req.user.id, organizerName: user.name });
      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.put("/api/events/:id", authenticateToken, async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: "Event not found" });
      if (event.organizerId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedEvent);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete("/api/events/:id", authenticateToken, async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: "Event not found" });
      if (event.organizerId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }
      await Event.findByIdAndDelete(req.params.id);
      res.json({ message: "Event deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/events/:id/rsvp", authenticateToken, async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: "Event not found" });
      
      const isAlreadyRSVPed = event.attendees.includes(req.user.id);
      if (isAlreadyRSVPed) {
        event.attendees = event.attendees.filter(id => id.toString() !== req.user.id);
        event.attendeeCount -= 1;
      } else {
        if (event.attendeeCount >= event.capacity) return res.status(400).json({ message: "Event is full" });
        event.attendees.push(req.user.id);
        event.attendeeCount += 1;
      }
      await event.save();
      res.json(event);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

async function seedData() {
  const eventCount = await Event.countDocuments();
  if (eventCount < 10) {
    console.log("Checking for missing dummy events...");
    
    // Create a system user if not exists
    let systemUser = await User.findOne({ email: 'system@gatherly.com' });
    if (!systemUser) {
      const hashedPassword = await bcrypt.hash('system123', 10);
      systemUser = new User({
        name: 'Gatherly Team',
        email: 'system@gatherly.com',
        password: hashedPassword,
        role: 'admin'
      });
      await systemUser.save();
    }

    const dummyEvents = [
      {
        title: "Global Tech Summit 2026",
        description: "Explore the latest in AI, Web3, and future tech with world-class speakers and hands-on workshops.",
        date: "2026-06-15",
        time: "10:00",
        location: "Silicon Valley Convention Center",
        category: "Technology",
        organizerId: systemUser._id,
        organizerName: systemUser.name,
        capacity: 500,
        image: "https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?auto=format&fit=crop&q=80&w=1200"
      },
      {
        title: "Underground Jazz Night",
        description: "An intimate evening of soulful jazz performances from local legends and rising stars.",
        date: "2026-04-20",
        time: "20:00",
        location: "The Blue Note Lounge, New Orleans",
        category: "Music",
        organizerId: systemUser._id,
        organizerName: systemUser.name,
        capacity: 80,
        image: "https://images.unsplash.com/photo-1514525253361-bee8718a7439?auto=format&fit=crop&q=80&w=1200"
      },
      {
        title: "Sustainable Living Workshop",
        description: "Learn practical tips for a zero-waste lifestyle, urban gardening, and eco-friendly habits.",
        date: "2026-05-10",
        time: "14:00",
        location: "Green Community Center, Portland",
        category: "Lifestyle",
        organizerId: systemUser._id,
        organizerName: systemUser.name,
        capacity: 40,
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200"
      },
      {
        title: "Startup Founders Brunch",
        description: "Network with fellow entrepreneurs, share challenges, and find potential collaborators over brunch.",
        date: "2026-04-12",
        time: "11:00",
        location: "The Hub Cafe, Austin",
        category: "Business",
        organizerId: systemUser._id,
        organizerName: systemUser.name,
        capacity: 30,
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1200"
      },
      {
        title: "Digital Art Exhibition",
        description: "A showcase of cutting-edge digital art, VR installations, and NFT collections from global artists.",
        date: "2026-08-05",
        time: "18:00",
        location: "Modern Art Gallery, London",
        category: "Art",
        organizerId: systemUser._id,
        organizerName: systemUser.name,
        capacity: 150,
        image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=1200"
      },
      {
        title: "Street Food Carnival",
        description: "Taste the world in one place! Over 50 vendors serving authentic international street food.",
        date: "2026-05-22",
        time: "12:00",
        location: "Waterfront Park, San Francisco",
        category: "Food",
        organizerId: systemUser._id,
        organizerName: systemUser.name,
        capacity: 1000,
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1200"
      },
      {
        title: "Morning Yoga in the Park",
        description: "Start your weekend with a rejuvenating outdoor yoga session for all skill levels.",
        date: "2026-04-18",
        time: "08:00",
        location: "Central Park, New York",
        category: "Wellness",
        organizerId: systemUser._id,
        organizerName: systemUser.name,
        capacity: 100,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200"
      },
      {
        title: "Charity 5K Run",
        description: "Run for a cause! All proceeds go to local children's hospitals. Medals for all finishers.",
        date: "2026-06-07",
        time: "07:30",
        location: "Riverside Trail, Chicago",
        category: "Sports",
        organizerId: systemUser._id,
        organizerName: systemUser.name,
        capacity: 300,
        image: "https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?auto=format&fit=crop&q=80&w=1200"
      },
      {
        title: "Photography Masterclass",
        description: "Learn professional lighting and composition techniques from award-winning photographers.",
        date: "2026-05-30",
        time: "10:00",
        location: "Studio 42, Berlin",
        category: "Art",
        organizerId: systemUser._id,
        organizerName: systemUser.name,
        capacity: 20,
        image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=1200"
      },
      {
        title: "Indie Rock Night",
        description: "A high-energy night featuring the best up-and-coming indie rock bands in the city.",
        date: "2026-04-25",
        time: "21:00",
        location: "The Garage, Seattle",
        category: "Music",
        organizerId: systemUser._id,
        organizerName: systemUser.name,
        capacity: 200,
        image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1200"
      },
      {
        title: "Wine & Cheese Tasting",
        description: "An elegant evening exploring premium vintages paired with artisanal cheeses from around Europe.",
        date: "2026-05-15",
        time: "19:00",
        location: "The Vineyard Cellar, Paris",
        category: "Food",
        organizerId: systemUser._id,
        organizerName: systemUser.name,
        capacity: 50,
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=1200"
      },
      {
        title: "Coding for Kids",
        description: "A fun, interactive workshop introducing children to the basics of programming through games.",
        date: "2026-07-12",
        time: "10:00",
        location: "Public Library, Toronto",
        category: "Technology",
        organizerId: systemUser._id,
        organizerName: systemUser.name,
        capacity: 30,
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200"
      }
    ];

    for (const event of dummyEvents) {
      const exists = await Event.findOne({ title: event.title });
      if (!exists) {
        await new Event({ ...event, organizerId: systemUser._id, organizerName: systemUser.name }).save();
      }
    }
    console.log("Seeding check complete!");
  }
}

startServer();
