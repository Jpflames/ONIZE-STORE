"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Pencil,
  Package,
  Trash2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import OrderEditDrawer from "./OrderEditDrawer";
import { deleteOrders } from "@/actions/admin.actions";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ORDER_STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  packed: "bg-purple-50 text-purple-700 border-purple-200",
  delivering: "bg-orange-50 text-orange-700 border-orange-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  complete: "bg-green-50 text-green-700 border-green-200",
};
const PAYMENT_STATUS_STYLES: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600 border-gray-200",
  paid: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function OrdersTable({ orders }: { orders: any[] }) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-border text-center">
        <Package className="w-10 h-10 text-muted-foreground/30 mb-4" />
        <p className="text-base font-semibold">No orders yet</p>
      </div>
    );
  }

  const itemsPerPage = 25;
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllPage = () => {
    const allOnPageSelected = paginatedOrders.every((o) =>
      selectedIds.has(o._id),
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        paginatedOrders.forEach((o) => next.delete(o._id));
      } else {
        paginatedOrders.forEach((o) => next.add(o._id));
      }
      return next;
    });
  };

  const openDeleteModal = (ids: string[]) => {
    setIdsToDelete(ids);
    setIsDeleteModalOpen(true);
  };

  const handleBulkDelete = () => {
    startTransition(async () => {
      try {
        await deleteOrders(idsToDelete);
        toast.success(`Successfully deleted ${idsToDelete.length} order(s)`);
        setSelectedIds(
          (prev) =>
            new Set([...prev].filter((id) => !idsToDelete.includes(id))),
        );
        setIsDeleteModalOpen(false);
        setIdsToDelete([]);

        // Adjust page if current page becomes empty
        const remainingCount = orders.length - idsToDelete.length;
        const newTotalPages = Math.ceil(remainingCount / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      } catch (error) {
        toast.error("Failed to delete orders");
      }
    });
  };

  const isAllPageSelected =
    paginatedOrders.length > 0 &&
    paginatedOrders.every((o) => selectedIds.has(o._id));

  return (
    <div className="space-y-4">
      {/* Bulk Actions Toolbar */}
      <div className="flex items-center justify-between p-4 border border-border bg-muted/10 rounded-t-lg">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isAllPageSelected}
            onChange={toggleSelectAllPage}
            disabled={isPending}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium text-muted-foreground">
            {selectedIds.size > 0
              ? `${selectedIds.size} selected`
              : "Select orders"}
          </span>
        </div>

        {selectedIds.size > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => openDeleteModal(Array.from(selectedIds))}
            disabled={isPending}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </Button>
        )}
      </div>

      <div className="border border-border divide-y divide-border -mt-4 border-t-0 rounded-b-lg overflow-hidden">
        {paginatedOrders.map((order) => (
          <div
            key={order._id}
            className="flex flex-wrap items-center gap-3 px-4 py-4 hover:bg-muted/20 hoverEffect bg-background"
          >
            <div className="pr-1">
              <input
                type="checkbox"
                checked={selectedIds.has(order._id)}
                onChange={() => toggleSelection(order._id)}
                disabled={isPending}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
            </div>

            {/* Left: icon + info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 bg-muted shrink-0">
                <Package className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold font-mono">
                  #{order.orderNumber?.slice(-12)}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {order.customerName} · {order.email}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {order.orderDate
                    ? format(new Date(order.orderDate), "dd MMM yyyy, HH:mm")
                    : "—"}{" "}
                  · {order.itemCount ?? 0} item
                  {(order.itemCount ?? 0) !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Status badges */}
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 border uppercase tracking-wider rounded ${
                  PAYMENT_STATUS_STYLES[order.paymentStatus] ??
                  "bg-muted text-muted-foreground border-border"
                }`}
              >
                {order.paymentStatus ?? "—"}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 border uppercase tracking-wider rounded ${
                  ORDER_STATUS_STYLES[order.status] ??
                  "bg-muted text-muted-foreground border-border"
                }`}
              >
                {order.status ?? "—"}
              </span>
            </div>

            {/* Price */}
            <p className="text-sm font-bold shrink-0 tabular-nums min-w-[60px] text-right">
              ${order.totalPrice?.toFixed(2)}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(order)}
                className="gap-1.5 h-8"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openDeleteModal([order._id])}
                disabled={isPending}
                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}

        {paginatedOrders.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No orders found matching criteria.
          </div>
        )}
      </div>

      {/* Pagination */}
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

      {/* Edit Drawer */}
      {selectedOrder && (
        <OrderEditDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {mounted &&
        typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isDeleteModalOpen && (
              <>
                <motion.div
                  key="backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                  key="modal"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
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
                        Delete {idsToDelete.length} Order(s)?
                      </h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                      This action cannot be undone. All selected order records
                      and dynamic history will be permanently removed.
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
                        Delete Permanently
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
