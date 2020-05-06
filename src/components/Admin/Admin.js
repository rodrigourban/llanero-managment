import React from "react";
import { Table, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import * as modalActions from "../../store/actions/modal";
import * as apiActions from "../../store/actions/api";
import "../Table.scss";

const columns = [
  { title: "Nombre", dataIndex: "username", sorter: true },
  { title: "Fecha", dataIndex: "date_joined", sorter: true },
  { title: "Rol", dataIndex: "role" },
  { title: "Acciones", dataIndex: "actions" },
];

const Admin = () => {
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
      const createdAt = new Date(doc.date_joined);
      const date_joined = `${createdAt.getDate()}/${
        createdAt.getMonth() + 1
      }/${createdAt.getFullYear()}`;
      const actions = (
        <div className="actionContainer">
          {doc.is_staff ? null : (
            <div
              className="actionBtn"
              onClick={() =>
                dispatch(modalActions.modalOpen(5, { id: doc.pk, type: 4 }))
              }
            >
              <span>Borrar cuenta</span>
              <i className="material-icons">cancel</i>
            </div>
          )}
        </div>
      );

      delete doc.date_joined;
      const role = doc.is_staff ? "Admin" : "Vendedor";
      const data = {
        ...doc,
        actions,
        date_joined,
        role,
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
    dispatch(apiActions.getDataList(0, token, 4, filter, pagination, order));
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
        dataSource={content}
        columns={columns}
        rowKey="id"
        onChange={handleTableChange}
        pagination={{ pageSize: 20, total: count }}
        style={{ overflow: "auto" }}
        loading={loading}
      ></Table>
      <span
        onClick={() => dispatch(modalActions.modalOpen(9))}
        className="floatingBtn"
      >
        +
      </span>
    </>
  );
};

export default Admin;
