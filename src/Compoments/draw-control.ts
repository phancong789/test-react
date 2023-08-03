import react from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useControl } from "react-map-gl";

import type { MapRef, ControlPosition } from "react-map-gl";

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition;

  onCreate?: (evt: { features: object[] }) => void;
  onUpdate?: (evt: { features: object[]; action: string }) => void;
  onDelete?: (evt: { features: object[] }) => void;
  onModeChange?: (e: any) => void;
};

const DrawControl = react.forwardRef((props: DrawControlProps, ref) => {
  let drawRef = useControl<MapboxDraw>(
    () => new MapboxDraw(props),
    ({ map }: { map: MapRef }) => {
      if (props.onCreate) map.on("draw.create", props.onCreate);
      if (props.onUpdate) map.on("draw.update", props.onUpdate);
      if (props.onDelete) map.on("draw.delete", props.onDelete);
      if (props.onModeChange) map.on("draw.modechange", props.onModeChange);
    },
    ({ map }: { map: MapRef }) => {
      map.off("draw.create", props.onCreate);
      map.off("draw.update", props.onUpdate);
      map.off("draw.delete", props.onDelete);
      if (props.onModeChange) map.on("draw.modechange", props.onModeChange);
      return drawRef;
    },
    {
      position: props.position,
    }
  );
  react.useImperativeHandle(ref, () => drawRef, [drawRef]); // This way I exposed drawRef outside the component

  return null;
});

export default DrawControl;
