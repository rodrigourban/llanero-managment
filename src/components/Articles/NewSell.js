import React from "react";
import { Form, InputNumber, Button, Switch, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { modalClose } from "../../store/actions/modal";
import { createSale, createOrder } from "../../store/actions/api";

const NewSell = () => {
  const payload = useSelector((state) => state.modal.payload);
  const dataList = useSelector((state) => state.api.dataList);
  const [maxQuantity, setMaxQuantity] = React.useState(null);
  const [cost, setCost] = React.useState(null);
  const token = useSelector((state) => state.auth.token);
  const [quantity, setQuantity] = React.useState(null);
  const [data, setData] = React.useState(null);
  const dispatch = useDispatch();
  const pagination = useSelector((state) => state.api.pagination);
  const order = useSelector((state) => state.api.order);
  const filter = useSelector((state) => state.api.filter);

  if (dataList.results[payload.key] && !data) {
    let formatedData = [];
    dataList.results[payload.key].location.map((item) => {
      formatedData.push({ ...item });
    });
    setData(formatedData);
  }

  const handleSubmit = (values) => {
    const order = values.switch;
    delete values.switch;
    const location = data[values.location].id;
    delete values.stock;
    const formatedValues = {
      ...values,
      article: payload.id,
      location,
    };
    dispatch(createSale(formatedValues, token));
    if (order) {
      dispatch(
        createOrder(
          {
            article: payload.id,
          },
          token,
          {pagination, order, filter}
        )
      );
    }
    dispatch(modalClose());
  };

  const updateMaxQuantity = (val) => {
    setMaxQuantity(data[val].quantity);
  };

  return (
    <>
      <h2>Vender articulo</h2>
      {dataList.results[payload.key] ? (
        <>
          <p>Estas por vender: {dataList.results[payload.key].name}</p>
          <p>
            Stock disponible:{" "}
            {maxQuantity ? maxQuantity : dataList.results[payload.key].quantity}
          </p>
          <p>
            Precio sugerido: {dataList.results[payload.key].suggested_price}
          </p>
        </>
      ) : null}
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="location"
          label="Ubicacion"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Selecciona de que ubicaciones quieres vender!",
            },
          ]}
        >
          <Select
            placeholder="Por favor selecciona un stock"
            onChange={updateMaxQuantity}
          >
            {data
              ? data.map((item, key) => (
                  <Select.Option value={key} key={key}>
                    {item.body} - {item.quantity}
                  </Select.Option>
                ))
              : null}
          </Select>
        </Form.Item>
        <Form.Item
          label="Cantidad"
          name="quantity"
          rules={[
            {
              required: true,
              message: "Por favor ingresa una cantidad",
            },
          ]}
        >
          <InputNumber
            onChange={(e) => setQuantity(e)}
            min={0}
            max={
              dataList.results[payload.key]
                ? parseInt(
                    maxQuantity
                      ? maxQuantity
                      : dataList.results[payload.key].quantity
                  )
                : 5000
            }
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Precio"
          name="price"
          rules={[
            {
              required: true,
              message: "Por favor ingresa un precio",
            },
          ]}
        >
          <InputNumber
            min={0}
            max={100000}
            step={0.1}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            style={{ width: "100%" }}
          />
        </Form.Item>
        {maxQuantity && maxQuantity === quantity ? (
          <Form.Item name="switch" label="Crear pedido" valuePropName="checked">
            <Switch />
          </Form.Item>
        ) : null}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Aceptar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default NewSell;
