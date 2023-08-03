export default interface Specie {
  id: string;
  attachments: [
    {
      path: string;
      ten: string;
    }
  ];
  loai_hien_trang: { code: string; ten: string };
  ten: string;
  kingdom: { ten: string };
  phylumn: { ten: string };
  ten_khoa_hoc: string;
  sach_dos: [
    {
      mo_ta: string;
      ma_danh_muc: string;
      pivot: {
        nam: number;
      };
    }
  ];
  iucns: [
    {
      mo_ta: string;
      ma_danh_muc: string;
      pivot: {
        nam: number;
      };
    }
  ];
}
