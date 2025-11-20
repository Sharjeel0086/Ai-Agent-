import { format } from "date-fns";

export interface Message {
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export function exportChatAsText(messages: Message[], title: string): string {
  let text = `Chat: ${title}\n`;
  text += `Exported: ${format(new Date(), "PPpp")}\n`;
  text += "=".repeat(50) + "\n\n";

  messages.forEach((message) => {
    const role = message.role === "user" ? "You" : "AI";
    const date = message.created_at
      ? format(new Date(message.created_at), "PPp")
      : "";
    text += `[${date}] ${role}:\n${message.content}\n\n`;
  });

  return text;
}

export function exportChatAsJSON(messages: Message[], title: string): string {
  return JSON.stringify(
    {
      title,
      exportedAt: new Date().toISOString(),
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.created_at,
      })),
    },
    null,
 2
  );
}

export function exportChatAsMarkdown(messages: Message[], title: string): string {
  let md = `# ${title}\n\n`;
  md += `*Exported: ${format(new Date(), "PPpp")}*\n\n`;
  md += "---\n\n";

  messages.forEach((message) => {
    const role = message.role === "user" ? "**You**" : "**AI**";
    md += `${role}\n\n${message.content}\n\n---\n\n`;
  });

  return md;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

