import React from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import { styled } from "styled-components";
import CloseIcon from "mdi-react/CloseIcon";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useAppSelector } from "../../../CustomHook/hook";
import { selectListRoles } from "../../../features/UserSlice";
import {
  useGetKhuBaotonQuery,
  useGetProvinceQuery,
} from "../../../service/HomeAndSearchApi";
import {
  selectProvinces,
  selectkhubaotons,
} from "../../../features/HomeAndSearchSlice";
import { toast } from "react-toastify";
import {
  useAddNewUserMutation,
  useGetUserListQuery,
} from "../../../service/UserApi";
import IError from "../../../Interface/IError";

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

const animatedComponents = makeAnimated();

const openCreateNewModal = () => {
  document.querySelector<HTMLDialogElement>(".addNew-modal")?.showModal();
};

export default function CreateNewUserForm() {
  const rolesData = useAppSelector(selectListRoles);
  const provinceData = useAppSelector(selectProvinces);
  const khubaotonData = useAppSelector(selectkhubaotons);
  const [addNewUser, { error }] = useAddNewUserMutation();
  const { refetch } = useGetUserListQuery(0);
  useGetProvinceQuery(0);
  useGetKhuBaotonQuery(0);
  const [errorData, setErrorData] = React.useState<IError>();
  const [validated, setValidated] = React.useState(false);
  const [checkPass, setCheckPass] = React.useState(false);
  const [selectRoleValue, setSelectRoleValue] = React.useState<
    | {
        value: number;
        label: string;
        color: string;
        backgroundColor: string;
      }[]
    | null
  >(null);
  const [selectProvinceValue, setSelectProvinceValue] = React.useState<
    | {
        value: number | string | undefined;
        label: string | undefined;
      }[]
    | null
  >(null);
  const [selectKhubaotonValue, setSelectKhubaotonValue] = React.useState<
    | {
        value: number | string | undefined;
        loai_khu: string | undefined;
        label: string | undefined;
      }[]
    | null
  >(null);

  let Rolesoptions = rolesData?.map((x) => {
    return {
      value: x.id,
      color: x.meta["text-color"],
      backgroundColor: x.meta.color,
      label: x.name,
    };
  });

  let Provinceoptions = provinceData?.map((x) => {
    return {
      value: x.id,
      label: x.name,
    };
  });

  let khubaotonoptions = khubaotonData?.map((x) => {
    return {
      value: x.id,
      label: x.ten,
      loai_khu: x.loai_khu,
    };
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      let formdata = new FormData(form);
      let formDataObj: any = {};
      formdata.forEach((value, key) => {
        formDataObj[key] = value;
      });
      let roleidarr: number[] = [];
      selectRoleValue?.map((x) => {
        roleidarr.push(x.value);
      });
      formDataObj["role_ids"] = roleidarr;

      let provinceidarr: number[] = [];
      selectProvinceValue?.map((x) => {
        if (x.value)
          provinceidarr.push(
            typeof x.value === "string" ? Number(x.value) : x.value
          );
      });
      formDataObj["provinces_ids"] = provinceidarr;

      let khubaotonidarr: object[] = [];
      selectKhubaotonValue?.map((x) =>
        khubaotonidarr.push({ id: x.value, ten: x.label, loai_khu: x.loai_khu })
      );
      formDataObj["khubaoton"] = khubaotonidarr;

      if (formDataObj["password"] === formDataObj["password_confirmation"]) {
        setCheckPass(false);
        addNewUser(formDataObj);
        if (!error) {
          refetch();
          CloseForm();
          toast("Tạo tài Khoản thành công");
        } else {
          setErrorData(error as IError);
          toast(errorData?.data.message);
        }
      } else {
        setCheckPass(true);
      }
    }
    setValidated(true);
  };

  const CloseForm = () => {
    const parent = document.querySelector<HTMLDialogElement>(".addNew-modal");
    parent?.close();
    parent?.querySelector<HTMLFormElement>("form")?.reset();
    setSelectRoleValue(null);
    setSelectKhubaotonValue(null);
    setSelectProvinceValue(null);
  };

  return (
    <Dialog className="addNew-modal">
      <Form
        noValidate
        style={{ overflow: "auto" }}
        validated={validated}
        onSubmit={handleSubmit}
      >
        <div className="d-flex p-3 mb-2 justify-content-between text-light bg-danger">
          <h5 className="pt-2 pb-2 ps-2 m-0">Thêm mới người dùng</h5>
          <Button onClick={CloseForm} variant="none" className="p-1 m-1">
            <CloseIcon color="#fff" />
          </Button>
        </div>
        <div className="m-2">
          <Form.Group className="mt-3 mb-3 ms-4 me-4" controlId="nameGroup">
            <Form.Label>Tên hiển thị</Form.Label>
            <Form.Control
              placeholder="vui lòng điền tên bạn mong muốn"
              type="text"
              className={errorData?.data.errors?.name ? "border-danger" : ""}
              name="name"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorData?.data.errors?.name
                ? errorData?.data.errors?.name[0]
                : "Trường mật khẩu không được bỏ trống."}
            </Form.Control.Feedback>
            <Form.Control.Feedback type="valid" className="text-danger">
              {errorData?.data.errors?.name
                ? errorData?.data.errors?.name[0]
                : ""}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mt-3 mb-3 ms-4 me-4" controlId="usernameGroup">
            <Form.Label>Tên đăng nhập</Form.Label>
            <Form.Control
              placeholder="vui lòng điền Tên đăng nhập bạn mong muốn"
              type="text"
              className={
                errorData?.data.errors?.username ? "border-danger" : ""
              }
              name="username"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorData?.data.errors?.username
                ? errorData?.data.errors?.username[0]
                : "Trường mật khẩu không được bỏ trống."}
            </Form.Control.Feedback>
            <Form.Control.Feedback type="valid" className="text-danger">
              {errorData?.data.errors?.username
                ? errorData?.data.errors?.username[0]
                : ""}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mt-3 mb-3 ms-4 me-4" controlId="EmailGroup">
            <Form.Label>Email</Form.Label>
            <Form.Control
              placeholder="vui lòng điền Email bạn mong muốn"
              type="email"
              className={errorData?.data.errors?.email ? "border-danger" : ""}
              name="email"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorData?.data.errors?.email
                ? errorData?.data.errors?.email[0]
                : "Trường email không được bỏ trống."}
            </Form.Control.Feedback>
            <Form.Control.Feedback type="valid" className="text-danger">
              {errorData?.data.errors?.email
                ? errorData?.data.errors?.email[0]
                : ""}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mt-3 mb-3 ms-4 me-4" controlId="phoneGroup">
            <Form.Label>Điện thoại</Form.Label>
            <Form.Control
              placeholder="vui lòng điền số Điện thoại bạn mong muốn"
              type="number"
              name="mobile"
            />
          </Form.Group>
          <Form.Group className="mt-3 mb-3 ms-4 me-4" controlId="passwordGroup">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              placeholder="vui lòng điền Mật khẩu bạn mong muốn"
              type="password"
              className={
                errorData?.data.errors?.password ? "border-danger" : ""
              }
              name="password"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorData?.data.errors?.password
                ? errorData?.data.errors?.password[0]
                : "Trường mật khẩu không được bỏ trống."}
            </Form.Control.Feedback>
            <Form.Control.Feedback type="valid" className="text-danger">
              {errorData?.data.errors?.password
                ? errorData?.data.errors?.password[0]
                : ""}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            className="mt-3 mb-3 ms-4 me-4"
            controlId="password_confirmationGroup"
          >
            <Form.Label>Mật khẩu xác nhận lại</Form.Label>
            <Form.Control
              placeholder="vui lòng điền lại mật khẩu"
              type="password"
              name="password_confirmation"
              required
            />
            {checkPass && <p className="text-danger">Mật khẩu Không khớp</p>}
          </Form.Group>
          <FormGroup className="mt-3 mb-3 ms-4 me-4">
            <label htmlFor="roleSelect">Quyền</label>
            <Select
              options={Rolesoptions}
              styles={{
                multiValue: (styles, { data }) => {
                  return {
                    ...styles,
                    backgroundColor: data.backgroundColor,
                    color: data.color,
                  };
                },
              }}
              value={selectRoleValue}
              components={animatedComponents}
              onChange={(e) => {
                setSelectRoleValue(
                  e.map((x) => {
                    return {
                      value: x.value,
                      color: x.color,
                      backgroundColor: x.backgroundColor,
                      label: x.label,
                    };
                  })
                );
              }}
              isMulti
            />
            <Form.Control.Feedback type="invalid">
              {!selectRoleValue && "Trường này không được phết để trống"}
            </Form.Control.Feedback>
          </FormGroup>
          {selectRoleValue?.some((x) => {
            return x.value === 4;
          }) && (
            <FormGroup className="mt-3 mb-3 ms-4 me-4">
              <label htmlFor="roleSelect">Tinh thành quản lý</label>
              <Select
                options={Provinceoptions}
                value={selectProvinceValue}
                components={animatedComponents}
                onChange={(e) => {
                  setSelectProvinceValue(
                    e.map((x) => {
                      return {
                        value: x.value,
                        label: x.label,
                      };
                    })
                  );
                }}
                isMulti
              />
              <Form.Control.Feedback type="invalid">
                {!selectProvinceValue && "Trường này không được phết để trống"}
              </Form.Control.Feedback>
            </FormGroup>
          )}
          {selectRoleValue?.some((x) => {
            return x.value === 5;
          }) && (
            <FormGroup className="mt-3 mb-3 ms-4 me-4">
              <label htmlFor="roleSelect">KBT/VQG quản lý</label>
              <Select
                options={khubaotonoptions}
                value={selectKhubaotonValue}
                components={animatedComponents}
                onChange={(e) => {
                  setSelectKhubaotonValue(
                    e.map((x) => {
                      return {
                        value: x.value,
                        loai_khu: x.loai_khu,
                        label: x.label,
                      };
                    })
                  );
                }}
                isMulti
              />
              <Form.Control.Feedback type="invalid">
                {!selectKhubaotonValue && "Trường này không được phết để trống"}
              </Form.Control.Feedback>
            </FormGroup>
          )}
          <div className="m-3 d-flex justify-content-end">
            <Button className="me-2" variant="light" type="button">
              Hủy
            </Button>
            <Button variant="danger" type="submit">
              Gửi
            </Button>
          </div>
        </div>
      </Form>
    </Dialog>
  );
}

export { openCreateNewModal };
