import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSONFilePreset } from 'lowdb/node';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// storage directories
const storageDir = path.join(__dirname, '../storage');
const uploadsDir = path.join(storageDir, 'uploads');

// create storage directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Default data for the database (db.json)
const defaultData = {
    products: [],
    returns: [],
    users: [
        {
            id: 1,
            name: 'Elijah',
            role: 'admin',
            email: 'admin@example.com',
            birthdate: '',
            password: 'admin',
            idNumber: '0000'
        }
    ]
};

// Initialize Lowdb database
const db = await JSONFilePreset(path.join(storageDir, 'db.json'), defaultData);

// middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// file upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Products
app.get('/api/products', (req, res) => {
    res.json(db.data.products);
});

app.post('/api/products', async (req, res) => {
    const newProduct = { id: Date.now(), ...req.body };
    db.data.products.push(newProduct);
    await db.write();
    res.status(201).json(newProduct);
});

app.put('/api/products/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const index = db.data.products.findIndex(p => p.id === id);
    if (index !== -1) {
        db.data.products[index] = { ...db.data.products[index], ...req.body };
        await db.write();
        res.json(db.data.products[index]);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    db.data.products = db.data.products.filter(p => p.id !== id);
    await db.write();
    res.status(204).end();
});

// Returns
app.get('/api/returns', (req, res) => {
    res.json(db.data.returns);
});

app.post('/api/returns', async (req, res) => {
    const newReturn = { id: Date.now(), isArchived: false, ...req.body };
    db.data.returns.push(newReturn);
    await db.write();
    res.status(201).json(newReturn);
});

app.put('/api/returns/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const index = db.data.returns.findIndex(r => r.id === id);
    if (index !== -1) {
        db.data.returns[index] = { ...db.data.returns[index], ...req.body };
        await db.write();
        res.json(db.data.returns[index]);
    } else {
        res.status(404).json({ message: 'Return not found' });
    }
});

app.delete('/api/returns/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    db.data.returns = db.data.returns.filter(r => r.id !== id);
    await db.write();
    res.status(204).end();
});

// Authentication
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.data.users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json(user);
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.post('/api/register', async (req, res) => {
    const newUser = { id: Date.now(), role: 'user', ...req.body };
    db.data.users.push(newUser);
    await db.write();
    res.status(201).json(newUser);
});

// User Profile Management
app.get('/api/users', (req, res) => {
    res.json(db.data.users);
});

app.put('/api/users/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const index = db.data.users.findIndex(u => u.id === id);
    if (index !== -1) {
        db.data.users[index] = { ...db.data.users[index], ...req.body };
        await db.write();
        res.json(db.data.users[index]);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// File Upload
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});