"use client";
import React, { useState, useEffect } from "react";
import { X, Home, Briefcase, MapPin, Loader2, Save } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useUser } from "@clerk/nextjs";
import useAddressSidebar from "@/hooks/useAddressSidebar";
import { useOutsideClick } from "@/hooks";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addUserAddress,
  updateUserAddress,
  AddressData,
} from "@/actions/address.actions";
import toast from "react-hot-toast";

const AddressSidebar = () => {
  const { isOpen, close, editingAddress, refresh, setLastSavedAddressId } =
    useAddressSidebar();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [addressType, setAddressType] = useState<string>("home");
  const [customType, setCustomType] = useState<string>("");

  const handleClose = () => {
    close();
  };

  const ref = useOutsideClick<HTMLDivElement>(handleClose);

  // Reset state when sidebar opens/changes
  useEffect(() => {
    if (isOpen) {
      if (editingAddress) {
        const type = editingAddress.addressType;
        if (["home", "work"].includes(type)) {
          setAddressType(type);
          setCustomType("");
        } else {
          setAddressType("others");
          setCustomType(type);
        }
      } else {
        setAddressType("home");
        setCustomType("");
      }
    }
  }, [isOpen, editingAddress]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const finalAddressType =
      addressType === "others" ? customType : addressType;

    const addressData: AddressData = {
      clerkUserId: user.id,
      email: user.emailAddresses[0].emailAddress,
      fullName: formData.get("fullName") as string,
      addressType: finalAddressType as any,
      line1: formData.get("line1") as string,
      line2: formData.get("line2") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      postalCode: formData.get("postalCode") as string,
      country: formData.get("country") as string,
      isDefault: editingAddress ? editingAddress.isDefault : false,
    };

    try {
      let res;
      if (editingAddress) {
        res = await updateUserAddress(editingAddress._id, addressData);
      } else {
        res = await addUserAddress(addressData);
      }

      if (res.success) {
        toast.success(editingAddress ? "Address updated!" : "Address added!");
        if (res.address?._id) {
          setLastSavedAddressId(res.address._id);
        }
        refresh();
        handleClose();
      } else {
        toast.error(res.error || "Failed to save address");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] transition-all duration-300 ease-in-out">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            // Let useOutsideClick handle the closure to avoid double-triggering or propagation issues
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            ref={ref}
            className="absolute right-0 top-0 w-full max-w-md bg-background h-full text-foreground p-8 md:p-10 border-l border-border shadow-2xl flex flex-col gap-8 overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {editingAddress ? (
                    <Save className="w-5 h-5 text-primary" />
                  ) : (
                    <MapPin className="w-5 h-5 text-primary" />
                  )}
                </div>
                <h2 className="text-xl font-bold tracking-tight">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 -mr-2 hover:text-primary hoverEffect cursor-pointer"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="addressType">Address Type</Label>
                  <div className="flex flex-col gap-3">
                    <Select
                      name="addressTypeSelector"
                      value={addressType}
                      onValueChange={setAddressType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="z-[10001]">
                        <SelectItem value="home">
                          <div className="flex items-center gap-2">
                            <Home className="w-4 h-4" /> <span>Home</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="work">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> <span>Work</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="others">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />{" "}
                            <span>Others (Custom)</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {addressType === "others" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <Input
                          id="customType"
                          name="customType"
                          placeholder="e.g. Vacation Home, Office 2"
                          value={customType}
                          onChange={(e) => setCustomType(e.target.value)}
                          required={addressType === "others"}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    defaultValue={
                      editingAddress?.fullName || user?.fullName || ""
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="line1">Road and House Number</Label>
                  <Input
                    id="line1"
                    name="line1"
                    placeholder="123 Main St, Apt 4B"
                    defaultValue={editingAddress?.line1 || ""}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="line2">
                    Apartment, suite, etc. (optional)
                  </Label>
                  <Input
                    id="line2"
                    name="line2"
                    placeholder="Suite 100"
                    defaultValue={editingAddress?.line2 || ""}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="New York"
                      defaultValue={editingAddress?.city || ""}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="NY"
                      defaultValue={editingAddress?.state || ""}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Zip Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      placeholder="10001"
                      defaultValue={editingAddress?.postalCode || ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      placeholder="United States"
                      defaultValue={editingAddress?.country || "United States"}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingAddress
                      ? "Updating Address..."
                      : "Adding Address..."}
                  </>
                ) : editingAddress ? (
                  "Update Address"
                ) : (
                  "Save Address"
                )}
              </Button>
            </form>

            <div className="mt-auto pt-8 text-center text-[10px] text-muted-foreground leading-relaxed uppercase tracking-widest font-bold">
              <p>Your address will be used for shipping and checkout</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddressSidebar;
