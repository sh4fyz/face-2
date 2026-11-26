// Banco em memória com persistência simples em data.json.
// Trocar por um banco real (PostgreSQL, MongoDB...) quando o app crescer.
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';

const FILE = path.resolve('data.json');

function seed() {
  const password = bcrypt.hashSync('123456', 8);
  const ana = { id: randomUUID(), name: 'Ana Ciclista', email: 'ana@pedal.com', password, bio: 'Speed nos fins de semana 🚴‍♀️', city: 'São Paulo', avatar: '', friends: [], createdAt: new Date().toISOString() };
  const beto = { id: randomUUID(), name: 'Beto MTB', email: 'beto@pedal.com', password, bio: 'Trilha, lama e café.', city: 'Curitiba', avatar: '', friends: [], createdAt: new Date().toISOString() };
  ana.friends.push(beto.id);
  beto.friends.push(ana.id);
  return {
    users: [ana, beto],
    posts: [
      { id: randomUUID(), authorId: beto.id, text: 'Pedal de 60 km na Serra hoje! Quem topa semana que vem?', image: '', likes: [ana.id], comments: [{ id: randomUUID(), authorId: ana.id, text: 'Eu topo!', createdAt: new Date().toISOString() }], createdAt: new Date().toISOString() },
      { id: randomUUID(), authorId: ana.id, text: 'Troquei a corrente e o cassete. Dica: limpem a transmissão a cada 200 km 😉', image: '', likes: [], comments: [], createdAt: new Date().toISOString() },
    ],
    groups: [
      { id: randomUUID(), name: 'Mountain Bike Brasil', description: 'Trilhas, dicas e encontros de MTB.', members: [beto.id], createdAt: new Date().toISOString() },
      { id: randomUUID(), name: 'Speed SP', description: 'Treinos de estrada em São Paulo.', members: [ana.id], createdAt: new Date().toISOString() },
    ],
    rides: [
      { id: randomUUID(), title: 'Pedal noturno na Paulista', description: 'Ritmo leve, ~25 km.', date: new Date(Date.now() + 3 * 864e5).toISOString(), location: 'Av. Paulista, São Paulo', distanceKm: 25, level: 'iniciante', organizerId: ana.id, participants: [ana.id], createdAt: new Date().toISOString() },
    ],
    bikes: [
      { id: randomUUID(), ownerId: beto.id, name: 'Minha full', brand: 'Trek', model: 'Fuel EX', type: 'mtb', year: 2022, createdAt: new Date().toISOString() },
    ],
  };
}

function load() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    const data = seed();
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
    return data;
  }
}

export const db = load();
export const save = () => fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
export const newId = () => randomUUID();

export const publicUser = (u) => {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
};
export const findUser = (id) => db.users.find((u) => u.id === id);
