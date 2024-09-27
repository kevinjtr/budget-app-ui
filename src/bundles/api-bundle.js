import xhr from "xhr";
import axios from 'axios';

export default {
  name: "api",

  getReducer: () => {
    const root =process.env.REACT_APP_API_ROOT
    const initialState = {
      root: root
    };

    return (state = initialState, { type, payload }) => {
      return state;
    };
  },

  getExtraArgs: store => {
    return {
      apiGet: (path, callback) => {
        const token = store.selectTokenRaw();
        if (!token) return null;
        const root = store.selectApiRoot();
        const options = {
          url: path.indexOf("http") !== -1 ? `${path}` : `${root}${path}`,
          withCredentials: path.indexOf("getuser") !== -1
        };
        if (token) {
          options.headers = {
            Authorization: "Bearer " + token
          };
        }
        return xhr.get(options, callback);
      },
      apiPut: (path, payload, callback) => {
        const token = store.selectTokenRaw();
        if (!token) return null;
        const root = store.selectApiRoot();
        const options = {
          url: path.indexOf("http") !== -1 ? `${path}` : `${root}${path}`,
          json: payload,
          withCredentials: path.indexOf("getuser") !== -1
        };
        if (token) {
          options.headers = {
            Authorization: "Bearer " + token
          };
        }
        return xhr.put(options, callback);
      },
      apiPost: (path, payload, callback) => {
        const token = store.selectTokenRaw();
        if (!token) return null;
        const root = store.selectApiRoot();
        const options = {
          url: path.indexOf("http") !== -1 ? `${path}` : `${root}${path}`,
          json: payload,
          withCredentials: path.indexOf("getuser") !== -1
        };
        if (token) {
          options.headers = {
            Authorization: "Bearer " + token
          };
        }
        return xhr.post(options, callback);
      },
      apiFilePost: (path, payload, callback) => {
        const token = store.selectTokenRaw();
        if (!token) return null;
        const root = store.selectApiRoot();
        const options = {
          url: path.indexOf("http") !== -1 ? `${path}` : `${root}${path}`,
          file: payload,
          withCredentials: path.indexOf("getuser") !== -1
        };
        if (token) {
          options.headers = {
            Authorization: "Bearer " + token
          };
        }
        return xhr.post(options, callback);
      },
      apiAxiosPost: (path, payload, callback) => {
        const token = store.selectTokenRaw();
        if (!token) return null;
        const root = store.selectApiRoot();
        const url = path.indexOf("http") !== -1 ? `${path}` : `${root}${path}`
        const options = {
         // url: path.indexOf("http") !== -1 ? `${path}` : `${root}${path}`,
          //file: payload,
          withCredentials: path.indexOf("getuser") !== -1
        };
        if (token) {
          options.headers = {
            Authorization: "Bearer " + token,
          };
        }
        console.log(payload)
        return axios.post(url, payload, options).then(res => {console.log(res)}).catch(err => console.log(err));
      },
      apiDelete: (path, payload, callback) => {
        const token = store.selectTokenRaw();
        if (!token) return null;
        const root = store.selectApiRoot();
        const options = {
          url: path.indexOf("http") !== -1 ? `${path}` : `${root}${path}`,
          withCredentials: path.indexOf("getuser") !== -1
        };
        if (payload) options.json = payload;
        if (token) {
          options.headers = {
            Authorization: "Bearer " + token
          };
        }
        return xhr.del(options, callback);
      }
    };
  },

  selectApiRoot: state => {
    return state.api.root;
  }
};
