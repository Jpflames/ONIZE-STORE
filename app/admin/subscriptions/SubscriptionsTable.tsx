"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { Mail, Trash2, AlertCircle } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { deleteSubscribers } from "@/actions/newsletter.actions";

export type SerializedSubscriber = {
  _id: string;
  email: string;
  subscribedAt: string;
};

export default function SubscriptionsTable({
  subscribers,
}: {
  subscribers: SerializedSubscriber[];
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize mounted state for portals
  useState(() => {
    setMounted(true);
  });

  const itemsPerPage = 25;
  const totalPages = Math.ceil(subscribers.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubscribers = subscribers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const toggleAllInPage = () => {
    const allSelected = paginatedSubscribers.every((s) =>
      selectedIds.has(s._id),
    );
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (allSelected) {
        paginatedSubscribers.forEach((s) => newSet.delete(s._id));
      } else {
        paginatedSubscribers.forEach((s) => newSet.add(s._id));
      }
      return newSet;
    });
  };

  const selectedCount = selectedIds.size;
  const pageSubscribersCount = paginatedSubscribers.length;
  const isAllPageSelected =
    pageSubscribersCount > 0 &&
    paginatedSubscribers.every((s) => selectedIds.has(s._id));

  const handleBulkDelete = () => {
    const idsToDelete = Array.from(selectedIds);
    if (idsToDelete.length === 0) return;

    startTransition(async () => {
      try {
        const result = await deleteSubscribers(idsToDelete);
        if (result.success) {
          toast.success(
            `Successfully deleted ${idsToDelete.length} subscribers`,
          );
          setSelectedIds(new Set());
          setIsDeleteModalOpen(false);
          const newTotalPages = Math.ceil(
            (subscribers.length - idsToDelete.length) / itemsPerPage,
          );
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          }
        } else {
          toast.error(result.error || "Failed to delete subscribers");
        }
      } catch (error) {
        toast.error("Failed to delete subscribers");
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
            disabled={pageSubscribersCount === 0 || isPending}
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
        {paginatedSubscribers.map((sub) => (
          <div
            key={sub._id}
            className="flex items-center px-4 w-full bg-background hover:bg-muted/20 hoverEffect"
          >
            <div className="py-4 pr-4">
              <input
                type="checkbox"
                checked={selectedIds.has(sub._id)}
                onChange={() => toggleSelection(sub._id)}
                disabled={isPending}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary disabled:opacity-50"
              />
            </div>
            <div className="flex-1 flex items-center gap-4 py-4 min-w-0">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                <Mail className="w-4 h-4 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-foreground">
                  {sub.email}
                </p>
              </div>

              <p className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                Subscribed {format(new Date(sub.subscribedAt), "dd MMM yyyy")}
              </p>
            </div>
          </div>
        ))}

        {paginatedSubscribers.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No subscribers found.
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
                        Delete {selectedCount} Subscribers?
                      </h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                      This action cannot be undone. You are about to permanently
                      delete <strong>{selectedCount}</strong> subscribers and
                      remove them from the mailing list.
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
