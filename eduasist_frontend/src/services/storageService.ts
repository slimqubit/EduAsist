// src/services/storageService.ts
const TOKEN_KEY = "authToken";
const USERNAME_KEY = "authUserName";
const SELECTED_SCHOOL_KEY = "selectedSchool";
const CLASS_ID_KEY = "selectedClassId";

export const storageService = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  removeToken: (): void => localStorage.removeItem(TOKEN_KEY),


  getUserName: (): string | null => localStorage.getItem(USERNAME_KEY),
  setUserName: (username: string): void =>
    localStorage.setItem(USERNAME_KEY, username),
  removeUserName: (): void => localStorage.removeItem(USERNAME_KEY),


  getSelectedSchool: () => {
    const storedSchool = localStorage.getItem(SELECTED_SCHOOL_KEY);
    return storedSchool ? JSON.parse(storedSchool) : null;
  },
  setSelectedSchool: (school: { id: number; name: string }) => {
    localStorage.setItem(SELECTED_SCHOOL_KEY, JSON.stringify(school));
  },
  removeSelectedSchool: () => {
    localStorage.removeItem(SELECTED_SCHOOL_KEY);
  },


  getSelectedClass: (): number | null =>
    sessionStorage.getItem(CLASS_ID_KEY)
      ? parseInt(sessionStorage.getItem(CLASS_ID_KEY)!, 10)
      : null,
  setSelectedClass: (classId: number): void =>
    sessionStorage.setItem(CLASS_ID_KEY, String(classId)),
  removeSelectedClass: (): void => sessionStorage.removeItem(CLASS_ID_KEY),
};
