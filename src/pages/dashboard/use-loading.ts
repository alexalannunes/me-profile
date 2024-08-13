import { useCallback, useMemo, useReducer } from "react";

interface LoadingState {
  name: boolean;
  username: boolean;
  image: boolean;
}

type Action =
  | { type: "SET_LOADING"; payload: keyof LoadingState }
  | { type: "ALL_LOADING" }
  | { type: "RESET" };

function loadingReducer(state: LoadingState, action: Action) {
  if (action.type === "SET_LOADING") {
    return {
      name: false,
      username: false,
      image: false,
      [action.payload]: true,
    };
  }
  if (action.type === "ALL_LOADING") {
    return { name: true, username: true, image: true };
  }

  if (action.type === "RESET") {
    return { name: false, username: false, image: false };
  }
  return state;
}

export function useLoading() {
  const [isLoading, dispatch] = useReducer(loadingReducer, {
    name: false,
    username: false,
    image: false,
  });

  const setLoadingName = useCallback(
    () => dispatch({ type: "SET_LOADING", payload: "name" }),
    [],
  );

  const setLoadingUsername = useCallback(
    () => dispatch({ type: "SET_LOADING", payload: "username" }),
    [],
  );

  const setLoadingImage = useCallback(
    () => dispatch({ type: "SET_LOADING", payload: "image" }),
    [],
  );

  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  const allLoading = useCallback(() => dispatch({ type: "ALL_LOADING" }), []);

  const isNameLoading = isLoading.name;
  const isUsernameLoading = isLoading.username;
  const isImageLoading = isLoading.image;

  const value = useMemo(() => {
    return {
      allLoading,
      reset,
      setLoadingImage,
      setLoadingName,
      setLoadingUsername,
      //
      isImageLoading,
      isNameLoading,
      isUsernameLoading,
    };
  }, [
    isImageLoading,
    isNameLoading,
    isUsernameLoading,
    allLoading,
    setLoadingImage,
    setLoadingName,
    setLoadingUsername,
    reset,
  ]);
  return value;
}
