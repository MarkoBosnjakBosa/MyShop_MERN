import { useState, useCallback } from "react";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (configuration, applyData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(configuration.url, {
        method: configuration.method ? configuration.method : "GET",
        headers: configuration.headers ? configuration.headers : "",
        body: configuration.body ? configuration.body : null
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify({ status: response.status, data: data.errors }));
      } else {
        applyData(data);
      }
    } catch (errorObject) {
      const error = JSON.parse(String(errorObject).split("Error: ")[1]);
      const errorStatus = error.status;
      const errorData = error.data;
      if (errorStatus === 400) {
        if (errorData instanceof Array) {
          setError(`Check values: ${errorData.join(", ")}!`);
        } else {
          setError(errorData);
        }
      }
      if ((errorStatus === 401) || (errorStatus === 403)) {
        setError(errorData);
      }
      if (errorStatus === 409) {
        setError(`${errorData} already exist(s)!`);
      }
    }
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    sendRequest
  };
};

export default useHttp;
