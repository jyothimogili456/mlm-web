// import React, { useState } from "react";
// import { Mail, MessageCircle, ChevronDown, ChevronUp, Paperclip, Send } from "react-feather";
// import "./SupportPanel.css";

// type Ticket = {
//   id: string;
//   subject: string;
//   date: string;
//   status: string;
//   message: string;
//   response: string;
//   file: File | null;
// };

// const initialTickets: Ticket[] = [
//   { id: "TCKT001", subject: "Order not delivered", date: "2024-05-01", status: "Open", message: "My order has not arrived yet.", response: "We are checking with the courier.", file: null },
//   { id: "TCKT002", subject: "Wallet balance not updated", date: "2024-04-28", status: "Resolved", message: "Wallet not credited after purchase.", response: "Resolved. Amount credited.", file: null },
//   { id: "TCKT003", subject: "App bug", date: "2024-04-25", status: "In Progress", message: "App crashes on checkout.", response: "Our team is investigating.", file: null },
// ];

// const statusColors: Record<string, string> = {
//   Open: "open",
//   Resolved: "resolved",
//   "In Progress": "progress",
// };

// export default function SupportPanel() {
//   const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
//   const [form, setForm] = useState({ subject: "", message: "", file: null as File | null });
//   const [expanded, setExpanded] = useState<string | null>(null);
//   const [reply, setReply] = useState("");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value, files } = e.target as HTMLInputElement;
//     setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!form.subject || !form.message) return;
//     setTickets([
//       {
//         id: `TCKT${tickets.length + 1}`.padStart(7, "0"),
//         subject: form.subject,
//         date: new Date().toISOString().slice(0, 10),
//         status: "Open",
//         message: form.message,
//         response: "",
//         file: form.file,
//       },
//       ...tickets,
//     ]);
//     setForm({ subject: "", message: "", file: null });
//   };

//   const toggleExpand = (id: string) => {
//     setExpanded(expanded === id ? null : id);
//     setReply("");
//   };

//   const handleReply = (id: string) => {
//     if (!reply.trim()) return;
//     setTickets(tickets.map(t => t.id === id ? { ...t, response: reply, status: "Resolved" } : t));
//     setReply("");
//   };

//   return (
//     <div className="support-dashboard-panel">
//       <div className="support-header"><Mail size={22} /> Customer Support</div>
//       <div className="support-table-section">
//         <table className="support-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Subject</th>
//               <th>Date</th>
//               <th>Status</th>
//               <th>Details</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tickets.map((t) => (
//               <React.Fragment key={t.id}>
//                 <tr className="support-table-row">
//                   <td>{t.id}</td>
//                   <td>{t.subject}</td>
//                   <td>{t.date}</td>
//                   <td><span className={`support-status-tag support-status-${statusColors[t.status]}`}>{t.status}</span></td>
//                   <td>
//                     <button className="support-details-btn" onClick={() => toggleExpand(t.id)}>
//                       {expanded === t.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />} Details
//                     </button>
//                   </td>
//                 </tr>
//                 {expanded === t.id && (
//                   <tr className="support-details-row">
//                     <td colSpan={5}>
//                       <div className="support-details-panel">
//                         <div className="support-details-title"><MessageCircle size={16} /> Ticket Details</div>
//                         <div className="support-details-field"><b>Subject:</b> {t.subject}</div>
//                         <div className="support-details-field"><b>Message:</b> {t.message}</div>
//                         {t.file && t.file instanceof File && (
//                           <div className="support-details-field">
//                             <b>Attachment:</b> <a href={URL.createObjectURL(t.file)} download={t.file.name} target="_blank" rel="noopener noreferrer" className="support-file-link"><Paperclip size={14} /> {t.file.name}</a>
//                           </div>
//                         )}
//                         <div className="support-details-field"><b>Response:</b> {t.response || <span className="support-no-response">No response yet.</span>}</div>
//                         <div className="support-reply-row">
//                           <input
//                             className="support-reply-input"
//                             placeholder="Type your reply..."
//                             value={reply}
//                             onChange={e => setReply(e.target.value)}
//                           />
//                           <button className="support-reply-btn" onClick={() => handleReply(t.id)} type="button"><Send size={16} /> Reply</button>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             ))}
//             {tickets.length === 0 && (
//               <tr><td colSpan={5} className="support-empty">No tickets found.</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       <div className="support-divider" />
//       <form className="support-form" onSubmit={handleSubmit}>
//         <div className="support-form-title"><MessageCircle size={18} /> Raise a New Ticket</div>
//         <div className="support-form-fields">
//           <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="support-input" required />
//           <textarea name="message" value={form.message} onChange={handleChange} placeholder="Describe your issue" className="support-textarea" required />
//           <input type="file" name="file" onChange={handleChange} className="support-file" />
//         </div>
//         <button type="submit" className="support-submit">Create Ticket</button>
//       </form>
//     </div>
//   );
// } 
import React from "react";
import { Mail } from "react-feather";
import "./SupportPanel.css"; // Optional: for styles

export default function SupportPanel() {
  const supportEmail = "camelq.in"; 

  return (
    <div className="support-dashboard-panel">
      <div className="support-header">
        <Mail size={22} /> Customer Support
      </div>

      <div className="support-message">
        <p>If you have any queries, feel free to reach out to us via email.</p>
        <button
          className="support-email-btn"
          onClick={() => {
            window.location.href = `mailto:${supportEmail}?subject=Support Query&body=Hi Support Team,`;
          }}
        >
          Contact Us
        </button>
      </div>
    </div>
  );
}
