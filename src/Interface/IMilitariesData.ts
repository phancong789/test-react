import { Geometry } from "geojson";

export default interface IMilitariesData {
  code: string;
  description: string | null;
  geometry: Geometry;
  id: number;
  name: string;
  type_data: string;
}
