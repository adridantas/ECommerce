import { api } from "@/lib/axios";

export async function uploadOrderAttachment(
  orderId: number,
  file: File,
  type: "NOTA_FISCAL"
) {
  const formData = new FormData();
  formData.append("file", file);  
  formData.append("type", type);

  const res = await api.post(`/admin/orders/${orderId}/attachments`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

export async function fetchOrderAttachments(orderId: number) {
  const res = await api.get(`/admin/orders/${orderId}/attachments`);
  return res.data; // lista de OrderAttachmentDTO
}
