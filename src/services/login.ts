import client from './configApi';
import axios from 'axios';
import MD5 from 'crypto-js/md5';
export let token = null;
const limit = 10;

export default {
  // Login
  getLogin(username: any, password) {
    const url = `/drugstore/user?login_id=${username}&password=${MD5(
      password,
    )}`;
    //const url = `/drg-mobile-api/drugstore/user?login_id=${username}&password=${type === 1 ? password : MD5(password)}`;
    return client
      .get(url, { apiName: arguments.callee.name })
      .then(response => {
        token = response.data.token;
        return response.data;
      });
  },
  register(params) {
    let url = `/medlink/registration`;
    return client
      .post(url, params, { apiName: arguments.callee.name })
      .then(response => response);
  },

  resetPassword(params) {
    let url = `/medlink/reset-password`;
    return client
      .post(url, params, { apiName: arguments.callee.name })
      .then(response => response);
  },

  changePassword(params) {
    let url = `/medlink/change-password`;
    return client
      .post(url, params, {
        apiName: arguments.callee.name,
        headers: {
          Authorization: token,
        },
      })
      .then(response => response);
  },

  // Dashboard Home Screen
  getDashboard(drg_store_id, drg_store_id_ncc, order_by, per_page) {
    const urlDashboard = `/medlink/orderpool/dashboard/${drg_store_id}`;
    const urlList = `/medlink/orderpool/list?page=${1}&per_page=${per_page ||
      limit}`;
    let params = null;
    console.log('token', token);
    if (drg_store_id_ncc !== null) {
      params = {
        drg_store_id: drg_store_id,
        status: 0,
        order_by: order_by,
        drg_store_id_ncc: drg_store_id_ncc,
      };
    } else {
      params = {
        drg_store_id: drg_store_id,
        status: 0,
        order_by: order_by,
      };
    }
    return axios
      .all([
        client.get(urlDashboard, {
          apiName: 'getDashboard',
          headers: {
            Authorization: token,
          },
        }),
        client.post(urlList, params, {
          apiName: 'getListOrder',
          headers: {
            Authorization: token,
          },
        }),
      ])
      .then(([dashboardRes, ListRes]) => [dashboardRes, ListRes]);
  },
};
