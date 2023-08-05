import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useOutsideAlerter from "../CustomHook/useOutsideAlerter";
import "../assets/Scss/UserInfoAtConner.scss";
import { useMeQuery, useLogoutMutation } from "../Services/autherApi";
import { useAppSelector } from "../CustomHook/hook";
import { selectCurrentUser, selectToken } from "../Features/authorSlice";

export default function UserInfoPopDown() {
  useMeQuery(0);
  const [logout] = useLogoutMutation();
  const selectMe = useAppSelector(selectCurrentUser);
  const selecttoken = useAppSelector(selectToken);
  const wrapperRef = React.useRef(null);
  const customhook = useOutsideAlerter(wrapperRef);
  const navigate = useNavigate();

  const openPopDownHanlde = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    customhook.setShowPopDown(!customhook.showPopDown);
  };

  const LogoutHandle = () => {
    if (selecttoken?.access_token) {
      logout({ token: selecttoken?.access_token });
      navigate("/");
    }
  };

  return (
    <div ref={wrapperRef} className="position-relative">
      <div className="UserInfoAtConner" onClick={(e) => openPopDownHanlde(e)}>
        {selectMe?.user?.avatar_url ? (
          <img
            style={{ height: "2.7rem", width: "2.7rem", margin: 10 }}
            src={selectMe?.user.avatar_url}
            alt=""
          />
        ) : (
          <div className="avatarAlternative">
            <h4>{selectMe?.user?.name.charAt(0)}</h4>
          </div>
        )}
        <h6>{selectMe?.user?.name}</h6>
      </div>
      <div className={customhook.showPopDown ? "popdown" : "d-none"}>
        <div>
          {selectMe?.user?.avatar_url ? (
            <img src={selectMe?.user?.avatar_url} alt="" />
          ) : (
            <div className="avatarAlternative">
              <h4>{selectMe?.user?.name.charAt(0)}</h4>
            </div>
          )}
        </div>
        <p>{selectMe?.user?.name}</p>
        <div
          style={{
            backgroundColor: selectMe?.user?.role.meta.color,
            color: selectMe?.user?.role.meta["text-color"],
          }}
          className="fw-bolder"
        >
          {selectMe?.user?.role.name}
        </div>
        <div className="d-flex justify-content-between">
          <Button
            variant="none"
            onClick={() => {
              navigate("/");
            }}
            className="UserInfoPageBtn fw-bolder"
          >
            Hồ sơ
          </Button>
          <Button
            variant="none"
            onClick={LogoutHandle}
            className="logoutBtn text-danger fw-bolder"
          >
            Đăng xuát
          </Button>
        </div>
      </div>
    </div>
  );
}
