"use client";

import { useEffect, useState } from "react";
import { fetchOrderAttachments, uploadOrderAttachment } from "@/services/orderAttachments";

function OrderAttachmentsList({ orderId, canUpload }: { orderId: number; canUpload: boolean }) {
  const [attachments, setAttachments] = useState<any[]>([]);

  useEffect(() => {
    fetchOrderAttachments(orderId)
      .then((res) => {
        setAttachments(res);
      })
      .catch((err) => console.error("ERRO:", err));
  }, [orderId]);

  return (
    <div className="mt-2 pt-2 border-t text-sm">
      <span className="font-semibold block mb-1">Anexos:</span>
      {attachments.length === 0 ? (
        <span className="text-red-500">Nenhum anexo encontrado.</span>
      ) : (
        <ul className="list-disc pl-4">
          {attachments.map((att) => (
            <li key={att.id}>
              <a
                href={att.fileUrl}
                target="_blank"
                style={{ color: "lime", textDecoration: "underline" }}
              >
                {att.fileName} ({att.type})
              </a>
            </li>
          ))}
        </ul>
      )}
      {canUpload && (
        <form
          className="mt-2"
          onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const fileInput = e.currentTarget.elements.namedItem("attachment") as HTMLInputElement;
            const file = fileInput.files?.[0];

            if (!file) {
              alert("Selecione um arquivo antes de enviar");
              return;
            }
            if (file.type !== "application/pdf") {
              alert("Somente arquivos PDF são permitidos");
              return;
            }

            try {
              await uploadOrderAttachment(orderId, file, "NOTA_FISCAL"); // tipo pode ser NOTA_FISCAL, COMPROVANTE etc.

              const updated = await fetchOrderAttachments(orderId);
              setAttachments(updated);

              fileInput.value = ""; 
            } catch (err) {
              console.error("Erro ao enviar anexo:", err);
            }
          }}
        >
          <input
            type="file"
            name="attachment"
            accept="application/pdf"

          />

          <button
            type="submit"
            className="ml-2 px-2 py-1 bg-blue-600 text-white rounded"
          >
            Adicionar Anexo
          </button>
        </form>
      )}

    </div>
  );
}

export default OrderAttachmentsList;
