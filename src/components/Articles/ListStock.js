import React from "react";
import { Table } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {modalOpen, modalClose, default as modalActions} from '../../store/actions/modal';


const StockList = () => {
  const payload = useSelector((state) => state.modal.payload);
  const dataList = useSelector((state) => state.api.dataList);
  const dispatch = useDispatch();
  const [data, setData] = React.useState(null);

  if (dataList && !data) {
    let formatedData = [];
    dataList.results[payload].stock_list.map((item, key) => {
      const createdAt = new Date(item.created_at);
      const created_at = `${createdAt.getDate()}/${
        createdAt.getMonth() + 1
      }/${createdAt.getFullYear()}`;
      const actions = (
          <div className="actionContainer">
            <div
            className="actionBtn"
            onClick={() =>
              dispatch(modalOpen(3, { stock: key, key: payload }))
            }
            >
            <span>Editar stock</span>
            <i className="material-icons">edit</i>
            </div>
          </div>
      )
      formatedData.push({ ...item, created_at, actions });
    });
    setData(formatedData);
  }
  return (
    <>
      <h2>Listado de stock</h2>
      <h5>Articulo: {dataList.results[payload].name}</h5>
      <Table size="small" dataSource={data} rowKey="id">
        <Table.Column title="Costo" dataIndex="cost" key="cost" />
        <Table.Column title="Cantidad" dataIndex="quantity" key="quantity" />
        <Table.Column
          title="Ubicacion"
          dataIndex="location_name"
          key="location_name"
        />
        <Table.Column title="Fecha" dataIndex="created_at" key="created_at" />
        <Table.Column title="Acciones" dataIndex="actions" key="actions" />
      </Table>
    </>
  );
};

export default StockList;
