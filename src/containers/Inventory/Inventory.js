import React from "react";
import { Table, Input, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import * as modalActions from "../../store/actions/modal";
import * as apiActions from "../../store/actions/api";
import "../../components/Table.scss";
import "./inventory.css";

const Inventory = (props) => {
  const [content, setContent] = React.useState([]);
  const [timeout, setTimeo] = React.useState(null);
  const filter = useSelector((state) => state.api.filter);
  const pagination = useSelector((state) => state.api.pagination);
  const order = useSelector((state) => state.api.order);
  const count = useSelector((state) => state.api.count);
  const loading = useSelector((state) => state.api.loading);
  const stockTotal = useSelector((state) => state.api.stockTotal);
  const priceTotal = useSelector((state) => state.api.priceTotal);
  const [stockPage, setStockPage] = React.useState(0);
  const [totalPrice, setPricePage] = React.useState(0.0);
  const token = useSelector((state) => state.auth.token);
  const dataList = useSelector((state) => state.api.dataList);
  const updated = useSelector((state) => state.api.updated);
  const admin = useSelector((state) => state.auth.admin);
  const dispatch = useDispatch();

  if (dataList && updated) {
    const dataListCopy = [...dataList.results];
    let newContent = [];
    let stock = 0,
      price = 0;
    dataListCopy.map((doc, key) => {
      const actions = (
        <div className="actionContainer">
          {doc.quantity > 0 ? (
            <div
              className="actionBtn"
              onClick={() =>
                dispatch(modalActions.modalOpen(2, { key, id: doc.id }))
              }
            >
              <span>Vender articulo</span>
              <i className="material-icons">add_shopping_cart</i>
            </div>
          ) : null}

          <div
            className="actionBtn"
            onClick={() =>
              dispatch(modalActions.modalOpen(3, { key, id: doc.id }))
            }
          >
            <span>Agregar stock</span>
            <i className="material-icons">note_add</i>
          </div>

          <div
            className="actionBtn"
            onClick={() =>
              dispatch(modalActions.modalOpen(1, { key, id: doc.id }))
            }
          >
            <span>Editar articulo</span>
            <i className="material-icons">edit</i>
          </div>

          <div
            className="actionBtn"
            onClick={() => dispatch(modalActions.modalOpen(4, key))}
          >
            <span>Detalle stock</span>
            <i className="material-icons">calendar_today</i>
          </div>
          <div
            className="actionBtn"
            onClick={() =>
              dispatch(modalActions.modalOpen(11, { key, id: doc.id }))
            }
          >
            <span>Transferir stock</span>
            <i className="material-icons">transform</i>
          </div>
          {doc.link.length > 1 ? (
            <div
              className="actionBtn"
              onClick={() => copyMercadolibreLink(doc.link)}
            >
              <span>Copiar link de MercadoLibre</span>
              <i className="material-icons">link</i>
            </div>
          ) : null}
          <div
            className="actionBtn"
            onClick={() =>
              dispatch(modalActions.modalOpen(5, { id: doc.id, type: 0 }))
            }
          >
            <span>Borrar articulo</span>
            <i className="material-icons">cancel</i>
          </div>
        </div>
      );
      const locations = `${doc.location[0].body} ${doc.location[0].quantity} - ${doc.location[1].body} ${doc.location[1].quantity}`;
      const data = {
        ...doc,
        actions,
        locations,
      };
      newContent.push(data);
      stock += doc.quantity;
      price += doc.stock_list.reduce(
        (sum, { quantity, cost }) => sum + quantity * cost,
        0
      );
    });
    setContent(newContent);
    setStockPage(stock);
    setPricePage(price);
    dispatch(apiActions.getTotals(token));
    dispatch(apiActions.updated());
  }

  const copyMercadolibreLink = (link) => {
    const el = document.createElement("textarea");
    el.value = link;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    message.success("El link ha sido copiado exitosamente!", 2);
  };

  const onSearchChanged = (value) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    setTimeo(
      setTimeout(
        function (value) {
          changeQueryParams("search", value);
        },
        1500,
        value
      )
    );
  };

  const changeQueryParams = (field, value) => {
    switch (field) {
      case "search":
        dispatch(apiActions.updatePagination(1));
        dispatch(apiActions.updateFilter(value));
        break;
      case "pagination":
        dispatch(apiActions.updatePagination(value));
        break;
      case "order":
        dispatch(apiActions.updateOrder(value));
        break;
      default:
        return;
    }
  };

  React.useEffect(() => {
    dispatch(apiActions.getDataList(0, token, 0, {pagination, order, filter}));
  }, [filter, pagination, order]);

  const handleTableChange = (paginate, filters, sorter) => {
    if (pagination !== paginate.current) {
      changeQueryParams("pagination", paginate.current);
    } else {
      const order = `${sorter.order === "descend" ? "-" : ""}${sorter.field}`;
      changeQueryParams("order", order);
    }
  };

  return (
    <>
      <Input.Search onChange={(e) => onSearchChanged(e.target.value)} />
      <Table
        dataSource={content} //Table content>
        rowKey="id"
        onChange={handleTableChange}
        pagination={{ pageSize: 20, total: count }}
        style={{ overflow: "auto" }}
        loading={loading}
      >
        <Table.Column
          title="Nombre"
          dataIndex="name"
          key="name"
          sorter={true}
        />
        <Table.Column title="SKU" dataIndex="sku" key="sku" sorter={true} />
        <Table.Column title="Ubicacion" dataIndex="locations" key="locations" />
        {admin ? (
          <Table.Column title="Costo" dataIndex="cost" key="cost" />
        ) : null}
        <Table.Column
          title="Precio"
          dataIndex="suggested_price"
          key="suggested_price"
          sorter={true}
        />
        <Table.Column title="Stock" dataIndex="quantity" key="quantity" sorter={true} />
        <Table.Column
          title="Imagen"
          dataIndex="image"
          key="image"
          render={(image) => (
            <img
              src={image}
              width="64px"
              onClick={() => dispatch(modalActions.modalOpen(7, image))}
            />
          )}
        />
        {admin ? (
          <Table.Column title="Acciones" dataIndex="actions" key="actions" />
        ) : null}
      </Table>
      {admin ? (
        <div>
          Stock total: {stockPage} / {stockTotal}
        </div>
      ) : null}
      {admin ? (
        <div>
          Precio total: ${totalPrice} / ${priceTotal}
        </div>
      ) : null}
      {admin ? (
        <span
          onClick={() => dispatch(modalActions.modalOpen(1))}
          className="floatingBtn"
        >
          +
        </span>
      ) : null}
    </>
  );
};

export default Inventory;
