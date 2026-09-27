import { AddSheet } from "@/components/subscription/AddSheet";
import { DetailSheet } from "@/components/subscription/DetailSheet";
import { useModal } from "@/hooks/useModal";

export function ModalHost() {
  const { addOpen, detailId, closeAdd, closeDetail } = useModal();

  return (
    <>
      <AddSheet open={addOpen} onClose={closeAdd} />
      {detailId && <DetailSheet key={detailId} id={detailId} onClose={closeDetail} />}
    </>
  );
}
