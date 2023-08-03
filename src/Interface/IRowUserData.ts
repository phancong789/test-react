export default interface IRowUserData {
  avatar_url?: string;
  email: string;
  id: string;
  gender: number;
  inactive: boolean;
  mobile: string;
  name: string;
  role_id: number;
  username: string;
  khubaoton: [
    {
      id: number;
      ten: string;
      user_id: string;
      nbds_khu_bao_ton_id: number;
      loai_khu: string;
    }
  ];
  provinces: [
    {
      center_point: { type: string; coordinates: [number] };
      id: number;
      name: string;
      full_name: string;
      pivot: { province_id: number; user_id: number };
      code: string;
      type: string;
      type_data: string;
    }
  ];
  role: {
    code: string;
    name: string;
    id: number;
    meta: {
      color: string;
      "text-color": string;
    };
  };
  roles: [
    {
      id: number;
      code: string;
      name: string;
      meta: {
        color: string;
        "text-color": string;
      };
    }
  ];
  created_at: string;
}
