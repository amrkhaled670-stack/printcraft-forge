import { createServerFn } from "@tanstack/react-start";

const ADMIN_EMAIL = "Amrkhaled670@gmail.com";
const VODAFONE_NUMBER = "01069198397";

interface OrderEmailInput {
  orderId: string;
  customerEmail: string;
  customerName: string;
  total: number;
  currency: string;
  items: Array<{ name: string; qty: number; unit: number }>;
}

export const sendOrderEmails = createServerFn({ method: "POST" })
  .inputValidator((data: OrderEmailInput) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[order-email] RESEND_API_KEY not set — skipping email dispatch");
      return { sent: false, reason: "no_api_key" as const };
    }

    const itemsHtml = data.items
      .map(
        (i) =>
          `<tr><td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml(i.name)}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right">${i.unit.toFixed(2)} ${escapeHtml(data.currency)}</td></tr>`,
      )
      .join("");

    const customerHtml = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto;color:#0f172a">
        <h2 style="color:#06b6d4">Print Forge — Order Confirmation</h2>
        <p>مرحباً ${escapeHtml(data.customerName || "")},</p>
        <p>شكراً لطلبك من Print Forge. رقم الطلب: <strong>${escapeHtml(data.orderId)}</strong></p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead><tr style="background:#f1f5f9"><th style="padding:8px;text-align:left">Model</th><th style="padding:8px">Qty</th><th style="padding:8px;text-align:right">Price</th></tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p style="font-size:16px"><strong>Total:</strong> ${data.total.toFixed(2)} ${escapeHtml(data.currency)}</p>
        <div style="margin-top:24px;padding:16px;background:#ecfeff;border:1px solid #a5f3fc;border-radius:8px">
          <h3 style="margin:0 0 8px;color:#0e7490">تعليمات الدفع — Vodafone Cash</h3>
          <p style="margin:0">يرجى تحويل المبلغ الإجمالي عبر <strong>Vodafone Cash</strong> إلى الرقم التالي:</p>
          <p style="font-size:20px;font-weight:700;margin:8px 0;letter-spacing:1px">${VODAFONE_NUMBER}</p>
          <p style="margin:0;font-size:13px;color:#155e75">بعد التحويل، احتفظ بصورة الإيصال لأي استفسار.</p>
        </div>
        <p style="margin-top:24px;font-size:13px;color:#64748b">Print Forge — أفضل خدمة طباعة 3D في مصر</p>
      </div>
    `;

    const adminHtml = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto">
        <h2>New Print Forge Order</h2>
        <p><strong>Order ID:</strong> ${escapeHtml(data.orderId)}</p>
        <p><strong>Customer:</strong> ${escapeHtml(data.customerName)} &lt;${escapeHtml(data.customerEmail)}&gt;</p>
        <p><strong>Total:</strong> ${data.total.toFixed(2)} ${escapeHtml(data.currency)}</p>
        <table style="width:100%;border-collapse:collapse;margin-top:12px">
          <thead><tr style="background:#f1f5f9"><th style="padding:8px;text-align:left">Model</th><th style="padding:8px">Qty</th><th style="padding:8px;text-align:right">Price</th></tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>
      </div>
    `;

    const from = process.env.RESEND_FROM ?? "Print Forge <onboarding@resend.dev>";

    const send = async (to: string, subject: string, html: string) => {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, subject, html }),
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error(`[order-email] Resend failed [${res.status}] to=${to}: ${txt}`);
      }
    };

    await Promise.all([
      data.customerEmail
        ? send(data.customerEmail, `Print Forge — تأكيد طلبك #${data.orderId.slice(0, 8)}`, customerHtml)
        : Promise.resolve(),
      send(ADMIN_EMAIL, `New order #${data.orderId.slice(0, 8)} — Print Forge`, adminHtml),
    ]);

    return { sent: true as const };
  });

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
