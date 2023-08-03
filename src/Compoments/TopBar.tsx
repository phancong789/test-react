import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/esm/Row";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import MenuIcon from "mdi-react/MenuIcon";
import UserInfoPopDown from "./UserPopDown";
import "../assets/Scss/ControlPanelTopBar.scss";
import { useAppDispatch } from "../CustomHook/hook";
import { setToggleControlPanelSiderBar } from "../Features/UiSlice";

const SecHeader = styled.div`
  background-color: white;
  display: flex;
  height: 4rem;
  div {
    align-items: center;
  }
`;

const Title = styled.h1`
  width: 100%;
  margin: 0 auto;
  white-space: nowrap;
  overflow: hidden;
  font-size: 1.3rem;
  font-family: SVN-Product Sans, sans-serif !important;
`;

const Logowaper = styled.div`
  max-width: 70px;
  max-height: 70px;
  min-height: 50px;
  min-width: 50px;
`;

export default function TopBar() {
  const dispatch = useAppDispatch();
  return (
    <Container fluid className="ControlPanelTopBar flex-lg-shrink-1">
      <Row>
        <SecHeader>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Button
              variant="light"
              onClick={() => {
                dispatch(setToggleControlPanelSiderBar());
              }}
              className="rounded-circle"
            >
              <MenuIcon />
            </Button>
            <Link to="/">
              <Logowaper>
                <img
                  style={{ width: "100%", padding: 10 }}
                  src="https://gtvtqs.samcom.com.vn/static/img/logo.png"
                  alt=""
                />
              </Logowaper>
            </Link>
            <Title>Hệ thống thông tin địa lý mạng GTVTQS</Title>
            <UserInfoPopDown />
          </div>
        </SecHeader>
      </Row>
    </Container>
  );
}
