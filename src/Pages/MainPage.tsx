import styled from "styled-components";
import { useAppSelector } from "../CustomHook/hook";
import { selectSwitchTableType } from "../Features/UiSlice";
import Maptable from "../Compoments/MapTable";
import AboveTable from "../Compoments/AboveTable";
import MilitariesTable from "../Compoments/MilitariesTable";
import Pagination from "../Compoments/Pagination";
import TopBar from "../Compoments/TopBar";
import CreateNewMilitariesForm from "../Compoments/Modal/CreateNewMilitariesForm";
import EditMilitariesForm from "../Compoments/Modal/EditMilitariesForm";
import DeleteMilitariesForm from "../Compoments/Modal/DeleteMilitariesForm";
import { ToastContainer } from "react-toastify";
import "../assets/Scss/MainPage.scss";

function MainPage() {
  const SwitchTableType = useAppSelector(selectSwitchTableType);
  return (
    <>
      <ToastContainer />
      <TopBar />
      <div className="content">
        <AboveTable />
        {SwitchTableType === "list" ? (
          <>
            <MilitariesTable />
            <Pagination />
          </>
        ) : (
          <Maptable />
        )}
      </div>
      <CreateNewMilitariesForm />
      <EditMilitariesForm />
      <DeleteMilitariesForm />
    </>
  );
}

export default MainPage;
