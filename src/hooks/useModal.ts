import { useSearchParams } from "react-router-dom";

export function useModal() {
  const [params, setParams] = useSearchParams();

  function change(update: (next: URLSearchParams) => void) {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        update(next);
        return next;
      },
      { replace: true },
    );
  }

  return {
    addOpen: params.has("add"),
    detailId: params.get("sub"),
    closeAdd: () => change((next) => next.delete("add")),
    openDetail: (id: string) => change((next) => next.set("sub", id)),
    closeDetail: () => change((next) => next.delete("sub")),
  };
}
