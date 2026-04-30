"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  Home,
  Briefcase,
  MapPin,
  CheckCircle2,
  Edit2,
  Trash2,
  Settings2,
} from "lucide-react";
import {
  getUserAddresses,
  setDefaultAddress,
  deleteUserAddress,
} from "@/actions/address.actions";
import { useUser } from "@clerk/nextjs";
import useAddressSidebar from "@/hooks/useAddressSidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "react-hot-toast";

interface Address {
  _id: string;
  addressType: "home" | "work" | "others" | string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  isDefault: boolean;
}

interface AddressSelectionProps {
  onSelect: (address: Address) => void;
  selectedAddress?: Address;
}

const AddressSelection = ({
  onSelect,
  selectedAddress,
}: AddressSelectionProps) => {
  const { user } = useUser();
  const {
    open: openAddressSidebar,
    refreshTrigger,
    lastSavedAddressId,
    setLastSavedAddressId,
  } = useAddressSidebar();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchAddresses = async () => {
    if (!user) return;
    try {
      const data = await getUserAddresses(user.id);
      setAddresses(data);
      if (data.length > 0) {
        if (lastSavedAddressId) {
          const newlySaved = data.find((a: any) => a._id === lastSavedAddressId);
          if (newlySaved) {
            onSelect(newlySaved);
            setLastSavedAddressId(null);
            return;
          }
          setLastSavedAddressId(null);
        }
        if (selectedAddress) {
          const upToDateSelected = data.find(
            (a: any) => a._id === selectedAddress._id,
          );
          if (upToDateSelected) {
            onSelect(upToDateSelected);
          } else {
            const defaultAddr = data.find((a: any) => a.isDefault) || data[0];
            onSelect(defaultAddr);
          }
        } else {
          const defaultAddr = data.find((a: any) => a.isDefault) || data[0];
          onSelect(defaultAddr);
        }
      } else {
        onSelect(undefined as any);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user, refreshTrigger]);

  const handleSetDefault = async (addressId: string) => {
    if (!user) return;
    try {
      const res = await setDefaultAddress(addressId, user.id);
      if (res.success) {
        toast.success("Default address updated");
        fetchAddresses();
      }
    } catch (error) {
      toast.error("Failed to update default address");
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
    try {
      const res = await deleteUserAddress(addressId);
      if (res.success) {
        toast.success("Address deleted");
        fetchAddresses();
      }
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const AddressCard = ({
    address,
    isSelected,
    showActions = false,
  }: {
    address: Address;
    isSelected: boolean;
    showActions?: boolean;
  }) => (
    <div
      onClick={() => {
        onSelect(address);
        if (!showActions) setIsSidebarOpen(false);
      }}
      className={`relative cursor-pointer group rounded-xl border-2 p-4 transition-all duration-300 ${
        isSelected
          ? "border-primary bg-primary/5 shadow-sm shadow-primary/5"
          : "border-border hover:border-primary/50 bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`mt-1 p-2 rounded-lg transition-colors ${
              isSelected
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            }`}
          >
            {address.addressType === "home" && <Home className="w-4 h-4" />}
            {address.addressType === "work" && (
              <Briefcase className="w-4 h-4" />
            )}
            {!["home", "work"].includes(address.addressType as string) && (
              <MapPin className="w-4 h-4" />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">{address.fullName}</span>
              {address.isDefault && (
                <span className="text-[10px] font-black uppercase tracking-widest text-primary px-1.5 py-0.5 bg-primary/10 rounded">
                  Default
                </span>
              )}
              <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded capitalize">
                {address.addressType}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              {address.line1}
              {address.line2 && `, ${address.line2}`}
              <br />
              {address.city}, {address.state} {address.postalCode}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isSelected && (
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 transition-all duration-300 scale-110" />
          )}
          {showActions && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openAddressSidebar(address);
                }}
                className="p-1.5 hover:bg-primary/10 rounded-md text-muted-foreground hover:text-primary transition-colors"
                title="Edit address"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(address._id);
                }}
                className="p-1.5 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-colors"
                title="Delete address"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {showActions && !address.isDefault && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSetDefault(address._id);
          }}
          className="mt-3 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
        >
          Set as default
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Shipping Address
        </h3>
        <div className="flex items-center gap-2">
          {addresses.length > 1 && (
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-[10px] font-black uppercase tracking-tighter gap-1.5 text-primary hover:bg-primary/10"
                >
                  <Settings2 className="w-3 h-3" />
                  Change
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:max-w-md p-0 gap-0 overflow-hidden border-none shadow-2xl z-[10002]"
              >
                <SheetHeader className="p-8 border-b border-border bg-muted/30">
                  <SheetTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Select Shipping Address
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-180px)] p-8">
                  <div className="grid grid-cols-1 gap-4">
                    {addresses.map((address) => (
                      <AddressCard
                        key={address._id}
                        address={address}
                        isSelected={selectedAddress?._id === address._id}
                        showActions={true}
                      />
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-8 border-t border-border bg-muted/30 flex justify-end">
                  <Button
                    variant="default"
                    onClick={() => {
                      setIsSidebarOpen(false);
                      openAddressSidebar();
                    }}
                    className="w-full h-12 gap-2 font-bold shadow-lg shadow-primary/20"
                  >
                    <Plus className="w-4 h-4" /> Add New Address
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => openAddressSidebar()}
            className="h-8 px-3 text-[10px] font-black uppercase tracking-tighter gap-1.5"
          >
            <Plus className="w-3 h-3" />
            Add New
          </Button>
        </div>
      </div>

      {!selectedAddress ? (
        <div className="p-8 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 text-center">
          <div className="p-3 bg-muted rounded-full">
            <MapPin className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold">No addresses found</p>
            <p className="text-xs text-muted-foreground">
              Add an address to proceed with checkout
            </p>
          </div>
        </div>
      ) : (
        <AddressCard
          address={selectedAddress}
          isSelected={true}
          showActions={false}
        />
      )}
    </div>
  );
};

export default AddressSelection;
