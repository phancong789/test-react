export default interface IError {
  data: {
    errors?: {
      password?: string[];
      email?: string[];
      name?: string[];
      mobile?: string[];
      role_ids?: string[];
      username?: string[];
    };
    message: string;
    status_code: number;
  };
}
