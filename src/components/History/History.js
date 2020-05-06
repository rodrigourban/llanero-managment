import React from "react";
import { Table, DatePicker, Button, Typography, Input } from "antd";
import "../Table.css";
const columns = [
  { title: "Articulo", dataIndex: "name" },
  { title: "Fecha", dataIndex: "created_at" },
  { title: "Costo", dataIndex: "cost" },
  { title: "Cantidad", dataIndex: "amount" },
  { title: "Precio", dataIndex: "price" },
  { title: "Bruto", dataIndex: "gross" },
  { title: "Neto", dataIndex: "net" }
];
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: record => ({
    disabled: record.name === "Disabled User", // Column configuration not to be checked
    name: record.name
  })
};

const dataSource = [
  {
    key: 1,
    name: "Aro Bisel De Faro 7 Pulgadas Harley Davidson Touring	",
    created_at: "02/01/03",
    amount: "2",
    price: "200",
    gross: "400",
    net: "100"
  },
  {
    key: 2,
    name: "Aro Trim Deep Cut Para Faro 7 Pulg Para Harley Davidson",
    created_at: "02/01/03",
    amount: "2",
    price: "140",
    gross: "280",
    net: "100"
  },
  {
    key: 3,
    name: "Aro Trim Deep Cut Para Faro 7 Pulg Para Harley Davidson",
    created_at: "02/01/03",
    amount: "2",
    price: "120",
    gross: "240",
    net: "100"
  },
  {
    key: 4,
    name: "Asiento Cafe Resortes Con Base Para Harley Davidson Y Otras	",
    created_at: "02/01/03",
    amount: "3",
    price: "100",
    gross: "300",
    net: "100"
  }
];
const History = () => {
  const footer = () => (
    <div className="footer">
      <span className="footer-left">
        Calcular ganancias: <DatePicker.RangePicker></DatePicker.RangePicker>
      </span>
      <span className="footer-right">
        <Button>Anular</Button>
      </span>
    </div>
  );
  return (
    <div className="container-fluid">
      <h1 className="text-center mt-3 mb-2">
        <i className="fas fa-boxes" />
        Registro
      </h1>
      <Input.Search className="table-search"></Input.Search>
      <Table
        columns={columns}
        dataSource={dataSource}
        footer={footer}
        rowSelection={rowSelection}
      ></Table>
    </div>
  );
};

export default History;
