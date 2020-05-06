import React from "react";
import styled from "styled-components";
import LeftMenu from "./LeftNav";
import RightMenu from "./RightNav";
import { Drawer, Button } from "antd";
import Icon from "@ant-design/icons";
import logo from "../../assets/llanerologo.svg";
import "./Navbar.css";

const Toolbar = styled.header``;

const Menu = styled.nav``;

// <div className="menuLogo">
//           <a href="#">
//             <img src={logo} alt="Logo LlaneroSales" width="50%"></img>
//           </a>
//         </div>
//         <div className="menuContainer">
//           <div className="menuLeft">
//             <LeftMenu mode="horizontal"></LeftMenu>
//           </div>
//           <div className="menuRight">
//             <RightMenu mode="horizontal"></RightMenu>
//           </div>
//           <Button
//             className="menuMobileBtn"
//             onClick={this.onOpen}
//             icon="menu"
//           ></Button>
//           <Drawer
//             title="Navigation Drawer"
//             placement="left"
//             className="menuDrawer"
//             closable={false}
//             onClose={this.onClose}
//             visible={this.state.visible}
//           >
//             <LeftMenu mode="inline"></LeftMenu>
//             <RightMenu mode="inline"></RightMenu>
//           </Drawer>
//         </div>

const Navbar = () => {
  return (
    <Toolbar>
      <Menu></Menu>
    </Toolbar>
  );
};

export default Navbar;
