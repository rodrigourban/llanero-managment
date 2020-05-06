import * as actionTypes from "./actionTypes";
import axios from "axios";
import { config } from "../../Constants";

const TYPES = {
  0: "articles",
  1: "stocks",
  2: "orders",
  3: "sales",
  4: "users",
};

export const updated = () => {
  return {
    type: actionTypes.API_UPDATED,
  };
};

export const getDataList = (
  id,
  token,
  collectionType,
  filter,
  pagination,
  order,
  orderType
) => {
  console.log(id, token, filter, order, orderType);
  return (dispatch) => {
    dispatch(apiStart());
    const requestConfig = {
      headers: { Authorization: `Token ${token}` },
    };
    let queryParams = "";
    if (filter || pagination || order || orderType) {
      // const queryParams = `${filter ? `search=${filter}` : ""}`;
      queryParams = `${filter ? `search=${filter}&` : ""}${
        pagination ? `page=${pagination}&` : ""
      }${order ? `order=${order}` : ""}`;
    }
    const urlType = TYPES[collectionType];
    const url =
      id > 0
        ? `${config.url.API_URL}/api/${urlType}/${id}/`
        : `${config.url.API_URL}/api/${urlType}?${queryParams}`;
    axios
      .get(url, requestConfig)
      .then((res) => {
        console.log(res);
        if (id) {
          dispatch(apiSuccess(2, res.data));
        } else {
          dispatch(apiSuccess(1, res.data));
        }
      })

      .catch((error) => {
        dispatch(apiFail(error.response));
      });
  };
};

export const createArticle = (payload, token) => {
  return (dispatch) => {
    const requestConfig = {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    axios
      .post(`${config.url.API_URL}/api/articles/`, payload, requestConfig)
      .then((res) => {
        dispatch(getDataList(0, token, 0));
      })

      .catch((error) => {
        dispatch(apiFail(error.response.data));
      });
  };
};

export const createStock = (payload, token) => {
  return (dispatch) => {
    const requestConfig = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    axios
      .post(`${config.url.API_URL}/api/stocks/`, payload, requestConfig)
      .then((res) => {
        dispatch(getDataList(0, token, 0));
      })

      .catch((error) => {
        dispatch(apiFail(error.response.data));
      });
  };
};

export const createSale = (payload, token) => {
  return (dispatch) => {
    const requestConfig = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    axios
      .post(`${config.url.API_URL}/api/sales/`, payload, requestConfig)
      .then((res) => {
        dispatch(getDataList(0, token, 0));
      })

      .catch((error) => {
        dispatch(apiFail(error.response.data));
      });
  };
};

export const createOrder = (payload, token) => {
  return (dispatch) => {
    const requestConfig = {
      headers: { Authorization: `Token ${token}` },
    };
    axios
      .post(`${config.url.API_URL}/api/orders/`, payload, requestConfig)
      .then((res) => {
        //dispatch(getDataList(2, token));
        console.log(res);
      })
      .catch((error) => {
        dispatch(apiFail(error.response.data));
      });
  };
};

export const createUser = (payload, token) => {
  return (dispatch) => {
    const requestConfig = {
      headers: { Authorization: `Token ${token}` },
    };
    axios
      .post(
        `${config.url.API_URL}/rest-auth/registration/`,
        payload,
        requestConfig
      )
      .then((res) => {
        dispatch(getDataList(0, token, 4));
      })
      .catch((error) => {
        dispatch(apiFail(error.response.data));
      });
  };
};

export const transferStock = (payload, token) => {
  return (dispatch) => {
    const requestConfig = {
      headers: { Authorization: `Token ${token}` },
    };
    axios
      .post(`${config.url.API_URL}/api/transfer_stock`, payload, requestConfig)
      .then((res) => {
        dispatch(getDataList(0, token, 0));
      })
      .catch((error) => {
        dispatch(apiFail(error.response.data));
      });
  };
};

export const updateElement = (operationType, articleID, payload, token) => {
  return (dispatch) => {
    const requestConfig = {
      headers: { Authorization: `Token ${token}` },
    };
    const urlType = TYPES[operationType];
    axios
      .patch(
        `${config.url.API_URL}/api/${urlType}/${articleID}/`,
        payload,
        requestConfig
      )
      .then((res) => {
        dispatch(getDataList(0, token, operationType));
      })

      .catch((error) => {
        dispatch(apiFail(error.response.data));
      });
  };
};

export const toggleSideDrawer = () => {
  return {
    type: actionTypes.TOGGLE_SIDEDRAWER,
  };
};

export const updateFilter = (filter) => {
  return {
    type: actionTypes.UPDATE_FILTER,
    filter,
  };
};

export const updatePagination = (pagination) => {
  return {
    type: actionTypes.UPDATE_PAGINATION,
    pagination,
  };
};

export const updateOrder = (order) => {
  return {
    type: actionTypes.UPDATE_ORDER,
    order,
  };
};

export const apiStart = () => {
  return {
    type: actionTypes.API_START,
  };
};

export const apiFail = (error) => {
  return {
    type: actionTypes.API_FAIL,
    error: error,
  };
};

export const apiSuccess = (dataType, data) => {
  return {
    type: actionTypes.API_SUCCESS,
    data: data,
    dataType: dataType,
  };
};

export const getTotals = (token) => {
  return (dispatch) => {
    const requestConfig = {
      headers: { Authorization: `Token ${token}` },
    };
    axios
      .get(`${config.url.API_URL}/api/getTotals`, requestConfig)
      .then((res) => {
        dispatch(getTotalSuccess(res.data.stock_total, res.data.price_total));
      })

      .catch((error) => {
        dispatch(apiFail(error.response.data));
      });
  };
};

export const getTotalSuccess = (stockTotal, priceTotal) => {
  return {
    type: actionTypes.API_GET_TOTALS,
    stockTotal,
    priceTotal,
  };
};

export const getEarnings = (token, payload) => {
  return (dispatch) => {
    const requestConfig = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    axios
      .post(`${config.url.API_URL}/api/getEarnings`, payload, requestConfig)
      .then((res) => {
        dispatch(getEarningsSuccess(res.data));
      })

      .catch((error) => {
        dispatch(apiFail(error.response.data));
      });
  };
};

export const getEarningsSuccess = (earnings) => {
  return {
    type: actionTypes.API_GET_EARNINGS,
    earnings,
  };
};

export const resetOrderFilter = () => {
  return {
    type: actionTypes.RESET_ORDER_FILTER,
  };
};
