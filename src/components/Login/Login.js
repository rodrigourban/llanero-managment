import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, Button, Spin, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import * as actions from "../../store/actions/auth";
import "./Login.css";

const Login = (props) => {
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    dispatch(actions.authLogin(values.username, values.password));
  };

  if (error) {
    message.error("He ocurrido un error, por favor intente de nuevo", 5);
  }

  return (
    <div className="login">
      <div className="loginForm">
        <div className="loginTitle" />
        {loading ? (
          <Spin size="large" />
        ) : (
          <Form onFinish={handleSubmit}>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa tu usuario!",
                },
              ]}
            >
              <Input
                prefix={
                  <UserOutlined
                    style={{
                      color: "rgba(0,0,0,.25)",
                      verticalAlign: "baseline",
                    }}
                  />
                }
                placeholder="Usuario"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Por favor ingresa tu clave!" },
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
                placeholder="Contraseña"
              />
            </Form.Item>
            <Form.Item style={{ width: "100%" }}>
              <Button type="primary" htmlType="submit" block>
                Ingresar
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

export default Login;
