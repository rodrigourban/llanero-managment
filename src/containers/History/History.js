import React from "react";
import { Table, Input, Tag } from "antd";
import { useSelector, useDispatch } from "react-redux";
import * as modalActions from "../../store/actions/modal";
import * as apiActions from "../../store/actions/api";
import "./history.scss";

const History = (props) => {
  const [content, setContent] = React.useState([]);
  const [timeout, setTimeo] = React.useState(null);
  const filter = useSelector((state) => state.api.filter);
  const pagination = useSelector((state) => state.api.pagination);
  const order = useSelector((state) => state.api.order);
  const count = useSelector((state) => state.api.count);
  const loading = useSelector((state) => state.api.loading);
  const token = useSelector((state) => state.auth.token);
  const dataList = useSelector((state) => state.api.dataList);
  const updated = useSelector((state) => state.api.updated);
  const dispatch = useDispatch();

  if (dataList && updated) {
    const dataListCopy = [...dataList.results];
    let newContent = [];
    dataListCopy.map((doc, key) => {
      const createdAt = new Date(doc.created_at);
      const created_at = `${createdAt.getDate()}/${
        createdAt.getMonth() + 1
      }/${createdAt.getFullYear()}`;
      const cost = doc.additional.cost;
      const name = doc.additional.article;
      const gross = doc.additional.gross;
      const net = doc.additional.net;
      const actions = (
        <div className="actionContainer">
          {doc.status ? (
            <div
              className="actionBtn"
              onClick={() =>
                dispatch(modalActions.modalOpen(10, { id: doc.id, type: 3 }))
              }
            >
              <span>Cancelar venta</span>
              <i className="material-icons">cancel</i>
            </div>
          ) : (
            <Tag color="error">CANCELADA</Tag>
          )}
        </div>
      );
      delete doc.created_at;
      const data = {
        ...doc,
        cost,
        name,
        gross,
        net,
        actions,
        created_at,
      };
      newContent.push(data);
    });
    setContent(newContent);
    dispatch(apiActions.updated());
  }

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
    dispatch(apiActions.getDataList(0, token, 3, {pagination, order, filter}));
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
        <Table.Column
          title="Cantidad"
          dataIndex="quantity"
          key="sku"
          sorter={true}
        />
        <Table.Column
          title="Fecha"
          dataIndex="created_at"
          key="created_at"
          sorter={true}
        />
        <Table.Column
          title="Costo"
          dataIndex="cost"
          key="cost_price"
          sorter={false}
        />
        <Table.Column
          title="Precio"
          dataIndex="price"
          key="sell_price"
          sorter={false}
        />
        <Table.Column
          title="Ingreso"
          dataIndex="net"
          key="net"
          sorter={false}
        />
        <Table.Column
          title="Ganancia"
          dataIndex="gross"
          key="gross"
          sorter={false}
        />
        <Table.Column title="Acciones" dataIndex="actions" key="actions" />
      </Table>
    </>
  );
};

export default History;
