"use client";

import { useTransition, useState, useEffect } from "react";
import { User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/actions/admin.actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  userId: string;
  imageUrl: string | null;
  fullName: string | null;
  email: string | undefined;
  isAdmin: boolean;
  joined: string;
  hideBorder?: boolean;
}

export default function AdminUserRow({
  userId,
  imageUrl,
  fullName,
  email,
  isAdmin,
  joined,
  hideBorder = false,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = () => {
    if (isAdmin) {
      toast.error("Cannot delete the admin account.");
      setIsOpen(false);
      return;
    }

    startTransition(async () => {
      await deleteUser(userId);
      toast.success("User deleted");
      setIsOpen(false);
      router.refresh();
    });
  };

  // If the row is currently being deleted, show a skeleton layout matching the row sizes
  if (isPending) {
    return (
      <div
        className={`flex items-center gap-4 px-5 py-4 bg-muted/20 ${hideBorder ? "" : "border-b border-border/50"}`}
      >
        {/* Avatar Skeleton */}
        <div className="w-9 h-9 rounded-full bg-muted animate-pulse shrink-0 border border-border/50" />

        {/* Info Skeleton */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          <div className="h-3 w-48 bg-muted animate-pulse rounded" />
        </div>

        {/* Joined Skeleton */}
        <div className="h-3 w-24 bg-muted animate-pulse rounded shrink-0 hidden sm:block" />

        {/* Delete Button Skeleton */}
        <div className="h-8 w-20 bg-muted animate-pulse rounded shrink-0" />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-4 px-5 py-4 hover:bg-muted/20 hoverEffect ${hideBorder ? "" : "border-b border-border/50"}`}
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-muted overflow-hidden shrink-0 flex items-center justify-center border border-border">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={fullName ?? "User"}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold truncate">{fullName ?? "—"}</p>
          {isAdmin && (
            <span className="text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
              Admin
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{email}</p>
      </div>

      {/* Joined */}
      <p className="text-xs text-muted-foreground shrink-0 hidden sm:block">
        Joined {joined}
      </p>

      {/* Delete Action Wrapper */}
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          disabled={isAdmin}
          title={isAdmin ? "Cannot delete admin" : "Delete user"}
          className="gap-1.5 text-destructive hover:bg-destructive/5 hover:text-destructive disabled:opacity-30"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </Button>

        {mounted &&
          typeof window !== "undefined" &&
          createPortal(
            <AnimatePresence>
              {isOpen && (
                <>
                  <motion.div
                    key="reset-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
                  />
                  <motion.div
                    key="reset-modal"
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
                      <h2 className="text-lg font-bold tracking-tight mb-2">
                        Are you sure?
                      </h2>
                      <p className="text-sm text-muted-foreground mb-6">
                        This action cannot be undone. This will permanently
                        delete the user&apos;s account and remove their data
                        from our servers.
                      </p>
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setIsOpen(false)}
                          disabled={isPending}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleDelete}
                          disabled={isPending}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete User
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
    </div>
  );
}
