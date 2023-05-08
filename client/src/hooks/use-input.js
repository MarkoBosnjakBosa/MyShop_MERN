import { useReducer } from "react";

const defaultInputState = { value: "", isTouched: false };

const inputStateReducer = (state, action) => {
  if (action.type === "INPUT") {
    return { value: action.value, isTouched: state.isTouched };
  }
  if (action.type === "INITIALIZE") {
    return { value: action.value, isTouched: true };
  }
  if (action.type === "BLUR") {
    return { value: state.value, isTouched: true };
  }
  if (action.type === "RESET") {
    return { value: "", isTouched: false };
  }
  return defaultInputState;
};

const useInput = (validate) => {
  const [inputState, dispatch] = useReducer(inputStateReducer, defaultInputState);

  const isValid = validate(inputState.value);
  const error = !isValid && inputState.isTouched;

  const changeValue = (event) => {
    dispatch({ type: "INPUT", value: event.target.value });
  };

  const initializeValue = (value) => {
    dispatch({ type: "INITIALIZE", value });
  };

  const blur = () => {
    dispatch({ type: "BLUR" });
  };

  const resetValue = () => {
    dispatch({ type: "RESET" });
  };

  return {
    value: inputState.value,
    isValid,
    error,
    changeValue,
    initializeValue,
    blur,
    resetValue
  };
};

export default useInput;
