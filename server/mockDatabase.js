// Mock in-memory database for development when MongoDB is not available
const bcrypt = require('bcryptjs');

// In-memory data store
const dataStore = {
  users: [],
  pakets: [],
  anggotas: [],
  pembayarans: [],
  tabunganBebas: [],
  data: []
};

// Mock User model
class MockUser {
  constructor(data) {
    this._id = this.generateId();
    this.username = data.username;
    this.password = data.password;
    this.nama = data.nama;
    this.role = data.role || 'operator';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  async save() {
    // Hash password if modified
    if (this.password && !this.password.startsWith('$2a$')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    
    // Check if user already exists
    const existingIndex = dataStore.users.findIndex(u => u.username === this.username);
    if (existingIndex !== -1) {
      throw new Error('User already exists with this username');
    }
    
    dataStore.users.push(this);
    return this;
  }

  async comparePassword(plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  }

  static findOne(query) {
    return new Promise((resolve) => {
      const user = dataStore.users.find(u => {
        if (query.username && u.username !== query.username) return false;
        if (query._id && u._id !== query._id) return false;
        return true;
      });
      resolve(user || null);
    });
  }

  static findById(id) {
    return new Promise((resolve) => {
      const user = dataStore.users.find(u => u._id === id);
      resolve(user || null);
    });
  }

  static create(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = new MockUser(data);
        await user.save();
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }
}

// Mock database connection
const connectDB = async () => {
  console.log('Using mock in-memory database (MongoDB not available)');
  console.log('Note: Data will be lost when server restarts');
  
  // Create a default admin user
  try {
    await MockUser.create({
      username: 'admin',
      password: 'admin123',
      nama: 'Administrator',
      role: 'admin'
    });
    console.log('Default admin user created: admin/admin123');
  } catch (error) {
    console.log('Default admin user already exists or error creating:', error.message);
  }
};

// Mock mongoose connection object
const mockMongoose = {
  connect: connectDB,
  connection: {
    readyState: 1, // Connected
    on: () => {}
  }
};

module.exports = {
  mockMongoose,
  MockUser,
  dataStore
};