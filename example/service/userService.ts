import { User } from '../@types';

/** Just an empty array in place of a database for testing purposes */
const users: User[] = [];

export const getUsers = (): User[] => {
  return users;
};

export const addUser = (user: User): boolean => {
  if (exists(user)) return false;
  users.push({
    id: crypto.randomUUID(),
    ...user
  });
  return true;
};

const exists = (target: User) =>
  users.some((user) => user.firstname === target.firstname && user.surname === target.surname);
