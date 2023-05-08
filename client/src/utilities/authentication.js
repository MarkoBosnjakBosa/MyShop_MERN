export const login = (token, userId, username) => {
  const authentication = { authentication: { token, userId, username } };
  localStorage.setItem("authentication", JSON.stringify(authentication));
};

export const logout = () => {
  localStorage.removeItem("authentication");
};

export const getUserData = () => {
  try {
    const foundData = localStorage.getItem("authentication");
    const data = JSON.parse(foundData);
    return data.authentication;
  } catch (error) {
    return { token: null, userId: null, username: null };
  }
};
