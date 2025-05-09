
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./supabase-provider";
import { toast } from "sonner";

export interface Loan {
  id: string;
  user_id: string;
  amount: number;
  purpose: string;
  interest_rate: number;
  term_months: number;
  status: string;
  collateral?: string;
  approval_score?: number;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LoanPayment {
  id: string;
  loan_id: string;
  amount: number;
  payment_date: string;
  status: string;
  payment_method?: string;
  payment_id?: string;
  created_at: string;
}

export function useLoans() {
  const { supabase, user } = useSupabase();
  const queryClient = useQueryClient();

  // Apply for a loan
  const applyForLoan = async ({
    amount,
    purpose,
    interestRate,
    termMonths,
    collateral,
  }: {
    amount: number;
    purpose: string;
    interestRate: number;
    termMonths: number;
    collateral?: string;
  }) => {
    if (!user) {
      throw new Error("You must be logged in to apply for a loan");
    }

    // Use type assertion to work around TypeScript errors
    const { data, error } = await (supabase
      .from("loans" as any)
      .insert({
        user_id: user.id,
        amount,
        purpose,
        interest_rate: interestRate,
        term_months: termMonths,
        collateral,
      } as any)
      .select()
      .single() as any);

    if (error) {
      console.error("Error applying for loan:", error);
      throw new Error(error.message);
    }

    return data as Loan;
  };

  // Fetch user's loan applications
  const fetchUserLoans = async () => {
    if (!user) return [];

    // Use type assertion to work around TypeScript errors
    const { data, error } = await (supabase
      .from("loans" as any)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }) as any);

    if (error) {
      console.error("Error fetching loans:", error);
      throw new Error(error.message);
    }

    return data as Loan[];
  };

  // Fetch a single loan by ID
  const fetchLoanById = async (id: string) => {
    if (!user) return null;

    // Use type assertion to work around TypeScript errors
    const { data, error } = await (supabase
      .from("loans" as any)
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single() as any);

    if (error) {
      console.error(`Error fetching loan with ID ${id}:`, error);
      throw new Error(error.message);
    }

    return data as Loan;
  };

  // Fetch loan payments for a specific loan
  const fetchLoanPayments = async (loanId: string) => {
    if (!user) return [];

    // Use type assertion to work around TypeScript errors
    const { data, error } = await (supabase
      .from("loan_payments" as any)
      .select("*")
      .eq("loan_id", loanId)
      .order("payment_date", { ascending: false }) as any);

    if (error) {
      console.error(`Error fetching payments for loan ${loanId}:`, error);
      throw new Error(error.message);
    }

    return data as LoanPayment[];
  };

  // Use react-query for loan application
  const useApplyForLoanMutation = () => {
    return useMutation({
      mutationFn: applyForLoan,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["loans"] });
        toast.success("Loan application submitted successfully!");
      },
      onError: (error: Error) => {
        toast.error(`Loan application failed: ${error.message}`);
      },
    });
  };

  // Use react-query for fetching user's loans
  const useUserLoansQuery = () => {
    return useQuery({
      queryKey: ["loans"],
      queryFn: fetchUserLoans,
      enabled: !!user,
    });
  };

  // Use react-query for fetching a single loan
  const useLoanQuery = (id: string) => {
    return useQuery({
      queryKey: ["loans", id],
      queryFn: () => fetchLoanById(id),
      enabled: !!id && !!user,
    });
  };

  // Use react-query for fetching loan payments
  const useLoanPaymentsQuery = (loanId: string) => {
    return useQuery({
      queryKey: ["loan-payments", loanId],
      queryFn: () => fetchLoanPayments(loanId),
      enabled: !!loanId && !!user,
    });
  };

  return {
    useApplyForLoanMutation,
    useUserLoansQuery,
    useLoanQuery,
    useLoanPaymentsQuery,
  };
}
