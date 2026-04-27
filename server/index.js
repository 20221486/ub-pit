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
    users: {
        name: 'Elijah',
        role: 'admin',
        email: '20221486@s.ubaguio.edu',
        birthdate: '',
        password: '',
        idNumber: ''
    }
};

// Initialize Lowdb database
const db = await JSONFilePreset(path.join(storageDir, 'db.json'), defaultData);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));