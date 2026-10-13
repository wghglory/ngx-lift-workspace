import {User} from '../models/user.model';

/** Deterministic local data keeps the default demos usable without third-party APIs. */
export function demoUsers(): User[] {
  return Array.from({length: 100}, (_, index) => ({
    gender: index % 2 ? 'female' : 'male',
    name: {title: '', first: ['Alex', 'Jamie', 'Sam', 'Taylor'][index % 4], last: `Developer ${index + 1}`},
    email: `user${index + 1}@example.com`,
    phone: '555-0100',
    cell: '555-0100',
    id: {name: 'demo', value: `demo-${index + 1}`},
    picture: {large: '/favicon.svg', medium: '/favicon.svg', thumbnail: '/favicon.svg'},
  }));
}
