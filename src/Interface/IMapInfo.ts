export default interface IMapInfo {
  center_point: { type: string; coordinates: number[] };
  full_name: string;
  id: number;
  code: string;
  geometry: { type: string; coordinates: number[][][] };
  name: string;
  type_data: string;
}
