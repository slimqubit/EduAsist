// src/services/tokenService.ts
const TOKEN_KEY = 'authToken';
const USERNAME_KEY = 'authUserName';

export const tokenService = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  getUserName: (): string | null => localStorage.getItem(USERNAME_KEY),

  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  setUserName: (username: string): void => localStorage.setItem(USERNAME_KEY, username),

  removeToken: (): void => localStorage.removeItem(TOKEN_KEY),
  removeUserName: (): void => localStorage.removeItem(USERNAME_KEY),
};
