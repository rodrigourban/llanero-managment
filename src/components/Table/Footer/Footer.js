import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import "./footer.css";

const Container = styled.footer`
  align-self: flex-end;
  display: flex;
  flex-flow: columns;
  margin: 16px 0px 10px 0px;
  font-size: 0.9rem;
`;

const Element = styled.div`
  margin: 0px 16px;
  input {
    width: 10%;
  }

  button {
    outline: none;
    border: none;
    background: transparent;
    cursor: pointer;
  }
`;

const Footer = props => {
  return (
    <footer className="tableFooter">
      <div className="footerElement">
        Rows per page:{" "}
        <select id="perpage" onChange={e => props.onPageSize(e.target.value)}>
          <option value={10}>10</option>
          <option value={20}>25</option>
          <option value={30}>50</option>
          <option value={40}>100</option>
        </select>
      </div>
      <div className="footerElement">
        {props.pageTotal >= 0
          ? `${props.pageShowing} of ${props.pageTotal}`
          : null}
      </div>
      <div className="footerElement">
        <button onClick={props.onPreviousPage}>
          <i className="material-icons">chevron_left</i>
        </button>
        <button onClick={props.onNextPage}>
          <i className="material-icons">chevron_right</i>
        </button>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  pageShowing: PropTypes.string.isRequired,
  pageTotal: PropTypes.number.isRequired,
  onNextPage: PropTypes.func,
  onPreviosPage: PropTypes.func,
  onPageSize: PropTypes.func
};

export default Footer;
