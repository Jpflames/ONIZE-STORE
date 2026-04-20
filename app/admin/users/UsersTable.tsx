"use client";

import { useState, useTransition } from "react";
import AdminUserRow from "./AdminUserRow";
import { deleteUsers } from "@/actions/admin.actions";
import { SerializedUser } from "./ExportUsersDialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function UsersTable({ users }: { users: SerializedUser[] }) {
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set(),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize mounted state for portals
  useState(() => {
    setMounted(true);
  });

  const usersPerPage = 25;
  const totalPages = Math.ceil(users.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + usersPerPage);

  const toggleUserSelection = (id: string, isAdmin: boolean) => {
    if (isAdmin) return; // Cannot select admin

    setSelectedUserIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleAllInPage = () => {
    const selectableUsers = paginatedUsers.filter((u) => !u.isAdmin);
    const allSelected = selectableUsers.every((u) => selectedUserIds.has(u.id));

    setSelectedUserIds((prev) => {
      const newSet = new Set(prev);
      if (allSelected) {
        // Deselect all on current page
        selectableUsers.forEach((u) => newSet.delete(u.id));
      } else {
        // Select all on current page
        selectableUsers.forEach((u) => newSet.add(u.id));
      }
      return newSet;
    });
  };

  const selectedCount = selectedUserIds.size;
  const pageSelectableUsersCount = paginatedUsers.filter(
    (u) => !u.isAdmin,
  ).length;
  const isAllPageSelected =
    pageSelectableUsersCount > 0 &&
    paginatedUsers
      .filter((u) => !u.isAdmin)
      .every((u) => selectedUserIds.has(u.id));

  const handleBulkDelete = () => {
    const idsToDelete = Array.from(selectedUserIds);
    if (idsToDelete.length === 0) return;

    startTransition(async () => {
      try {
        await deleteUsers(idsToDelete);
        toast.success(`Successfully deleted ${idsToDelete.length} users`);
        setSelectedUserIds(new Set());
        setIsDeleteModalOpen(false);
        // Adjust page if we deleted everyone on the last page
        const newTotalPages = Math.ceil(
          (users.length - idsToDelete.length) / usersPerPage,
        );
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      } catch (error) {
        toast.error("Failed to delete users");
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Table Header / Bulk Actions */}
      <div className="flex items-center justify-between p-4 border border-border bg-muted/10 rounded-t-lg">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isAllPageSelected}
            onChange={toggleAllInPage}
            disabled={pageSelectableUsersCount === 0 || isPending}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            title="Select all on this page"
          />
          <span className="text-sm font-medium text-muted-foreground">
            {selectedCount > 0
              ? `${selectedCount} selected`
              : "Select on this page"}
          </span>
        </div>

        {selectedCount > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isPending}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </Button>
        )}
      </div>

      <div className="border border-border divide-y divide-border -mt-4 border-t-0 rounded-b-lg overflow-hidden">
        {paginatedUsers.map((user) => (
          <div key={user.id} className="flex items-center px-4 w-full">
            <div className="py-4 pr-4">
              <input
                type="checkbox"
                checked={selectedUserIds.has(user.id)}
                onChange={() => toggleUserSelection(user.id, user.isAdmin)}
                disabled={user.isAdmin || isPending}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary disabled:opacity-50"
              />
            </div>
            <div className="flex-1">
              <AdminUserRow
                userId={user.id}
                imageUrl={user.imageUrl}
                fullName={user.fullName}
                email={user.email}
                isAdmin={user.isAdmin}
                joined={user.joined}
                hideBorder={true}
              />
            </div>
          </div>
        ))}

        {paginatedUsers.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No users found.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                // Show a limited number of pages logic
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1),
                )
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && page - array[index - 1] > 1 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </div>
                ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {mounted &&
        typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isDeleteModalOpen && (
              <>
                <motion.div
                  key="bulk-delete-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                  key="bulk-delete-modal"
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
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <h2 className="text-lg font-bold tracking-tight">
                        Delete {selectedCount} Users?
                      </h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                      This action cannot be undone. You are about to permanently
                      delete <strong>{selectedCount}</strong> user accounts and
                      all associated data from our servers.
                    </p>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteModalOpen(false)}
                        disabled={isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleBulkDelete}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
                      >
                        {isPending && (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        )}
                        Delete Selected
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
