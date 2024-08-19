import { useCallback, useMemo, useReducer } from "react";

interface LoadingState {
  name: boolean;
  username: boolean;
  image: boolean;
  background: boolean;
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
      background: false,
      [action.payload]: true,
    };
  }
  if (action.type === "ALL_LOADING") {
    return { name: true, username: true, image: true, background: true };
  }

  if (action.type === "RESET") {
    return { name: false, username: false, image: false, background: false };
  }
  return state;
}

export function useLoading() {
  const [isLoading, dispatch] = useReducer(loadingReducer, {
    name: false,
    username: false,
    image: false,
    background: false,
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

  const setBackgroundImage = useCallback(
    () => dispatch({ type: "SET_LOADING", payload: "background" }),
    [],
  );

  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  const allLoading = useCallback(() => dispatch({ type: "ALL_LOADING" }), []);

  const isNameLoading = isLoading.name;
  const isUsernameLoading = isLoading.username;
  const isImageLoading = isLoading.image;
  const isBackgroundLoading = isLoading.background;

  const value = useMemo(() => {
    return {
      allLoading,
      reset,
      setLoadingImage,
      setLoadingName,
      setLoadingUsername,
      setBackgroundImage,
      //
      isImageLoading,
      isNameLoading,
      isUsernameLoading,
      isBackgroundLoading,
    };
  }, [
    isImageLoading,
    isNameLoading,
    isUsernameLoading,
    isBackgroundLoading,
    allLoading,
    setLoadingImage,
    setLoadingName,
    setLoadingUsername,
    setBackgroundImage,
    reset,
  ]);
  return value;
}
