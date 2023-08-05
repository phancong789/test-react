import Map, {
  Source,
  Layer,
  NavigationControl,
  GeolocateControl,
  FillLayer,
  Popup,
  FullscreenControl,
  ScaleControl,
  MapLayerMouseEvent,
} from "react-map-gl";
import { useCallback, useState } from "react";
import { Geometry } from "geojson";
import { useGetMilitariesQuery } from "../Services/MilitariesApi";
import { useAppDispatch, useAppSelector } from "../CustomHook/hook";
import {
  selectMilitaries,
  setSelectMilitaries,
} from "../Features/MilitariesSlice";
import "mapbox-gl/dist/mapbox-gl.css";
import "../assets/Scss/MapTable.scss";
import * as env from "../env";
import { openDeleteModal } from "./Modal/DeleteMilitariesForm";
import { openEditModal } from "./Modal/EditMilitariesForm";
import { Button, Spinner } from "react-bootstrap";
import IMilitariesData from "../Interface/IMilitariesData";

const layerStyle: FillLayer = {
  id: "water",
  type: "fill",
  source: "water",
  paint: {
    "fill-color": "red",
    "fill-outline-color": "black",
    "fill-opacity": 0.5,
  },
};

export default function Maptable() {
  const { isLoading, isFetching } = useGetMilitariesQuery(0);
  const MilitariesListdata = useAppSelector(selectMilitaries);
  const dispatch = useAppDispatch();
  const [popup, setpopup] = useState<{
    longitude: number;
    latitude: number;
    name: string;
    code: number;
    id: number;
    description: string | null;
    type_data: string;
    geometry: Geometry;
    centerPoint: {
      type: string;
      coordinates: number[];
    };
  } | null>(null);

  let map = MilitariesListdata?.list.map((x) => ({
    id: x.id,
    type: "Feature",
    properties: {
      name: x.name,
      code: x.code,
      id: x.id,
      description: x.description,
      type_data: x.type_data,
    },
    geometry: x.geometry,
  }));

  const openPopUpHandle = useCallback((e: MapLayerMouseEvent) => {
    const feature = e.features && e.features[0];
    if (feature?.properties) {
      setpopup({
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat,
        name: feature.properties.name,
        description: feature.properties.description,
        geometry: feature.geometry,
        code: feature.properties.code,
        id: feature.properties.id,
        centerPoint: feature.properties.centerPoint,
        type_data: feature.properties.type_data,
      });
    }
  }, []);

  if (isLoading || isFetching)
    return <Spinner animation="border" variant="success" />;

  return (
    <Map
      mapboxAccessToken="pk.eyJ1Ijoic3RlcGFua3V6bWluIiwiYSI6Ik1ieW5udm8ifQ.25EOEC2-N92NCWT0Ci9w-Q"
      initialViewState={{
        longitude: 107,
        latitude: 20.5,
        zoom: 8,
      }}
      onClick={openPopUpHandle}
      interactiveLayerIds={["water"]}
      style={{ width: "100%", height: "100%" }}
      mapStyle="https://tiles.skymapglobal.vn/styles/basic/style.json"
    >
      <FullscreenControl position="bottom-right" />
      <NavigationControl position="bottom-right" />
      <ScaleControl position="bottom-right" />
      <GeolocateControl position="bottom-right" />
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
          <div style={{ margin: "1rem" }}>
            <p>id: {popup.id}</p>
            <p>Tên: {popup.name}</p>
            <p>Code: {popup.code}</p>
            <p>Miêu tả: {popup.description || "Không có"}</p>
            <p>Loại dữ liệu: {popup.type_data}</p>
            <p>Hành Động:</p>
            <div style={{ marginTop: "5px" }}>
              <Button
                variant="success"
                className="me-1"
                onClick={() => {
                  dispatch(
                    setSelectMilitaries({
                      code: popup.code.toString(),
                      description: popup.description,
                      geometry: popup.geometry,
                      id: popup.id,
                      name: popup.name,
                      type_data: popup.type_data,
                    } as IMilitariesData)
                  );
                  openEditModal();
                }}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                className="ms-1"
                onClick={() => {
                  dispatch(
                    setSelectMilitaries({
                      code: popup.code.toString(),
                      description: popup.description,
                      geometry: popup.geometry,
                      id: popup.id,
                      name: popup.name,
                      type_data: popup.type_data,
                    } as IMilitariesData)
                  );
                  openDeleteModal();
                }}
              >
                delete
              </Button>
            </div>
          </div>
        </Popup>
      )}
    </Map>
  );
}
