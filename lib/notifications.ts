import type { LeadRecord } from "../db/leads";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  }[character] || character));
}

export async function sendLeadNotification(lead: LeadRecord) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.OPS_NOTIFICATION_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL;
  if (!apiKey || !to || !from) return false;

  const details = Object.entries(lead)
    .filter(([, value]) => value !== undefined && value !== "" && value !== false)
    .map(([key, value]) => `<tr><th style="text-align:left;padding:8px 12px;border-bottom:1px solid #ddd">${escapeHtml(key)}</th><td style="padding:8px 12px;border-bottom:1px solid #ddd">${escapeHtml(Array.isArray(value) ? value.join(", ") : String(value))}</td></tr>`)
    .join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: lead.email,
      subject: `New Altaie ${lead.kind} request from ${lead.contactName}`,
      html: `<div style="font-family:Arial,sans-serif;color:#12171c"><h1 style="font-size:24px">New ${escapeHtml(lead.kind)} request</h1><table style="border-collapse:collapse;width:100%">${details}</table></div>`,
    }),
  });

  return response.ok;
}
