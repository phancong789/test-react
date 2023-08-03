import React from "react";
import PencilIcon from "mdi-react/PencilIcon";
import DeleteOutlineIcon from "mdi-react/DeleteOutlineIcon";
import LockResetIcon from "mdi-react/LockResetIcon";
import Switch from "react-switch";
import { Table } from "react-bootstrap";
import { styled } from "styled-components";
import ArrowUpIcon from "mdi-react/ArrowUpIcon";
import { openEditModal } from "./EditUserForm";
import { openDeleteModal } from "./DeleteUserForm";
import { useGetUserListQuery } from "../../../service/UserApi";
import { useAppDispatch, useAppSelector } from "../../../CustomHook/hook";
import { selectListUsers, setSelectUser } from "../../../features/UserSlice";
import * as env from "../../../env";
import "../Assets/Scss/UserTable.scss";

const TableData = styled.td`
  padding: 0 10px;
  margin: 10px 0;
  button {
    border: none;
    background-color: inherit;
    &:first-of-type {
      color: gray;
    }
    &:nth-of-type(2) {
      color: green;
    }
    &:last-of-type {
      color: red;
    }
  }
`;

export default function UserTable() {
  const { isLoading, isFetching, refetch } = useGetUserListQuery(0);
  const userListdata = useAppSelector(selectListUsers);
  const dispatch = useAppDispatch();
  const [show, setShow] = React.useState([false, false, false, false]);
  const [pressCount, setPressCount] = React.useState([0, 0, 0, 0]);
  let count = React.useRef<number>(0);
  let countArr = React.useRef<number[]>([0, 0, 0, 0]);
  let SortPara = React.useRef<string[]>([]);

  const clickHandle = (index: number, sortName: string) => {
    if (count.current > 4) {
      count.current = 4;
    }
    switch (pressCount[index]) {
      case 0:
        const newPressCount1 = pressCount.map((value, i) => {
          if (i === index) {
            return ++value;
          } else {
            return value;
          }
        });
        const changeShow = show.map((bool, i) => {
          if (i === index) {
            countArr.current[index] = ++count.current;
            return true;
          } else return bool;
        });
        setPressCount(newPressCount1);
        setShow(changeShow);
        SortPara.current[index] = sortName;
        env.getUserParams.set("sort", SortPara.current.join());
        refetch();
        return;

      case 1:
        const newPressCount2 = pressCount.map((value, i) => {
          if (i === index) {
            return ++value;
          } else {
            return value;
          }
        });
        setPressCount(newPressCount2);
        SortPara.current[index] = "-" + sortName;
        env.getUserParams.set("sort", SortPara.current.join());
        refetch();
        return;

      case 2:
        const newPressCount3 = pressCount.map((value, i) => {
          if (i === index) {
            return 0;
          } else {
            return value;
          }
        });
        const changeShow2 = show.map((bool, i) => {
          if (i === index) {
            countArr.current = countArr.current.map((x, i) => {
              if (i !== index && x !== 1) {
                return --x;
              } else if (i !== index) {
                return x--;
              } else {
                return (x = 0);
              }
            }) as number[];
            SortPara.current = SortPara.current.filter(
              (item) => item !== "-" + sortName
            );
            --count.current;
            return false;
          } else return bool;
        });
        setPressCount(newPressCount3);
        setShow(changeShow2);
        env.getUserParams.set("sort", SortPara.current.join());
        refetch();
        return;

      default:
        return;
    }
  };
  return (
    <div className="tableWaper">
      <Table responsive="md">
        <thead>
          <tr style={{ borderBottom: "1px solid black" }}>
            <th>
              <div className="d-flex align-items-center">
                <button
                  className="thbtn"
                  onClick={() => {
                    clickHandle(0, "name");
                  }}
                >
                  Tên hiển thị
                </button>
                <ArrowUpIcon
                  className={
                    show[0]
                      ? "arrowIcon show " +
                        (pressCount[0] === 2 && "upsidedown")
                      : "arrowIcon"
                  }
                  size={20}
                  opacity={0.6}
                />
                <div className={show[0] ? "indexCount show" : "indexCount"}>
                  <p>{countArr.current[0]}</p>
                </div>
              </div>
            </th>
            <th>
              <div className="d-flex align-items-center">
                <button
                  onClick={() => {
                    clickHandle(1, "username");
                  }}
                  className="thbtn"
                >
                  Tên đăng nhập
                </button>
                <ArrowUpIcon
                  className={
                    show[1]
                      ? "arrowIcon show " +
                        (pressCount[1] === 2 && "upsidedown")
                      : "arrowIcon"
                  }
                  size={20}
                  opacity={0.6}
                />
                <div className={show[1] ? "indexCount show" : "indexCount"}>
                  <p>{countArr.current[1]}</p>
                </div>
              </div>
            </th>
            <th>
              <button className="thbtn">Số điện thoại</button>
            </th>
            <th>
              <div className="d-flex align-items-center">
                <button
                  onClick={() => {
                    clickHandle(2, "inactive");
                  }}
                  className="thbtn"
                >
                  Trạng thái
                </button>
                <ArrowUpIcon
                  className={
                    show[2]
                      ? "arrowIcon show " +
                        (pressCount[2] === 2 && "upsidedown")
                      : "arrowIcon"
                  }
                  size={20}
                  opacity={0.6}
                />
                <div className={show[2] ? "indexCount show" : "indexCount"}>
                  <p>{countArr.current[2]}</p>
                </div>
              </div>
            </th>
            <th>
              <button className="thbtn">Quyền</button>
            </th>
            <th>
              <div className="d-flex align-items-center">
                <button
                  onClick={() => {
                    clickHandle(3, "created_at");
                  }}
                  className="thbtn"
                >
                  Ngày tạo
                </button>
                <ArrowUpIcon
                  className={
                    show[3]
                      ? "arrowIcon show " +
                        (pressCount[3] === 2 && "upsidedown")
                      : "arrowIcon"
                  }
                  size={20}
                  opacity={0.6}
                />
                <div className={show[3] ? "indexCount show" : "indexCount"}>
                  <p>{countArr.current[3]}</p>
                </div>
              </div>
            </th>
            <th>
              <button className="thbtn">Hành Động</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {isFetching || isLoading ? (
            <h1 style={{ margin: "1rem" }}>Loading</h1>
          ) : (
            userListdata?.list?.map((user) => {
              return (
                <tr>
                  <TableData>{user.name}</TableData>
                  <TableData>{user.username}</TableData>
                  <TableData>{user.mobile}</TableData>
                  <TableData>
                    <Switch
                      onChange={() => {}}
                      checked={!user.inactive}
                      onColor="#e7a7a3"
                      onHandleColor="#e27870"
                      uncheckedIcon={false}
                      checkedIcon={false}
                    ></Switch>
                  </TableData>
                  <TableData style={{ display: "flex", flexWrap: "wrap" }}>
                    {user.roles.map((role) => {
                      return (
                        <span
                          style={{
                            padding: "0.2rem 0.4rem",
                            margin: "0.2rem 0.2rem",
                            borderRadius: 5,
                            fontWeight: "bolder",
                            whiteSpace: "nowrap",
                            color: role.meta["text-color"],
                            backgroundColor: role.meta.color,
                          }}
                        >
                          {role.name}
                        </span>
                      );
                    })}
                  </TableData>
                  <TableData>{user.created_at.substring(0, 10)}</TableData>
                  <TableData style={{ display: "flex", flexWrap: "nowrap" }}>
                    <button>
                      <LockResetIcon />
                    </button>
                    <button
                      onClick={() => {
                        dispatch(setSelectUser(user));
                        openEditModal();
                      }}
                    >
                      <PencilIcon />
                    </button>
                    <button
                      onClick={() => {
                        dispatch(setSelectUser(user));
                        openDeleteModal();
                      }}
                    >
                      <DeleteOutlineIcon />
                    </button>
                  </TableData>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
}
