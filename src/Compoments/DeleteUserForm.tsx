import CloseIcon from "mdi-react/CloseIcon";
import React from "react";
import Button from "react-bootstrap/esm/Button";
import styled from "styled-components";
import {
  useDeleteUserMutation,
  useGetUserListQuery,
} from "../../../service/UserApi";
import { useAppSelector } from "../../../CustomHook/hook";
import { selectSelectedUser } from "../../../features/UserSlice";

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
  &::backdrop {
    background-color: #00000078;
  }
`;

const openDeleteModal = () => {
  document.querySelector<HTMLDialogElement>(".deleteUser-modal")?.showModal();
};

export default function DeleteUserForm() {
  const [deleteUser] = useDeleteUserMutation();
  const userdata = useAppSelector(selectSelectedUser);
  const { refetch } = useGetUserListQuery(0);
  const clickHanlde = () => {
    deleteUser(userdata);
    refetch();
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
        <h5 className="pt-2 pb-2 ps-2 m-0">Cập nhật người dùng</h5>
        <Button onClick={CloseModal} variant="none" className="p-1 m-1">
          <CloseIcon color="#fff" />
        </Button>
      </div>
      <div>
        <p className="mt-4 me-3 mb-2 ms-3">
          Bạn có chắc muốn xóa{" "}
          <span className="text-danger">{userdata?.username}</span>. Điều này
          hoàn toàn không thế hoàn tác!
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
