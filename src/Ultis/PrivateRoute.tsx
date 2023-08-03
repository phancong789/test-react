import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../CustomHook/hook";
import { selectToken, setTokenFormStogare } from "../Features/authorSlice";

export function PrivateRoute() {
  const token = useAppSelector(selectToken);
  const dispatch = useAppDispatch();
  const location = useLocation();
  if (!token) {
    dispatch(
      setTokenFormStogare(JSON.parse(localStorage.getItem("token") as string))
    );
  }

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default PrivateRoute;
