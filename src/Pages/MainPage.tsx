import AboveTable from "../Compoments/AboveTable";
import TopBar from "../Compoments/TopBar";
import styled from "styled-components";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 50px;
`;

function MainPage() {
  return (
    <>
      <TopBar />
      <Content>
        <AboveTable />
      </Content>
    </>
  );
}

export default MainPage;
