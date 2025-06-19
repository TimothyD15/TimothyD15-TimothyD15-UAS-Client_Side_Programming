export const setUserSession = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUserSession = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const clearUserSession = () => {
  localStorage.removeItem("user");
};
