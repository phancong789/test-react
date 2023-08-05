const hostName = "https://gtvtqs.samcom.com.vn/";

let getMilitariesParams = new URLSearchParams({
  showGeometry: "true",
  paginate: "true",
  page: "1",
  itemsPerPage: "5",
  search: "",
  sort: "",
});

let apiRoute = {
  militaries: "api/militaries",
  login: "api/web-authenticate",
  logout: "api/logout",
  addNew: "api/layers/75/features",
  update: "api/layers/75/features/",
  delete: "api/layers/75/features/",
  me: "api/me",
};

export { hostName, apiRoute, getMilitariesParams };
