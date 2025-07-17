"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/forms";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendBackendRequest, Endpoint, HttpMethod } from "@/lib/utils.client";

// ---------------------------------------------------------------
// Validation schema & types
// ---------------------------------------------------------------
const formSchema = z.object({
  shopName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  receivingWallet: z.string().min(5, {
    message: "Please enter a valid wallet address.",
  }),
});

type FormData = z.infer<typeof formSchema>;

// ---------------------------------------------------------------
// Component
// ---------------------------------------------------------------
export interface UpdateFormProps {
  id: string;
  shopName: string;
  receivingWallet: string;
  setOpen: (open: boolean) => void;
}

export const UpdateForm: FC<UpdateFormProps> = ({
  shopName,
  receivingWallet,
  setOpen,
}) => {
  const router = useRouter();
  const { update } = useSession();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopName,
      receivingWallet,
    },
  });

  // -------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------
  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const res = await sendBackendRequest(Endpoint.SHOP, HttpMethod.PUT, {
        action: "update",
        shopName: data.shopName,
        receivingWallet: data.receivingWallet,
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err?.error ?? "Failed to update shop info");
        return;
      }

      // Update local session so UI reflects immediately
      await update({
        user: {
          name: data.shopName,
          receivingWallet: data.receivingWallet,
        },
      });

      toast.success("Shop info updated successfully");
      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error updating shop info");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Render
  // -------------------------------------------------------------
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-lg"
      >
        {/* Shop Name */}
        <FormField
          control={form.control}
          name="shopName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Company" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Receiving Wallet */}
        <FormField
          control={form.control}
          name="receivingWallet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receiving Wallet</FormLabel>
              <FormControl>
                <Input placeholder="Wallet public key" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" loading={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};
