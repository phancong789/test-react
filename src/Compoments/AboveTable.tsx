import { Col, Nav, Button, Row } from "react-bootstrap";
import PlusIcon from "mdi-react/PlusIcon";
import MagnifyIcon from "mdi-react/MagnifyIcon";
import { useLazyGetMilitariesQuery } from "../Services/MilitariesApi";
import * as env from "../env";
import "../assets/Scss/AboveTable.scss";
import { useAppDispatch } from "../CustomHook/hook";
import { setSwitchTableType } from "../Features/UiSlice";
import { openCreateNewModal } from "./Modal/CreateNewMilitariesForm";

export default function AboveTable() {
  const [refetch] = useLazyGetMilitariesQuery();
  const dispatch = useAppDispatch();
  const SearchHandle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    env.getMilitariesParams.set("search", e.currentTarget.value);
    refetch(0);
  };
  const SwitchTable = (e: string | null) => {
    if (e) dispatch(setSwitchTableType(e));
  };
  return (
    <div>
      <Row className="d-flex justify-content-between mb-2">
        <Col>
          <Nav
            variant="underline"
            onSelect={SwitchTable}
            defaultActiveKey="list"
          >
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
            <input
              onKeyUp={SearchHandle}
              id="Searchbar"
              placeholder="Tìm kiếm theo tên"
              type="text"
            />
          </Col>
          <Button onClick={openCreateNewModal} variant="success">
            <PlusIcon /> Thêm Mới
          </Button>
        </Col>
      </Row>
    </div>
  );
}
