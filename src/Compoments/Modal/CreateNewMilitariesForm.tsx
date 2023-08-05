import React, { useCallback, useEffect, useRef, useState } from "react";
import Map, {
  Source,
  Layer,
  NavigationControl,
  FillLayer,
  FullscreenControl,
} from "react-map-gl";
import { Button, Form, InputGroup } from "react-bootstrap";
import { styled } from "styled-components";
import { Feature, FeatureCollection } from "geojson";
import CloseIcon from "mdi-react/CloseIcon";
import {
  useGetMilitariesQuery,
  useAddNewMilitariesMutation,
} from "../../Services/MilitariesApi";
import { toast } from "react-toastify";
import IError from "../../Interface/IError";
import DrawControl from "../draw-control";

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

const openCreateNewModal = () => {
  document.querySelector<HTMLDialogElement>(".addNew-modal")?.showModal();
};

export default function CreateNewMilitariesForm() {
  const [errorData, setErrorData] = useState<IError | null>(null);
  const [validated, setValidated] = useState(false);
  const [features, setFeatures] = useState<any>();
  const [FeatureCollection, setFeatureCollection] = useState<FeatureCollection>(
    { features: [], type: "FeatureCollection" }
  );
  const { refetch } = useGetMilitariesQuery(0);
  const [submit] = useAddNewMilitariesMutation();
  const drawRef = useRef<MapboxDraw>();
  const geoJsonData = useRef<FeatureCollection>();

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
      try {
        await submit(formDataObj).unwrap();
        toast.success("thêm dữ liệu thành công");
        refetch();
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
  }, []);

  const FileHandle = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      if (reader.result)
        geoJsonData.current = JSON.parse(
          reader.result as string
        ) as FeatureCollection;
    };
  };

  const DrawHanlde = () => {
    if (geoJsonData.current) setFeatureCollection(geoJsonData.current);
  };

  const CloseForm = () => {
    const parent = document.querySelector<HTMLDialogElement>(".addNew-modal");
    parent?.close();
    parent?.querySelector<HTMLFormElement>("form")?.reset();
    setFeatureCollection({ features: [], type: "FeatureCollection" });
    drawRef.current?.deleteAll();
  };

  useEffect(() => {
    setTimeout(() => {
      drawRef.current?.add(FeatureCollection);
      setFeatures(FeatureCollection.features);
    }, 1000);
  }, [FeatureCollection]);

  return (
    <Dialog className="addNew-modal">
      <Form
        noValidate
        style={{ overflow: "auto" }}
        validated={validated}
        onSubmit={handleSubmit}
      >
        <div className="d-flex p-3 mb-2 justify-content-between text-light bg-success">
          <h5 className="pt-2 pb-2 ps-2 m-0">Thêm mới</h5>
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
            <Map
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

export { openCreateNewModal };
