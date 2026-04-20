"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Table } from "lucide-react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export type SerializedUser = {
  id: string;
  imageUrl: string;
  fullName: string | null;
  email: string | undefined;
  isAdmin: boolean;
  joined: string;
};

export default function ExportUsersDialog({
  users,
}: {
  users: SerializedUser[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExportExcel = () => {
    // Generate CSV which opens natively in Excel
    const headers = ["ID", "Full Name", "Email", "Joined", "Is Admin"];
    const rows = users.map((u) => [
      u.id,
      `"${(u.fullName || "N/A").replace(/"/g, '""')}"`,
      `"${(u.email || "N/A").replace(/"/g, '""')}"`,
      `"${u.joined}"`,
      u.isAdmin ? '"Yes"' : '"No"',
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "UsersExport.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  const handleExportPDF = () => {
    // Open a print window to save as PDF
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Users Export</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; color: #333; }
            h2 { margin-bottom: 4px; }
            p { color: #666; margin-top: 0; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
            th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
            th { background-color: #f8fafc; font-weight: 600; color: #0f172a; }
            tr:nth-child(even) { background-color: #f8fafc; }
          </style>
        </head>
        <body>
          <h2>Registered Users</h2>
          <p>Exported on: ${new Date().toLocaleDateString()} &middot; Total Resgistered: ${users.length}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              ${users
                .map(
                  (u) => `
                <tr>
                  <td>${u.id}</td>
                  <td>${u.fullName || "N/A"}</td>
                  <td>${u.email || "N/A"}</td>
                  <td>${u.joined}</td>
                  <td>${u.isAdmin ? "Yes" : "No"}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Download className="w-4 h-4" />
        Export Users
      </Button>

      {mounted &&
        typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  key="export-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                  key="export-modal"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="fixed inset-0 z-101 flex items-center justify-center pointer-events-none px-4"
                >
                  <div
                    className="pointer-events-auto w-full max-w-md bg-background rounded-lg p-6 shadow-xl border border-border"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
                      <h2 className="text-lg font-bold tracking-tight">
                        Export Users Data
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Choose the format to export {users.length} users.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center h-24 gap-3 bg-green-50/50 hover:bg-green-100/50 hover:text-green-900 border-green-200"
                        onClick={handleExportExcel}
                      >
                        <Table className="w-8 h-8 text-green-600" />
                        <span>Excel (.csv)</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center h-24 gap-3 bg-red-50/50 hover:bg-red-100/50 hover:text-red-900 border-red-200"
                        onClick={handleExportPDF}
                      >
                        <FileText className="w-8 h-8 text-red-600" />
                        <span>PDF Document</span>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
