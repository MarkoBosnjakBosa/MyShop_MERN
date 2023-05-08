export const checkAuthorization = (request, response) => {
  return response.status(200).send(true).end();
};
