import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import AccountOutlineIcon from "mdi-react/AccountOutlineIcon";
import LockOutlineIcon from "mdi-react/LockOutlineIcon";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import { useLoginMutation } from "../service/autherApi";
import IError from "../Interface/IError";
import { ToastContainer, toast } from "react-toastify";

const SecHeader = styled.div`
  background-color: #da2a1c;
  display: flex;
  height: 6rem;
  padding: 0;
  div {
    align-items: center;
  }
`;

const Title = styled.h1`
  color: white;
  width: 100%;
  margin: 0 auto;
  font-size: 1.3rem;
  text-align: center;
`;

const Logowaper = styled.div`
  max-width: 80px;
  max-height: 80px;
  padding: 5px 15px;
`;

export default function LoginPage() {
  const [login] = useLoginMutation();
  const [errorData, setErrorData] = React.useState<IError>();
  const [validate, setValidate] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const handleSubmit = async (event: any) => {
    const form = event.currentTarget;
    event.stopPropagation();
    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();
    if (form.checkValidity() === true) {
      const formdata = new FormData(form);
      try {
        await login(formdata).unwrap();
        navigate("/bang-dieu-khien");
      } catch (error) {
        setErrorData(error as IError);
        toast.error(errorData?.data.message);
      }
      setValidate(true);
    }
  };

  return (
    <div>
      <ToastContainer />

      <Container
        fluid
        className="p-0"
        style={{
          minHeight: "100%",
          position: "absolute",
          backgroundImage:
            "url(http://wlp.howizbiz.com/static/img/footerLogin.cf032540.svg)",
          backgroundSize: "100% auto",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
          backgroundPositionX: "center",
          backgroundPositionY: "bottom",
        }}
      >
        <Row className="m-0">
          <SecHeader>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Link to="/">
                <Logowaper>
                  <img
                    style={{ width: "80%" }}
                    src="http://wlp.howizbiz.com/static/img/logoColor.e5de23ce.png"
                    alt=""
                  />
                </Logowaper>
              </Link>
              <Title>
                HỆ THỐNG BÁO CÁO VỀ HIỆN TRẠNG LOÀI NGUY CẤP QUÝ HIẾM ĐƯỢC ƯU
                TIÊN BẢO VỆ
              </Title>
            </div>
          </SecHeader>
        </Row>
        <Row className="m-0">
          <Container className="mt-5 p-0 pt-5">
            <Row className="m-0">
              <Col xxl={2} className="p-0" />
              <Col xxl={3} className="p-0" />
              <Col xxl={2} className="p-0">
                <Card>
                  <Card.Body>
                    <div
                      className="d-flex justify-content-center"
                      style={{ flexDirection: "column", textAlign: "center" }}
                    >
                      <Link to={"/"}>
                        <img
                          style={{ width: "20%", margin: "0 auto" }}
                          src="http://wlp.howizbiz.com/static/img/logoColor.e5de23ce.png"
                          alt=""
                        />
                      </Link>
                      <h1>Đăng Nhập</h1>
                    </div>
                    <Form
                      noValidate
                      validated={validate}
                      onSubmit={(e) => handleSubmit(e)}
                    >
                      <Form.Group className="mb-3">
                        <Form.Label>Tên đăng nhập</Form.Label>
                        <InputGroup hasValidation>
                          <InputGroup.Text>
                            <AccountOutlineIcon />
                          </InputGroup.Text>
                          <Form.Control
                            required
                            type="text"
                            className={
                              errorData?.data.message ? "border-danger" : ""
                            }
                            name="username"
                            placeholder="Điền tên đăng nhập"
                          />
                          <Form.Control.Feedback type="invalid">
                            Trường tên đăng nhập không được bỏ trống.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <InputGroup hasValidation>
                          <InputGroup.Text>
                            <LockOutlineIcon />
                          </InputGroup.Text>
                          <Form.Control
                            type="password"
                            name="password"
                            className={
                              errorData?.data.errors?.password ||
                              errorData?.data.message
                                ? "border-danger"
                                : ""
                            }
                            required
                            placeholder="Password"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errorData?.data.errors?.password
                              ? errorData?.data.errors?.password[0]
                              : "Trường mật khẩu không được bỏ trống."}
                          </Form.Control.Feedback>
                          <Form.Control.Feedback
                            type="valid"
                            className="text-danger"
                          >
                            {errorData?.data.errors?.password
                              ? errorData?.data.errors?.password[0]
                              : ""}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                      <div className="d-grid gap-2">
                        <Button
                          className="round"
                          variant="danger"
                          size="lg"
                          type="submit"
                        >
                          Đăng Nhập
                        </Button>
                      </div>
                      <div className=" pt-3 text-center">
                        <Button variant="light" type="button">
                          Quên Mật Khẩu
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              <Col xxl={3} className="p-0" />
              <Col xxl={2} className="p-0" />
            </Row>
          </Container>
        </Row>
      </Container>
    </div>
  );
}
