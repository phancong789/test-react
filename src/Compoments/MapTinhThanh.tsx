import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Map, {
  NavigationControl,
  GeolocateControl,
  Source,
  Layer,
  FillLayer,
  Popup,
} from "react-map-gl";
import { Feature, Geometry } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { useAppSelector } from "../../CustomHook/hook";
import { Button, Col, Nav } from "react-bootstrap";
import { useLazyGetProvinceQuery } from "./ProvinceApi";
import { selectMapinfo, selectProvinces } from "./ProvinceSlice";
import ProvinceCard from "./ProvinceCard";
import * as env from "../../env";
import DrawControl from "./draw-control";
import SimpleSelect from "./draw/simple_select";
import DrawLineString from "./draw/linestring";
import DrawRectangle from "./draw/rectangle";
import DrawCircle from "./draw/circle";
import IMapInfo from "../../Interface/IMapInfo";

const Titles = styled.p`
  font-weight: bold;
  font-size: 1.4rem;
  margin-left: 1rem;
  margin-top: 1rem;
`;

export default function MapTinhThanh() {
  const [reCall, setReCall] = React.useState(false);
  const [popup, setpopup] = React.useState<{
    longitude: number;
    latitude: number;
    name: string;
    code: number;
    id: number;
    fullName: string;
    type_data: string;
    centerPoint: {
      type: string;
      coordinates: number[];
    };
  } | null>(null);
  const [features, setFeatures] = useState({});
  const [switchList, setSwitchList] = useState<number>(0);
  const drawRef = React.useRef<MapboxDraw>();

  const [triger] = useLazyGetProvinceQuery();
  const ProvinceData = useAppSelector(selectProvinces);
  const MapinfoData = useAppSelector(selectMapinfo);

  const layerStyle: FillLayer = {
    id: "water",
    type: "fill",
    source: "water",
    paint: {
      "fill-color": "blue",
      "fill-outline-color": "red",
    },
  };
  let map: Feature[] = MapinfoData.map((x) => ({
    id: x.id,
    type: "Feature",
    properties: {
      name: x.name,
      code: x.code,
      id: x.id,
      type_data: x.type_data,
      centerPoint: x.center_point,
      fullName: x.full_name,
    },
    geometry: x.geometry as Geometry,
  }));

  ///@ts-ignore
  const onUpdate = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        ///@ts-ignore
        newFeatures[f.id] = f;
      }
      return newFeatures;
    });
  }, []);
  ///@ts-ignore
  const onDelete = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        ///@ts-ignore
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);

  const changeTo = (data: IMapInfo) => {
    console.log(map);
    drawRef.current?.changeMode("direct_select" as never, {
      featureIds: ["21"],
    });
  };

  useEffect(() => {
    setReCall(!reCall);
  }, [JSON.stringify(MapinfoData)]);

  const openPopUpHandle = useCallback((e: any) => {
    const feature = e.features && e.features[0];
    setpopup({
      longitude: e.lngLat.lng,
      latitude: e.lngLat.lat,
      name: feature.properties.name,
      code: feature.properties.code,
      id: feature.properties.id,
      centerPoint: feature.properties.centerPoint,
      fullName: feature.properties.fullName,
      type_data: feature.properties.type_data,
    });
  }, []);
  useEffect(() => {
    triger(0);
  }, []);
  return (
    <div className="d-flex" style={{ minHeight: "100%" }}>
      <Col xxl={3} style={{ padding: "0 5px" }}>
        <Nav
          variant="pills"
          onSelect={(e) => {
            setSwitchList(Number(e));
          }}
          defaultActiveKey={0}
        >
          <Nav.Item>
            <Nav.Link eventKey={0} as="button">
              Province
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={1} as="button">
              Custom Data
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Titles>
          {switchList === 0
            ? `Kết quả (${ProvinceData?.pagination.total})`
            : "Dữ liệu đã tạo"}
        </Titles>
        <div
          style={{ overflowY: "scroll", maxHeight: "83%" }}
          className="mb-2 d-flex flex-column"
        >
          {switchList === 0 ? (
            ProvinceData?.list.map((p) => (
              <ProvinceCard province={p} editFunc={changeTo} />
            ))
          ) : (
            <div></div>
          )}
        </div>
        {switchList === 0 && (
          <div style={{ height: 30 }} className="position-relative">
            <Button
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              variant="none border-bottom m-auto fs-4 border-2"
              onClick={() => {
                env.getProvinParams.set(
                  "page",
                  (Number(env.getProvinParams.get("page")) + 1).toString()
                );
                triger(1);
              }}
            >
              tải thêm
            </Button>
          </div>
        )}
      </Col>
      <div style={{ width: "100%", minHeight: "100%" }}>
        <Map
          mapboxAccessToken="pk.eyJ1Ijoic3RlcGFua3V6bWluIiwiYSI6Ik1ieW5udm8ifQ.25EOEC2-N92NCWT0Ci9w-Q"
          initialViewState={{
            longitude: 112,
            latitude: 16.6,
            zoom: 5,
          }}
          onClick={openPopUpHandle}
          interactiveLayerIds={["water"]}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://tiles.skymapglobal.vn/styles/basic/style.json"
        >
          <NavigationControl position="bottom-right" />
          <GeolocateControl position="bottom-right" />
          <DrawControl
            ref={drawRef}
            position="top-right"
            displayControlsDefault={false}
            controls={{
              point: true,
              polygon: true,
              line_string: true,
              trash: true,
            }}
            modes={{
              ...MapboxDraw.modes,
              simple_select: SimpleSelect,
              direct_select: MapboxDraw.modes.direct_select,
              draw_line_string: DrawLineString,
              draw_rectangle: DrawRectangle,
              draw_circle: DrawCircle,
            }}
            defaultMode="simple_select"
            onCreate={onUpdate}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onModeChange={(e) => {
              console.log("b", drawRef.current?.getMode());
            }}
          />
          <Source
            id="my-data"
            type="geojson"
            data={{
              type: "FeatureCollection",
              features: map,
            }}
          >
            <Layer {...layerStyle} />
          </Source>
          {popup && (
            <Popup
              longitude={popup.longitude}
              latitude={popup.latitude}
              anchor="center"
              onClose={() => {
                setpopup(null);
              }}
            >
              <b>
                Tên dầy đủ: <br /> {popup.fullName}
              </b>
              <p>Mã tình thành: {popup.code}</p>
              <p>ID của tình thành: {popup.id}</p>
              <p>Loại: {popup.type_data}</p>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}
