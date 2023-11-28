import axios from "axios";

class MainService {
  postPyament(data) {
    return axios.post("/payments/postpayment/", data);
  }
}

const mainservice = new MainService();

export default mainservice;
