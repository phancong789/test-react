import Styled from "styled-components";
import QRCode from "react-qr-code";
import { Col } from "react-bootstrap";
import "../../Compoments/Shared/assets/scss/SpeciesCard.scss";
import { useId, useState } from "react";
import { useLazyGetMapinfoQuery } from "../../service/HomeAndSearchApi";
import { useAppDispatch, useAppSelector } from "../../CustomHook/hook";
import IMapInfo from "../../Interface/IMapInfo";
import { deleteMapInfo, setMapinfo } from "./ProvinceSlice";

interface SpecieData {
  province: IMapInfo;
  xxl?: number;
  xl?: number;
  lg?: number;
  md?: number;
  sm?: number;
  className?: string;
  editFunc?: (data: IMapInfo) => void;
}

export default function ProvinceCard({
  province,
  xxl,
  xl,
  lg,
  md,
  sm,
  className,
  editFunc,
}: SpecieData): React.JSX.Element {
  const checkboxid = useId();
  const [ownInfoMapData, setOwnInfoMapData] = useState<number>(0);
  const dispatch = useAppDispatch();

  const checkedHandle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      dispatch(setMapinfo(province));
      setOwnInfoMapData(province.id);
    } else {
      dispatch(deleteMapInfo(ownInfoMapData));
    }
  };
  return (
    <Col
      xxl={xxl}
      xl={xl}
      lg={lg}
      md={md}
      sm={sm}
      style={{ padding: 0, borderRadius: 5 }}
      className={"ProminentSpecieCard flex-grow-1 " + className}
    >
      <div className="Cardinfo">
        <p>{province?.id}</p>
        <h3>{province?.full_name}</h3>
        <p>{province?.code}</p>
      </div>
      <div className="TakeLocation d-flex">
        <div>
          <input onChange={checkedHandle} type="checkbox" id={checkboxid} />
          <label htmlFor={checkboxid}>Hiện thị trên bản đồ</label>
        </div>
        {editFunc && (
          <div>
            <button
              onClick={() => {
                editFunc(province);
              }}
            >
              edit
            </button>
          </div>
        )}
      </div>
    </Col>
  );
}
