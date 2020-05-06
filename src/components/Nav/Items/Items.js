import React from "react";
import styled from "styled-components";
import Item from "./Item/Item";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/actions/auth";

const Navigation = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  align-items: center;
  height: 100%;

  @media (max-width: 500px) {
    flex-flow: column;
    &.desktopOnly {
      display: none;
    }
  }
`;

const NavigationItems = (props) => {
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.auth.admin);
  return (
    <Navigation className={props.desktop ? "desktopOnly" : null}>
      <Item link="/">Inventario</Item>
      {admin ? (
        <>
          <Item link="/orders">Pedidos</Item>
          <Item link="/history">Historial</Item>
          <Item link="/analytics">Estadisticas</Item>
          <Item link="/admin">Admin</Item>
        </>
      ) : null}
      <a
        onClick={() => dispatch(logout())}
        style={{
          color: "black",
          height: "100%",
          width: "100%",
          padding: "16px 10px",
          borderBottom: "4px solid transparent",
          boxSizing: "border-box",
        }}
      >
        Salir
      </a>
    </Navigation>
  );
};

export default NavigationItems;
