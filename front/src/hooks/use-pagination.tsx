import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

const usePagination = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageQuery = searchParams.get("page");
  const sortQuery = searchParams.get("sort");

  function setQuery(params: Array<{ field: string; value: string }>) {
    const newParams = new URLSearchParams(searchParams);
    params.forEach((i) => {
      newParams.set(i.field, i.value);
    });
    setSearchParams(newParams);
  }

  function parseJson<T>(data: string | null): T | null {
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  const page = useMemo(() => Number(pageQuery) || 1, [pageQuery]);
  const sort: [string, string] | null = useMemo(
    () => parseJson<[string, string]>(sortQuery),
    [sortQuery],
  );

  return {
    page,
    sort,
    setQuery,
  };
};

export default usePagination;
