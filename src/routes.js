import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomLayout from "./containers/Layout";
import Inventory from "./containers/Inventory/Inventory";
import Orders from "./containers/Orders/Orders";
import History from "./containers/History/History";
import Admin from "./components/Admin/Admin";
import Analytics from "./components/Analytics/Analytics";
import Login from "./components/Login/Login";

const BaseRouter = () => {
  const token = useSelector((state) => state.auth.token);
  const admin = useSelector((state) => state.auth.admin);
  return (
    <>
      {token ? (
        <Router>
          <CustomLayout>
            <Route exact path="/" component={Inventory} />
            {admin ? (
              <>
                <Route exact path="/admin" component={Admin} />
                <Route exact path="/orders" component={Orders} />
                <Route exact path="/history" component={History} />
                <Route exact path="/analytics" component={Analytics} />{" "}
              </>
            ) : null}
          </CustomLayout>
        </Router>
      ) : (
        <Login />
      )}
    </>
  );
};

export default BaseRouter;
