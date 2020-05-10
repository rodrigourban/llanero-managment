import React from "react";
import { Form, Input, Button, Upload, message, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import * as apiActions from "../../store/actions/api";
import { modalClose } from "../../store/actions/modal";

const ArticleForm = () => {
  const dispatch = useDispatch();
  const [file, setFile] = React.useState(null);
  const [data, setData] = React.useState(null);
  const article = useSelector((state) => state.modal.payload);
  const error = useSelector((state) => state.api.error);
  const token = useSelector((state) => state.auth.token);
  const dataList = useSelector((state) => state.api.dataList);
  const pagination = useSelector((state) => state.api.pagination);
  const order = useSelector((state) => state.api.order);
  const filter = useSelector((state) => state.api.filter);

  const props = {
    beforeUpload(file) {
      setFile(file);
      return false;
    },
  };

  if (article && !data) {
    let formatedData = { ...dataList.results[article.key] };
    if ('image' in formatedData) {
      delete formatedData.image
    }
    const location = formatedData.location[0].body;
    const optional_location = formatedData.location[1].body;
    delete formatedData.location;
    setData({
      ...formatedData,
      location,
      optional_location,
    });
  }

  const handleSubmit = (values) => {
    let formData = new FormData();
    if (!values.image) delete values.image;
    for (var key in values) {
      formData.append(key, values[key]);
    }
    if (file) {
      formData.set("image", file, `${encodeURI(values.name)}.png`);
    }
    if (article) {
      //Update
      if (file) {
        dispatch(apiActions.updateElement(0, article.id, formData, token, {pagination, order, filter}));
      } else {
        dispatch(apiActions.updateElement(0, article.id, values, token, {pagination, order, filter}));
      }
      dispatch(modalClose());
    } else {
      //Create
      dispatch(apiActions.createArticle(formData, token, {pagination, order, filter}));
      dispatch(modalClose());
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Form
      style={{ margin: "16px" }}
      onFinish={handleSubmit}
      layout="vertical"
      initialValues={article && data ? data : null}
    >
      {article ? <h2>Editar articulo</h2> : <h2>Agregar articulo nuevo</h2>}
      <Form.Item
        label="Nombre"
        name="name"
        rules={[
          {
            required: article ? false : true,
            message: "Por favor ingresa un nombre",
          },
        ]}
      >
        <Input></Input>
      </Form.Item>
      <Form.Item
        label="SKU"
        name="sku"
        rules={[
          {
            required: article ? false : true,
            message: "Por favor ingresa un SKU",
          },
        ]}
      >
        <Input></Input>
      </Form.Item>
      <Form.Item
        label="Ubicacion"
        name="location"
        rules={[
          {
            required: article ? false : true,
            message: "Por favor ingresa una ubicación",
          },
        ]}
      >
        <Input></Input>
      </Form.Item>
      {article ? (
        <Form.Item label="Ubicacion opcional" name="optional_location">
          <Input></Input>
        </Form.Item>
      ) : null}
      <Form.Item
        label="Precio sugerido"
        name="suggested_price"
        rules={[
          {
            required: article ? false : true,
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
        ></InputNumber>
      </Form.Item>

      <Form.Item label="Link" name="link">
        <Input></Input>
      </Form.Item>
      <Form.Item
        name="image"
        label="Image"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload {...props} multiple={false}>
          <Button>
            <UploadOutlined /> {article ? 'Cargar nueva imagen' : 'Click para subir imagen'}
          </Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {article ? "Editar" : "Crear"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ArticleForm;
