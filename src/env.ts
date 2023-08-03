const hostName = "https://gtvtqs.samcom.com.vn/";

let getProvinParams = new URLSearchParams({
  showGeometry: "true",
  paginate: "true",
  page: "1",
  perpage: "18",
});

let getMilitariesParams = new URLSearchParams({
  paginate: "true",
  page: "1",
  perpage: "3",
  search: "",
  sort: "name",
});

let apiRoute = {
  militaries: "api/militaries",
  login: "api/web-authenticate",
  logout: "api/logout",
  addNew: "api/layers/75/features",
  me: "api/me",
};

export { hostName, apiRoute, getProvinParams };
