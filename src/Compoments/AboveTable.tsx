import { Col, Nav, Button, Row } from "react-bootstrap";
import PlusIcon from "mdi-react/PlusIcon";
import MagnifyIcon from "mdi-react/MagnifyIcon";
import "../assets/Scss/AboveTable.scss";

export default function AboveTable() {
  return (
    <Row className="d-flex justify-content-between">
      <Col>
        <Nav variant="underline" defaultActiveKey="list">
          <Nav.Item>
            <Nav.Link eventKey="list">Dạng bảng</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="map">Dạng bản đồ</Nav.Link>
          </Nav.Item>
        </Nav>
      </Col>
      <Col className="d-flex">
        <Col className="SearchbarWapper">
          <MagnifyIcon />
          <input id="Searchbar" placeholder="Tìm kiếm theo tên" type="text" />
        </Col>
        <Button variant="success">
          <PlusIcon /> Thêm Mới
        </Button>
      </Col>
    </Row>
  );
}
