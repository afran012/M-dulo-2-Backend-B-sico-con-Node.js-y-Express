const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const usersFilePath = path.join(__dirname, '../data/users.json');

// Crear directorio data si no existe
if (!fs.existsSync(path.join(__dirname, '../data'))) {
  fs.mkdirSync(path.join(__dirname, '../data'));
}

// Crear archivo users.json si no existe
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify([]));
}

class User {
  constructor(name, email, password, role = 'user') {
    this.id = crypto.randomUUID();
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = new Date();
  }

  static async findOne(query) {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    
    if (query.email) {
      return users.find(user => user.email === query.email) || null;
    }
    
    if (query._id || query.id) {
      const id = query._id || query.id;
      return users.find(user => user.id === id) || null;
    }
    
    return null;
  }

  static async find() {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  static async findById(id) {
    return this.findOne({ id });
  }

  static async findByIdAndUpdate(id, update, options) {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) return null;
    
    const updatedFields = update.$set || update;
    users[userIndex] = { ...users[userIndex], ...updatedFields };
    
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    
    const { password, ...userWithoutPassword } = users[userIndex];
    return options?.new ? userWithoutPassword : null;
  }

  static async findByIdAndDelete(id) {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) return null;
    
    users.splice(userIndex, 1);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    
    return true;
  }

  async save() {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    users.push(this);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    
    return this;
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
}

module.exports = User; 