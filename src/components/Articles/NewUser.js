import React from "react";
import { Form, Input, Button, Switch } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { modalClose } from "../../store/actions/modal";
import { createUser } from "../../store/actions/api";

const NewUser = () => {
  const payload = useSelector((state) => state.modal.payload);
  const dataList = useSelector((state) => state.api.dataList);
  const token = useSelector((state) => state.auth.token);
  const [quantity, setQuantity] = React.useState(null);
  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    dispatch(createUser(values, token));
    dispatch(modalClose());
  };

  return (
    <>
      <h2>Crear nueva cuenta</h2>
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Usuario"
          name="username"
          rules={[
            {
              required: true,
              message: "Por favor ingresa un usuario",
            },
          ]}
        >
          <Input style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Por favor ingresa un email",
            },
          ]}
        >
          <Input style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          name="password1"
          rules={[
            {
              required: true,
              message: "Por favor ingresa una contraseña",
            },
            {
              min: 8,
              message: "La contraseña no puede tener menos de 8 caracteres",
            },
          ]}
          extra="La contraseña debe tener mas de 8 caracteres, números y letras"
        >
          <Input.Password
            prefix={
              <LockOutlined
                style={{
                  color: "rgba(0,0,0,.25)",
                  verticalAlign: "baseline",
                }}
              />
            }
          />
        </Form.Item>
        <Form.Item
          label="Repite la contraseña"
          name="password2"
          rules={[
            {
              required: true,
              message: "Por favor repite tu contraseña",
            },
            {
              min: 8,
              message: "La contraseña no puede tener menos de 8 caracteres",
            },
          ]}
        >
          <Input.Password
            prefix={
              <LockOutlined
                style={{
                  color: "rgba(0,0,0,.25)",
                  verticalAlign: "baseline",
                }}
              />
            }
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Aceptar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default NewUser;
