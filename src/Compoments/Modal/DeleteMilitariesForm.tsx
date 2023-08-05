import CloseIcon from "mdi-react/CloseIcon";
import Button from "react-bootstrap/esm/Button";
import styled from "styled-components";
import { useAppSelector } from "../../CustomHook/hook";
import { selectSelectedMilitaries } from "../../Features/MilitariesSlice";
import {
  useDeleteMilitariesMutation,
  useGetMilitariesQuery,
} from "../../Services/MilitariesApi";
import { toast } from "react-toastify";

const Dialog = styled.dialog`
  z-index: 3;
  border: 0;
  margin: 0 auto;
  min-width: 35rem;
  max-width: 35rem;
  padding: 0;
  align-self: center;
  top: 50%;
  transform: translateY(-50%);
  outline: none;
  background-color: white;
  color: black;
  &::backdrop {
    background-color: #00000078;
  }
`;

const openDeleteModal = () => {
  document.querySelector<HTMLDialogElement>(".deleteUser-modal")?.showModal();
};

export default function DeleteMilitariesForm() {
  const [trigger] = useDeleteMilitariesMutation();
  const { refetch } = useGetMilitariesQuery(0);
  const selectmilitaries = useAppSelector(selectSelectedMilitaries);
  const clickHanlde = async () => {
    try {
      await trigger(selectmilitaries?.id);
      await refetch();
      toast.success("Xóa quân khu thành công");
    } catch (err) {
      toast.error("Xóa quân khu thất bại");
    }
    CloseModal();
  };

  const CloseModal = () => {
    const parent =
      document.querySelector<HTMLDialogElement>(".deleteUser-modal");
    parent?.close();
  };
  return (
    <Dialog className="deleteUser-modal">
      <div className="d-flex p-3 mb-2 justify-content-between text-light bg-danger">
        <h5 className="pt-2 pb-2 ps-2 m-0">Bạn có chắc chắn không ?</h5>
        <Button onClick={CloseModal} variant="none" className="p-1 m-1">
          <CloseIcon color="#fff" />
        </Button>
      </div>
      <div>
        <p className="mt-4 me-3 mb-2 ms-3">
          Bạn có chắc muốn xóa{" "}
          <span className="text-danger">{selectmilitaries?.name}</span>. Điều
          này hoàn toàn không thế hoàn tác!
        </p>
      </div>
      <div className="m-3 d-flex justify-content-end">
        <Button
          className="me-2"
          onClick={CloseModal}
          variant="light"
          type="button"
        >
          Hủy
        </Button>
        <Button variant="danger" onClick={clickHanlde} type="button">
          Xóa
        </Button>
      </div>
    </Dialog>
  );
}

export { openDeleteModal };
