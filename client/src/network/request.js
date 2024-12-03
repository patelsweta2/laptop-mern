import axios from "axios";
import cookies from "js-cookie";

const request = async (configObj) => {
  const token = cookies.get("token");
  if (token) {
    configObj.headers["Authorization"] = `Bearer ${token}`;
  }
  try {
    const { data } = await axios.request(configObj);
    return { success: true, data };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log({ error });
    }
    return { success: false, data: error.response.data };
  }
};

export default request;
