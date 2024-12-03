import request from "../../network/request";

const apiMiddleware = (store) => (next) => async (action) => {
  if (action.type !== "api/Requested") {
    return next(action);
  }
  const { url, method, body, params, showToast = false } = action.payload;
  //action to perform
  const { onSuccess, onError, onLoading } = action.payload;
  const requestConfig = { url, method };
  if (body) requestConfig.data = body;
  if (params) requestConfig.params = params;

  if (onLoading) store.dispatch({ type: onLoading, payload: true });
  if (showToast) store.dispatch({ type: "toast/loading" });

  //making request
  const { success, data } = await request(requestConfig);

  if (success === true) {
    const message = data.message;
    if (showToast) store.dispatch({ type: "toast/success", payload: message });
    if (onSuccess) store.dispatch({ type: onSuccess, payload: data.data });
  }

  if (success !== true) {
    const message = data.message || "Something went wrong";
    if (onError) store.dispatch({ type: onError, payload: message });
    if (showToast) store.dispatch({ type: "toast/error", payload: message });
  }
};

export default apiMiddleware;
