import { toast } from "react-toastify";
const notify = () => {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  toast.promise(promise, {
    pending: "Please wait...",
    success: {
      render({ data }) {
        return data;
      },
    },
    error: {
      render({ data }) {
        return data;
      },
    },
  });
  return [resolve, reject];
};

export default notify;
