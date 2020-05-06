import React, { useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 2;
`;

const BackDrop = props => {
  useEffect(() => {
    // add when mounted
    document.addEventListener("keyup", handleKey);
    // cleanup after unmount
    return () => {
      document.removeEventListener("keyup", handleKey);
    };
  }, []);

  const handleKey = e => {
    if (e.key === "Escape") {
      props.onClose();
    }
  };

  return <Container onClick={props.onClose} />;
};

export default BackDrop;
