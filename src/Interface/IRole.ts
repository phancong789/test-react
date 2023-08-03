export default interface IRole {
  code: string;
  id: number;
  meta: {
    color: string;
    "text-color": string;
  };
  name: string;
}
