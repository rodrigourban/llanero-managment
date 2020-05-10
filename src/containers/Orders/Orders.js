import React from "react";
import { Table, Input, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { EditOutlined } from "@ant-design/icons";
import * as modalActions from "../../store/actions/modal";
import * as apiActions from "../../store/actions/api";
import "./orders.scss";

const Orders = (props) => {
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
      const actions = (
        <div className="actionContainer">
          <div
            className="actionBtn"
            onClick={() =>
              dispatch(
                modalActions.modalOpen(8, {
                  id: doc.id,
                  name: doc.name,
                  state: doc.state,
                })
              )
            }
          >
            <span>Cambiar estado</span>
            <i className="material-icons">edit</i>
          </div>
        </div>
      );
      delete doc.created_at;
      const data = {
        ...doc,
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
        dispatch(apiActions.updatePagination(null));
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
    dispatch(apiActions.getDataList(0, token, 2, {pagination, order, filter}));
  }, [filter, pagination, order]);

  const handleTableChange = (paginate, filters, sorter) => {
    if (pagination !== paginate.current) {
      changeQueryParams("pagination", paginate.current);
    } else {
      const order = `${sorter.order === "descend" ? "-" : ""}${sorter.field}`;
      changeQueryParams("order", order);
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
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
          title="Fecha"
          dataIndex="created_at"
          key="created_at"
          sorter={true}
        />
        <Table.Column
          title="Nombre"
          dataIndex="name"
          key="name"
          sorter={true}
        />

        <Table.Column
          title="Estado"
          dataIndex="state"
          key="state"
          sorter={true}
        />
        <Table.Column title="Acciones" dataIndex="actions" key="actions" />
      </Table>
    </>
  );
};

export default Orders;
