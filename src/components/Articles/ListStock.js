import React from "react";
import { Table } from "antd";
import { useSelector } from "react-redux";

const columns = [
  { title: "Fecha", dataIndex: "created_at" },
  { title: "Cantidad", dataIndex: "quantity" },
  { title: "Costo", dataIndex: "cost" },
];

const StockList = () => {
  const payload = useSelector((state) => state.modal.payload);
  const dataList = useSelector((state) => state.api.dataList);
  const [data, setData] = React.useState(null);

  if (dataList && !data) {
    let formatedData = [];
    dataList.results[payload].stock_list.map((item) => {
      const createdAt = new Date(item.created_at);
      const created_at = `${createdAt.getDate()}/${
        createdAt.getMonth() + 1
      }/${createdAt.getFullYear()}`;
      formatedData.push({ ...item, created_at });
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
      </Table>
    </>
  );
};

export default StockList;
