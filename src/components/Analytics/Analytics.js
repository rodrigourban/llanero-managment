import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, DatePicker, Radio } from "antd";
import { getEarnings, updated } from "../../store/actions/api";
import { Line } from "react-chartjs-2";

const data = {
  // labels: ["Enero", "Febrero", "Marzo", "Abril", "Purple", "Orange"],
  // datasets: [
  //   {
  //     label: "Ganancia",
  //     data: [12, 19, 3, 5, 2, 3],
  // backgroundColor: ["rgba(0, 255, 0, 0.2)"],
  // borderColor: ["rgba(0, 255, 0, 0.2)"],
  // borderWidth: 1,
  //   },
  //   {
  //     label: "Cantidad",
  //     data: [24, 36, 6, 10, 8, 6],
  // backgroundColor: ["rgba(0, 0, 255, 0.2)"],
  // borderColor: ["rgba(0, 0, 255, 0.2)"],
  // borderWidth: 1,
  //   },
  // ],
};

const Analytics = () => {
  const [dateType, setDateType] = React.useState("");
  const [data, setData] = React.useState({});
  const token = useSelector((state) => state.auth.token);
  const earnings = useSelector((state) => state.api.earnings);
  const isUpdated = useSelector((state) => state.api.updated);
  const dispatch = useDispatch();

  if (earnings && isUpdated) {
    const newData = {
      labels: earnings.labels,
      datasets: [
        {
          label: "Ganancias",
          data: earnings.earnings,
          backgroundColor: ["rgba(0, 255, 0, 0.2)"],
          borderColor: ["rgba(0, 255, 0, 0.2)"],
          borderWidth: 1,
        },
        {
          label: "Ingresos",
          data: earnings.gross,
          backgroundColor: ["rgba(255, 0, 0, 0.2)"],
          borderColor: ["rgba(255, 0, 0, 0.2)"],
          borderWidth: 1,
        },
        {
          label: "Cantidad",
          data: earnings.quantity,
          backgroundColor: ["rgba(0, 0, 255, 0.2)"],
          borderColor: ["rgba(0, 0, 255, 0.2)"],
          borderWidth: 1,
        },
      ],
    };
    setData(newData);
    dispatch(updated());
  }

  const onChangeDate = (date, dateString) => {
    if (dateString[0] && dateString[1]) {
      dispatch(
        getEarnings(token, {
          dateFrom: dateString[0],
          dateTo: dateString[1],
          // dateType,
        })
      );
    }
  };

  const onChange = (e) => {
    setDateType(e.target.value);
  };

  return (
    <div width="100%">
      <Typography.Title>Analytics</Typography.Title>
      <Typography.Paragraph>
        Aqui podras ver todas las estadisticas de tus negocios. Para generar
        ganancias por favor selecciona un rango de fechas
      </Typography.Paragraph>
      <Typography.Title level={4}>Calcular ganancias</Typography.Title>
      {/* <Radio.Group onChange={onChange} value={dateType}>
        <Radio value="">Dias</Radio>
        <Radio value="week">Semana</Radio>
        <Radio value="month">Meses</Radio>
        <Radio value="year">Año</Radio>
      </Radio.Group> */}
      <DatePicker.RangePicker onChange={onChangeDate} />
      <Line data={data} />
      <p style={{ marginTop: "2rem" }}>
        {earnings
          ? `Los ingresos totales fueron de $${earnings.gross_total}, las ganancias fueron $${earnings.earnings_total} de ${earnings.quantity_total} articulos vendidos`
          : null}
      </p>
    </div>
  );
};

export default Analytics;
