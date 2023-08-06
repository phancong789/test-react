import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Map, {
  Source,
  Layer,
  NavigationControl,
  FillLayer,
  FullscreenControl,
  MapRef,
} from "react-map-gl";
import { Button, Form, InputGroup } from "react-bootstrap";
import { styled } from "styled-components";
import { Feature, FeatureCollection, Point } from "geojson";
import CloseIcon from "mdi-react/CloseIcon";
import {
  useGetMilitariesQuery,
  useUpdateMilitariesMutation,
} from "../../Services/MilitariesApi";
import { toast } from "react-toastify";
import IError from "../../Interface/IError";
import DrawControl from "../Control/DrawControl";
import { useAppDispatch, useAppSelector } from "../../CustomHook/hook";
import {
  removeSelectMilitaries,
  selectSelectedMilitaries,
} from "../../Features/MilitariesSlice";
///@ts-ignore
import center from "@turf/center";

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
  background-color: white;
  color: black;
  &::backdrop {
    background-color: #00000078;
  }
`;

const openEditModal = () => {
  document.querySelector<HTMLDialogElement>(".editUser-modal")?.showModal();
};

export default function EditMilitariesForm() {
  const [errorData, setErrorData] = useState<IError | null>(null);
  const [validated, setValidated] = useState(false);
  const [features, setFeatures] = useState<any>();
  const [FeatureCollection, setFeatureCollection] = useState<FeatureCollection>(
    { features: [], type: "FeatureCollection" }
  );
  const { refetch } = useGetMilitariesQuery(0);
  const [submit] = useUpdateMilitariesMutation();
  const selectmilitaries = useAppSelector(selectSelectedMilitaries);
  const dispatch = useAppDispatch();
  const drawRef = useRef<MapboxDraw>();
  const mapRef = useRef<MapRef>(null);
  const geoJsonData = useRef<FeatureCollection>();
  const [centerPoint, setCenterPoint] = useState<Feature<Point>>();

  const layerStyle: FillLayer = useMemo(
    () => ({
      id: "water",
      type: "fill",
      source: "water",
      paint: {
        "fill-color": "red",
        "fill-outline-color": "black",
        "fill-opacity": 0.5,
      },
    }),
    []
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      let formdata = new FormData(form);
      let formDataObj: any = {};
      let Geometry: { coordinates: any[]; type: string } = {
        coordinates: [],
        type: "",
      };
      for (const property in features) {
        Geometry.coordinates = Geometry.coordinates.concat(
          features[property].geometry.coordinates
        );
        Geometry.type = features[property].geometry.type;
      }
      formdata.forEach((data, key) => {
        formDataObj[key] = data;
      });
      formDataObj["geometry"] = Geometry;
      formDataObj["id"] = selectmilitaries?.id;
      try {
        await submit(formDataObj).unwrap();
        await refetch();
        toast.success("Cập nhật dữ liệu thành công");
        CloseForm();
      } catch (err) {
        setErrorData(err as IError);
      }
      setValidated(true);
    }
  };

  useEffect(() => {
    toast.error(errorData?.data.message);
  }, [errorData]);

  const onUpdate = useCallback(
    (e: { features: Feature[] } | { features: Feature[]; action: string }) => {
      ///@ts-ignore
      setFeatures((currFeatures) => {
        const newFeatures = { ...currFeatures };
        for (const f of e.features) {
          if (f.id) newFeatures[f.id] = f;
        }
        return newFeatures;
      });
    },
    []
  );

  const onDelete = useCallback((e: { features: Feature[] }) => {
    ///@ts-ignore
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        if (f.id) delete newFeatures[f.id];
      }
      return newFeatures;
    });

    setFeatureCollection((preState) => ({
      type: preState.type,
      features: preState.features.filter(({ id }) => {
        for (const f of e.features) {
          return id !== f.id;
        }
      }),
    }));
  }, []);

  const FileHandle = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      if (reader.result)
        setFeatureCollection(
          JSON.parse(reader.result as string) as FeatureCollection
        );
    };
  };

  const DrawHanlde = () => {
    if (geoJsonData.current) setFeatureCollection(geoJsonData.current);
  };

  const CloseForm = () => {
    const parent = document.querySelector<HTMLDialogElement>(".editUser-modal");
    parent?.close();
    parent?.querySelector<HTMLFormElement>("form")?.reset();
    setFeatureCollection({ features: [], type: "FeatureCollection" });
    dispatch(removeSelectMilitaries());
    drawRef.current?.deleteAll();
  };

  useEffect(() => {
    if (selectmilitaries) {
      setFeatureCollection((preState) => ({
        type: preState.type,
        features: preState.features.concat({
          type: "Feature",
          id: selectmilitaries.id,
          properties: {},
          geometry: selectmilitaries.geometry,
        }),
      }));

      setCenterPoint(center(selectmilitaries?.geometry));
    }
  }, [selectmilitaries]);

  useEffect(() => {
    setTimeout(() => {
      if (centerPoint?.geometry.coordinates)
        mapRef.current?.flyTo({
          center: [
            centerPoint?.geometry.coordinates[0],
            centerPoint?.geometry.coordinates[1],
          ],
        });
    }, 500);
  }, [centerPoint]);

  useEffect(() => {
    setTimeout(() => {
      drawRef.current?.add(FeatureCollection);
      setFeatures((currFeatures: any) => {
        const newFeatures = { ...currFeatures };
        for (const f of FeatureCollection.features) {
          if (f.id) newFeatures[f.id] = f;
        }
        return newFeatures;
      });
    }, 1000);
  }, [FeatureCollection]);

  return (
    <Dialog className="editUser-modal">
      <Form
        noValidate
        style={{ overflow: "auto" }}
        validated={validated}
        onSubmit={handleSubmit}
      >
        <div className="d-flex p-3 mb-2 justify-content-between text-light bg-success">
          <h5 className="pt-2 pb-2 ps-2 m-0">Cập nhật</h5>
          <Button onClick={CloseForm} variant="none" className="p-1 m-1">
            <CloseIcon color="#fff" />
          </Button>
        </div>
        <div className="m-2">
          <Form.Group className="mt-3 mb-3 ms-4 me-4" controlId="nameGroup">
            <Form.Label>Tên</Form.Label>
            <Form.Control
              placeholder="vui lòng điền tên bạn mong muốn"
              type="text"
              defaultValue={selectmilitaries?.name}
              className={errorData?.data.errors?.name ? "border-danger" : ""}
              name="name"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorData?.data.errors?.name
                ? errorData?.data.errors?.name[0]
                : "Trường tên không được bỏ trống."}
            </Form.Control.Feedback>
            <Form.Control.Feedback type="valid" className="text-danger">
              {errorData?.data.errors?.name
                ? errorData?.data.errors?.name[0]
                : ""}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mt-3 mb-3 ms-4 me-4" controlId="usernameGroup">
            <Form.Label>Mã</Form.Label>
            <Form.Control
              placeholder="vui lòng điền Mã"
              type="number"
              defaultValue={selectmilitaries?.code}
              className={
                errorData?.data.errors?.username ? "border-danger" : ""
              }
              name="code"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorData?.data.errors?.username
                ? errorData?.data.errors?.username[0]
                : "Trường Mã không được bỏ trống."}
            </Form.Control.Feedback>
            <Form.Control.Feedback type="valid" className="text-danger">
              {errorData?.data.errors?.username
                ? errorData?.data.errors?.username[0]
                : ""}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mt-3 mb-3 ms-4 me-4" controlId="EmailGroup">
            <Form.Label>Miêu tả</Form.Label>
            <Form.Control
              placeholder="vui lòng điền Miêu tả"
              type="text"
              defaultValue={
                selectmilitaries?.description
                  ? selectmilitaries.description
                  : undefined
              }
              className={errorData?.data.errors?.email ? "border-danger" : ""}
              name="description"
            />
            <Form.Control.Feedback type="invalid">
              {errorData?.data.errors?.email
                ? errorData?.data.errors?.email[0]
                : "Trường Miêu tả không được bỏ trống."}
            </Form.Control.Feedback>
            <Form.Control.Feedback type="valid" className="text-danger">
              {errorData?.data.errors?.email
                ? errorData?.data.errors?.email[0]
                : ""}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mt-3 mb-3 ms-4 me-4" controlId="EmailGroup">
            <Form.Label>file Geojosn</Form.Label>
            <InputGroup>
              <Form.Control
                placeholder="vui lòng điền Email bạn mong muốn"
                type="file"
                onChange={FileHandle}
                className={errorData?.data.errors?.email ? "border-danger" : ""}
              />
              <Button onClick={DrawHanlde}>Vẽ</Button>
            </InputGroup>
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
          <div className="mt-3 mb-3 ms-4 me-4" style={{ height: "21rem" }}>
            {centerPoint?.geometry.coordinates && (
              <Map
                ref={mapRef}
                mapboxAccessToken="pk.eyJ1Ijoic3RlcGFua3V6bWluIiwiYSI6Ik1ieW5udm8ifQ.25EOEC2-N92NCWT0Ci9w-Q"
                initialViewState={{
                  longitude: 106,
                  latitude: 21,
                  zoom: 7,
                }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                mapStyle="https://tiles.skymapglobal.vn/styles/basic/style.json"
              >
                <FullscreenControl position="bottom-right" />
                <NavigationControl position="top-left" />
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
                  onCreate={onUpdate}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
                <Source id="my-data" type="geojson" data={FeatureCollection}>
                  <Layer {...layerStyle} />
                </Source>
              </Map>
            )}
          </div>
          <div className="m-3 d-flex justify-content-end">
            <Button
              onClick={CloseForm}
              className="me-2"
              variant="light"
              type="button"
            >
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

export { openEditModal };
