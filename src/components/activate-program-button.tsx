"use client";

import { Button } from "@tremor/react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function ActivateProgramButton({
  programId,
  shopId,
}: {
  programId: string;
  shopId: string;
}) {
  const [pending, start] = useTransition();

  return (
    <Button
      loading={pending}
      onClick={() =>
        start(async () => {
          try {
            const res = await fetch("/api/loyalty/activate", {
              method: "POST",
              body: JSON.stringify({ programId, shopId }),
            });
            if (!res.ok) throw new Error();
            toast.success("Program activated!");
            location.reload();
          } catch {
            toast.error("Failed to activate program");
          }
        })
      }
    >
      Enable
    </Button>
  );
}
