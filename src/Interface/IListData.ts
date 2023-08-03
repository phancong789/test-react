export default interface IListData<T> {
  list: T;
  pagination: {
    count: number;
    hasMoreItems: boolean;
    page: number;
    total: number;
    itemsPerPage: number;
  };
}
