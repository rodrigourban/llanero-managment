import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Td = styled.td`
  width: 200px;
  &.number {
    text-align: right;
  }

  img {
    width: 100%;
    height: 80px;
  }
`;

const Row = props => {
  if (props.id === "image") {
    return (
      <Td onClick={() => props.onImageOpen(props.children)}>
        <img src={props.children} alt="Imagen de articulo" />
      </Td>
    );
  } else {
    return <Td className={props.type}>{props.children}</Td>;
  }
};

Row.propTypes = {
  type: PropTypes.string.isRequired,
  onImageOpen: PropTypes.func
};

export default Row;
