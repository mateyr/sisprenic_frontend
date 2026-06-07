import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { queryKeys } from "@/lib/query-keys";
import { IconLoader2 } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getLoanContract } from "../services/loan-api";

interface LoanContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loanId: number;
}

export function LoanContractDialog({
  open,
  onOpenChange,
  loanId,
}: LoanContractDialogProps) {
  const {
    data: blob,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.loans.contract(loanId),
    queryFn: () => getLoanContract(loanId),
    enabled: open,
    staleTime: Infinity,
    retry: false,
  });

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!blob) {
      setPdfUrl(null);
      return;
    }
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [blob]);

  useEffect(() => {
    if (!error) return;
    toast.error(error.message);
    onOpenChange(false);
  }, [error, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="h-[95vh] gap-0 overflow-hidden p-0 sm:max-w-[70vw] border-none rounded-none"
      >
        <DialogTitle className="sr-only">
          Contrato de Préstamo #{loanId}
        </DialogTitle>

        <DialogDescription className="hidden"></DialogDescription>

        {isLoading && (
          <div className="flex h-full items-center justify-center">
            <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {pdfUrl && (
          <iframe
            src={pdfUrl}
            className="h-full w-full"
            title={`Contrato de Préstamo #${loanId}`}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
