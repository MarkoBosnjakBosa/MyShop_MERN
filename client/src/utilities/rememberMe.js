export const remember = (username) => {
  const rememberMe = { rememberMe: { username } };
  localStorage.setItem("rememberMe", JSON.stringify(rememberMe));
};

export const forget = () => {
  localStorage.removeItem("rememberMe");
};

export const getRememberMe = () => {
  try {
    const foundData = localStorage.getItem("rememberMe");
    const data = JSON.parse(foundData);
    return data.rememberMe;
  } catch (error) {
    return { username: null };
  }
};
