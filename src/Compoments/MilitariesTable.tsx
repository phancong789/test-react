import React from "react";
import PencilIcon from "mdi-react/PencilIcon";
import DeleteOutlineIcon from "mdi-react/DeleteOutlineIcon";
import { Spinner, Table } from "react-bootstrap";
import { styled } from "styled-components";
import ArrowUpIcon from "mdi-react/ArrowUpIcon";
import { openEditModal } from "./Modal/EditMilitariesForm";
import { openDeleteModal } from "./Modal/DeleteMilitariesForm";
import { useAppDispatch, useAppSelector } from "../CustomHook/hook";
import * as env from "../env";
import "../Assets/Scss/MilitariesTable.scss";
import { useGetMilitariesQuery } from "../Services/MilitariesApi";
import {
  selectMilitaries,
  setSelectMilitaries,
} from "../Features/MilitariesSlice";

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

export default function MilitariesTable() {
  const { isLoading, isFetching, refetch } = useGetMilitariesQuery(0);
  const MilitariesListdata = useAppSelector(selectMilitaries);
  const dispatch = useAppDispatch();
  const [show, setShow] = React.useState([false, false, false, false]);
  const [pressCount, setPressCount] = React.useState([0, 0]);
  let count = React.useRef<number>(0);
  let countArr = React.useRef<number[]>([0, 0]);
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
        env.getMilitariesParams.set("sort", SortPara.current.join());
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
        env.getMilitariesParams.set("sort", SortPara.current.join());
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
        env.getMilitariesParams.set("sort", SortPara.current.join());
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
                  Tên
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
            {/* <th>
                <div className="d-flex align-items-center">
                  <button
                    onClick={() => {
                      clickHandle(1, "code");
                    }}
                    className="thbtn"
                  >
                    Mã
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
              </th>  */}
            <th>
              <button className="thbtn">Mã</button>
            </th>
            <th>
              <button className="thbtn">Miêu tả</button>
            </th>
            <th>
              <button className="thbtn">Hành Động</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {isFetching || isLoading ? (
            <Spinner animation="border" variant="success" />
          ) : (
            MilitariesListdata?.list.map((data) => {
              return (
                <tr>
                  <TableData>{data.name}</TableData>
                  <TableData>{data.code}</TableData>
                  <TableData>{data.description}</TableData>
                  <TableData style={{ display: "flex", flexWrap: "nowrap" }}>
                    <button
                      onClick={() => {
                        dispatch(setSelectMilitaries(data));
                        openEditModal();
                      }}
                    >
                      <PencilIcon style={{ color: "green" }} />
                    </button>
                    <button
                      onClick={() => {
                        dispatch(setSelectMilitaries(data));
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
