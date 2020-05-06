import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Column from "./Column/Column";
const Container = styled.tr`
  text-align: center;
  th:nth-child(2) {
    text-align: left;
  }
`;

const columns = props => {
  const elements = props.elements.map((el, index) => {
    if (el.name !== "id" && el.name !== "creador") {
      return (
        <Column
          key={index}
          sortable={el.sortable}
          onSort={props.onSort}
          type={el.type}
        >
          {el.name}
        </Column>
      );
    }
    return null;
  });
  return (
    <thead>
      <Container>{elements}</Container>
    </thead>
  );
};

columns.propTypes = {
  elements: PropTypes.array.isRequired,
  onSort: PropTypes.func
};

export default columns;
