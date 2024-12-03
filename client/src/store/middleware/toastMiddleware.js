import notify from "../../utils/Notify";
const toastMiddleware = (store) => (next) => (action) => {
  if (!action.type.includes("toast")) return next(action);
  let res, rej;
  if (action.type === "toast/loading") [res, rej] = notify();
  if (action.type === "toast/success") res(action.payload);
  if (action.type === "toast/error") rej(action.payload);
};

export default toastMiddleware;
