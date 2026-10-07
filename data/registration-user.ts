import { randomUUID } from 'node:crypto';
import { RegistrationUser } from '../models/RegistrationUser';

export function createRegistrationUser(): RegistrationUser {
  return {
    firstName: 'Alex',
    lastName: 'Taylor',
    country: 'United Kingdom',
    email: `registration.${randomUUID()}@example.com`,
    password: `R8!${randomUUID().replace(/-/g, '')}aZ`,
  };
}
