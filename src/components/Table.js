import React, { Component } from "react";
import { connect } from "react-redux";
import * as modalActions from "../store/actions/modal";
import { Link } from "react-router-dom";
import { Table, Input, Button, Tooltip } from "antd";
import Iconfrom "@ant-design/icons";
import "./Table.scss";

const columns = [
  { title: "Imagen", dataIndex: "image" },
  {
    title: "Nombre",
    dataIndex: "name",
  },
  { title: "SKU", dataIndex: "sku" },
  { title: "Ubicacion", dataIndex: "location" },
  { title: "Stock", dataIndex: "stock" },
  {
    title: "Precio",
    dataIndex: "price",
    sorter: (a, b) => a.price - b.price,
    sortDirections: ["descend", "ascend"],
  },
  { title: "Acciones", dataIndex: "actions" },
];

class CustomTable extends Component {
  state = {
    show: false,
    errors: null,
    isLoaded: false,
    arts: [],
    imageShow: false,
  };
  addNew = () => {
    this.props.modalOpen(1);
  };
  addSell = (id) => {
    this.props.modalOpen(2);
  };
  addStock = (id) => {
    this.props.modalOpen(3);
  };
  listStock = (id) => {
    this.props.modalOpen(4);
  };
  deleteItem = (id) => {
    this.props.modalOpen(5);
  };
  editItem = (id) => {
    this.props.modalOpen(6);
  };
  closeModal = () => {
    console.log("Close modal");
  };
  openImage = () => {
    this.props.modalOpen(7);
  };
  componentDidMount() {
    fetch("https://llanerosales-managment.herokuapp.com/api/inv/")
      .then((res) => res.json())
      .then(
        (result) => {
          let articles = result.map((item) => {
            const image = (
              <img
                src="http://lorempixel.com/400/400/"
                width="50px"
                height="50px"
                onClick={this.openImage}
              ></img>
            );
            const actions = (
              <div className="actions">
                <Tooltip title="Vender">
                  <Button
                    onClick={() => this.addSell(item.id)}
                    className="fixHeight"
                    icon="shopping-cart"
                  ></Button>
                </Tooltip>
                <Tooltip title="Editar">
                  <Button
                    onClick={() => this.editItem(item.id)}
                    className="fixHeight"
                    icon="edit"
                  ></Button>
                </Tooltip>
                <Tooltip title="Agregar stock">
                  <Button
                    onClick={() => this.addStock(item.id)}
                    className="fixHeight"
                    icon="file-add"
                  ></Button>
                </Tooltip>
                <Tooltip title="Detalle stock">
                  <Button
                    onClick={() => this.listStock(item.id)}
                    className="fixHeight"
                    icon="calendar"
                  ></Button>
                </Tooltip>
                <Tooltip title="Borrar">
                  <Button
                    onClick={() => this.deleteItem(item.id)}
                    className="fixHeight"
                    icon="close-circle"
                  ></Button>
                </Tooltip>
              </div>
            );

            return { ...item, actions, image };
          });
          console.log(articles);
          this.setState({
            isLoaded: true,
            arts: articles,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            errors: error,
          });
        }
      );
  }
  render() {
    return (
      <div>
        <Input.Search placeholder="Search" className="table-search" />
        <Table
          columns={columns}
          dataSource={this.state.arts}
          footer={() => "Stock total: 560"}
        >
          {/* 
          <tbody className="border">
            {this.state.arts.map((item, index) => (
              <tr>
                <td>{item.name}</td>
                <td>{item.sku}</td>
                <td>{item.location}</td>
                <td>{item.price}</td>
                <td>
                  <img
                    src="http://lorempixel.com/400/200/"
                    height="50px"
                    width="50px"
                    alt={item.name}
                  />
                </td>
                <td>{item.totalStock}</td>
                <td>
                  <span
                    onClick={this.addNew}
                    class="btn"
                    data-toggle="tooltip"
                    title="Generar pedido"
                  >
                    <i class="fa fa-calendar" aria-hidden="true" />
                  </span>
                  <span
                    onClick={this.addNew}
                    class="btn"
                    data-toggle="tooltip"
                    title="Detalle articulo"
                  >
                    <i class="fa fa-eye" aria-hidden="true" />
                  </span>
                  <span
                    onClick={this.addNew}
                    class="btn"
                    data-toggle="tooltip"
                    title="Editar articulo"
                  >
                    <i class="fas fa-pencil-alt" aria-hidden="true" />
                  </span>
                  <span
                    onClick={this.addNew}
                    class="btn"
                    data-toggle="tooltip"
                    title="Vender articulo"
                  >
                    <i class="fa fa-cart-plus" aria-hidden="true" />
                  </span>
                  <span
                    onClick={this.addNew}
                    class="btn"
                    data-toggle="tooltip"
                    title="Borrar articulo"
                  >
                    <i class="fa fa-times" aria-hidden="true" />
                  </span>
                  <span
                    onClick={this.addNew}
                    class="btn"
                    data-toggle="tooltip"
                    title="Agregar stock"
                  >
                    <i class="fab fa-dropbox" aria-hidden="true" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody> */}
          {/* {this.props.isAdmin ? (
          <button
          className="btn btn-secondary rounded-circle"
          onClick={this.addNew}
          >
            +
            </button>
        ) : null} */}
        </Table>
        <Link to="/addnew" target="_blank" className="floatingBtn">
          +
        </Link>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isAdmin: state.auth.admin,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    modalOpen: (id) => dispatch(modalActions.modalOpen(id)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CustomTable);
