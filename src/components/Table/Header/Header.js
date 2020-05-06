import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Search from "../Search/Search";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 16px;
`;

const Title = styled.h1`
  justify-self: start;
  align-self: flex-start;
  padding: 0px 0px 0px 20px;
`;

const header = props => {
  return (
    <Header>
      <Title>{props.children}</Title>
      <Search onFilter={props.onFilter} />
    </Header>
  );
};

header.propTypes = {
  children: PropTypes.string.isRequired,
  onFilter: PropTypes.func.isRequired
};
export default header;
