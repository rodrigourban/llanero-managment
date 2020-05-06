import React from "react";
import styled from "styled-components";
import Rows from "./Rows/Rows";
import Column from "./Columns/Columns";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import PropTypes from "prop-types";
import "./table.css"

const Table = props => {
  return (
    <div className="tcontainer">
      <Header onFilter={props.onFilter}>{props.title}</Header>
      <div className="tableContainer">
        <div className="styledTable">
          <Column elements={props.columns} onSort={props.onSort} />
          <Rows content={props.data} onImageOpen={props.onImageOpen} />
        </div>
      </div>
      <Footer
        onPreviousPage={props.onPreviousPage}
        onNextPage={props.onNextPage}
        onPageSize={props.onPageSize}
        pageShowing={`${
          props.pageCurrent === 0 ? 1 : props.pageCurrent * props.pageSize
        }-${
          props.pageCurrent === 0
            ? props.data.length
            : props.data.length + props.pageCurrent * props.pageSize
        }`} //Shows in footer the quantity of elements that are currently being shown
        pageTotal={props.totalElements}
      />
    </div>
  );
};

Table.propTypes = {
  //Validators
  title: PropTypes.string.isRequired,
  data: PropTypes.array,
  columns: PropTypes.array.isRequired,
  pageCurrent: PropTypes.number,
  pageSize: PropTypes.number,
  totalElements: PropTypes.number,
  actions: PropTypes.arrayOf(PropTypes.func),
  onSort: PropTypes.func,
  onFilter: PropTypes.func,
  onPreviousPage: PropTypes.func,
  onNextPage: PropTypes.func,
  onPageSize: PropTypes.func,
  onImageOpen: PropTypes.func
};

export default Table;
