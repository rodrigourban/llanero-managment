import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyledColumn = styled.th`
  height: 56px;
  padding: 0px 16px;

  &.number {
    text-align: right;
  }
`;

const Icon = styled.i`
  vertical-align: middle;

  transition: all 0.5s ease-out;

  &.clicked {
    transform: rotate(180deg);
  }
`;

const Column = props => {
  const [clicked, setClicked] = useState(false);

  const handleClick = e => {
    setClicked(!clicked);
    props.onSort(props.children, clicked);
  };
  const classes = clicked ? ["material-icons", "clicked"] : ["material-icons"];
  return (
    <StyledColumn
      scope="col"
      onClick={handleClick}
      clicked={clicked}
      className={props.type}
    >
      {props.sortable ? (
        <Icon className={classes.join(" ")}>arrow_downward</Icon>
      ) : null}

      {props.children}
    </StyledColumn>
  );
};

Column.propTypes = {
  type: PropTypes.string.isRequired,
  sortable: PropTypes.bool,
  onSort: PropTypes.func
};

export default Column;
