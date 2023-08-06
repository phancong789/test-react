import React from "react";
import ChevronLeftIcon from "mdi-react/ChevronLeftIcon";
import DotsHorizontalIcon from "mdi-react/DotsHorizontalIcon";
import ChevronRightIcon from "mdi-react/ChevronRightIcon";
import * as env from "../env";
import "../assets/Scss/Pagination.scss";
import { useAppSelector } from "../CustomHook/hook";
import { useGetMilitariesQuery } from "../Services/MilitariesApi";
import { selectMilitaries } from "../Features/MilitariesSlice";
import { Spinner } from "react-bootstrap";

export default function Pagination() {
  const [recall, setReCall] = React.useState(false);
  const { isLoading, isFetching, refetch } = useGetMilitariesQuery(0);
  const MilitariesListdata = useAppSelector(selectMilitaries);
  var pagecount = Math.ceil(
    (MilitariesListdata?.pagination.total as number) /
      Number(env.getMilitariesParams.get("itemsPerPage"))
  );
  var currentpage = Number(env.getMilitariesParams.get("page"));
  var prevPage = currentpage - 1;
  var nextPage = currentpage + 1;

  let min: number;
  let max: number;

  min =
    Number(env.getMilitariesParams.get("itemsPerPage")) * currentpage -
    Number(env.getMilitariesParams.get("itemsPerPage")) +
    1;
  max = currentpage * Number(env.getMilitariesParams.get("itemsPerPage"));
  if (min > (MilitariesListdata?.pagination.total as number)) {
    min = 0;
  }
  if (max > (MilitariesListdata?.pagination.total as number)) {
    max = MilitariesListdata?.pagination.total as number;
  }
  let listLi = [];
  for (var page = prevPage; page <= nextPage; page++) {
    if (page <= pagecount) {
      if (page === 0) continue;

      listLi.push(
        <li key={"page:" + page.toString()}>
          <button
            onClick={(e) => {
              env.getMilitariesParams.set("page", e.currentTarget.innerText);
              setReCall(!recall);
              refetch();
            }}
            className={currentpage === page ? "active" : ""}
          >
            {page}
          </button>
        </li>
      );
    }
  }

  if (isLoading || isFetching)
    return <Spinner animation="border" variant="success" />;

  return (
    <div className="Pagination m-4">
      <div>
        <p>
          {min +
            "-" +
            max +
            "/" +
            (MilitariesListdata?.pagination.total as number)}
        </p>
      </div>
      <div>
        <ul>
          {currentpage > 1 ? (
            <li>
              <button
                onClick={() => {
                  env.getMilitariesParams.set("page", String(currentpage - 1));
                  setReCall(!recall);
                  refetch();
                }}
              >
                <ChevronLeftIcon />
              </button>
            </li>
          ) : undefined}
          {currentpage > 2 ? (
            <li>
              <button
                onClick={() => {
                  env.getMilitariesParams.set("page", "1");
                  setReCall(!recall);
                  refetch();
                }}
              >
                1
              </button>
            </li>
          ) : undefined}
          {currentpage > 3 ? (
            <li>
              <button>
                <DotsHorizontalIcon />
              </button>
            </li>
          ) : undefined}
          {listLi}
          {currentpage < pagecount - 2 ? (
            <li>
              <button>
                <DotsHorizontalIcon />
              </button>
            </li>
          ) : undefined}
          {currentpage < pagecount - 1 ? (
            <li>
              <button
                onClick={() => {
                  env.getMilitariesParams.set("page", pagecount.toString());
                  setReCall(!recall);
                  refetch();
                }}
              >
                {pagecount}
              </button>
            </li>
          ) : undefined}
          {currentpage < pagecount ? (
            <li>
              <button
                onClick={() => {
                  env.getMilitariesParams.set("page", String(currentpage + 1));
                  setReCall(!recall);
                  refetch();
                }}
              >
                <ChevronRightIcon />
              </button>
            </li>
          ) : undefined}
        </ul>
      </div>
      <div>
        <select
          onChange={(e) => {
            env.getMilitariesParams.set("itemsPerPage", e.currentTarget.value);
            env.getMilitariesParams.set("page", "1");
            setReCall(!recall);
            refetch();
          }}
          name="itemsPerPage"
          value={env.getMilitariesParams.get("itemsPerPage") as string}
        >
          <option value="5">5 / trang</option>
          <option value="10">10 / trang</option>
          <option value="25">25 / trang</option>
          <option value="50">50 / trang</option>
        </select>
      </div>
    </div>
  );
}
