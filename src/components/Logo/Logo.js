import React from "react";
import styled from "styled-components";
import log from "../../assets/llanerologo.svg";

const Logo = styled.div`
  background-color: trasparent;
  padding: 8px;
  height: 100%;
  box-sizing: border-box;

  img {
    height: 100%;
  }
`;

const logo = props => (
  <Logo style={{ height: props.height, marginBottom: props.margin }}>
    <img src={log} alt="Llanero Sales, bikers like you" />
  </Logo>
);

export default logo;
