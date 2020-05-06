import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  title: null,
  selectedTab: 1,
  loading: false,
  error: null,
  dataList: null,
  dataElement: null,
  columns: null,
  updated: true,
  count: 0,
  filter: null,
  pagination: null,
  order: null,
  stockTotal: 0,
  priceTotal: 0,
  earnings: null,
};

const toggleSideDrawer = (state, action) => {
  return updateObject(state, {
    sideDrawer: !state.sideDrawer,
  });
};

const updateFilter = (state, action) => {
  return updateObject(state, {
    filter: action.filter,
  });
};
const updatePagination = (state, action) => {
  return updateObject(state, {
    pagination: action.pagination,
  });
};
const updateOrder = (state, action) => {
  return updateObject(state, {
    order: action.order,
  });
};

const apiStart = (state, action) => {
  return updateObject(state, {
    loading: true,
  });
};

const apiFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const apiSuccess = (state, action) => {
  const count = action.data.count ? action.data.count : 0;
  return updateObject(state, {
    loading: false,
    error: null,
    dataList: action.data,
    updated: true,
    count,
  });
};

const apiUpdated = (state, action) => {
  return updateObject(state, {
    updated: false,
  });
};

const apiGetTotals = (state, action) => {
  return updateObject(state, {
    stockTotal: action.stockTotal,
    priceTotal: action.priceTotal,
  });
};

const apiGetEarnings = (state, action) => {
  return updateObject(state, {
    earnings: action.earnings,
    updated: true,
  });
};

const resetOrderFilter = (state, action) => {
  return updateObject(state, {
    filter: null,
    pagination: null,
    order: null,
  });
};

const apiReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.API_START:
      return apiStart(state, action);
    case actionTypes.API_SUCCESS:
      return apiSuccess(state, action);
    case actionTypes.API_FAIL:
      return apiFail(state, action);
    case actionTypes.API_UPDATED:
      return apiUpdated(state, action);
    case actionTypes.API_GET_TOTALS:
      return apiGetTotals(state, action);
    case actionTypes.API_GET_EARNINGS:
      return apiGetEarnings(state, action);
    case actionTypes.UPDATE_FILTER:
      return updateFilter(state, action);
    case actionTypes.UPDATE_PAGINATION:
      return updatePagination(state, action);
    case actionTypes.UPDATE_ORDER:
      return updateOrder(state, action);
    case actionTypes.RESET_ORDER_FILTER:
      return resetOrderFilter(state, action);
    case actionTypes.TOGGLE_SIDEDRAWER:
      return toggleSideDrawer(state, action);
    default:
      return state;
  }
};

export default apiReducer;
