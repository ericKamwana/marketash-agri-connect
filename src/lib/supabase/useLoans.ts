
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./supabase-provider";
import { toast } from "sonner";

export interface Loan {
  id: string;
  user_id: string;
  amount: number;
  interest_rate: number;
  term_months: number;
  status: "pending" | "approved" | "rejected" | "active" | "paid" | "defaulted";
  purpose: string;
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
  status: "pending" | "completed" | "failed";
  payment_method?: string;
  payment_id?: string;
  created_at: string;
}

export function useLoans() {
  const { supabase, user } = useSupabase();
  const queryClient = useQueryClient();

  // Apply for a loan
  const applyForLoan = async (loanData: {
    amount: number;
    term_months: number;
    purpose: string;
    collateral?: string;
  }) => {
    if (!user) {
      throw new Error("You must be logged in to apply for a loan");
    }

    // Calculate interest rate based on amount and term
    // This is a simplified example; real-world rates would be more complex
    const interestRate = loanData.amount > 5000 ? 8.5 : 10.5;

    const { data, error } = await supabase
      .from("loans")
      .insert({
        ...loanData,
        user_id: user.id,
        interest_rate: interestRate,
        status: "pending" // The database trigger will auto-approve if credit score is high enough
      })
      .select()
      .single();

    if (error) {
      console.error("Error applying for loan:", error);
      throw new Error(error.message);
    }

    return data as Loan;
  };

  // Use the applyForLoan function with react-query
  const useApplyForLoanMutation = () => {
    return useMutation({
      mutationFn: applyForLoan,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["loans"],
        });
        toast.success("Loan application submitted successfully!");
      },
      onError: (error) => {
        toast.error(`Loan application failed: ${error.message}`);
      },
    });
  };

  // Fetch user's loans
  const fetchUserLoans = async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from("loans")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching loans:", error);
      throw new Error(error.message);
    }

    return data as Loan[];
  };

  // Use the fetchUserLoans function with react-query
  const useUserLoansQuery = () => {
    return useQuery({
      queryKey: ["loans"],
      queryFn: fetchUserLoans,
      enabled: !!user,
    });
  };

  // Fetch a single loan by ID
  const fetchLoanById = async (id: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("loans")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error(`Error fetching loan with ID ${id}:`, error);
      throw new Error(error.message);
    }

    return data as Loan;
  };

  // Use the fetchLoanById function with react-query
  const useLoanQuery = (id: string) => {
    return useQuery({
      queryKey: ["loans", id],
      queryFn: () => fetchLoanById(id),
      enabled: !!id && !!user,
    });
  };

  // Fetch loan payments for a specific loan
  const fetchLoanPayments = async (loanId: string) => {
    if (!user) return [];

    const { data, error } = await supabase
      .from("loan_payments")
      .select("*")
      .eq("loan_id", loanId)
      .order("payment_date", { ascending: true });

    if (error) {
      console.error(`Error fetching payments for loan ${loanId}:`, error);
      throw new Error(error.message);
    }

    return data as LoanPayment[];
  };

  // Use the fetchLoanPayments function with react-query
  const useLoanPaymentsQuery = (loanId: string) => {
    return useQuery({
      queryKey: ["loans", loanId, "payments"],
      queryFn: () => fetchLoanPayments(loanId),
      enabled: !!loanId && !!user,
    });
  };

  // Make a loan payment
  const makeLoanPayment = async ({
    loanId,
    amount,
    paymentMethod
  }: {
    loanId: string;
    amount: number;
    paymentMethod: string;
  }) => {
    if (!user) {
      throw new Error("You must be logged in to make a loan payment");
    }

    // In a real app, this would integrate with a payment processor
    // This is a simplified mock implementation
    const paymentId = `pay_${Date.now()}`;
    
    const { data, error } = await supabase
      .from("loan_payments")
      .insert({
        loan_id: loanId,
        amount: amount,
        payment_date: new Date().toISOString(),
        status: "completed", // Mock successful payment
        payment_method: paymentMethod,
        payment_id: paymentId
      })
      .select()
      .single();

    if (error) {
      console.error("Error making loan payment:", error);
      throw new Error(error.message);
    }

    // Check if the loan is fully paid
    const { data: loanData } = await supabase
      .from("loans")
      .select("*")
      .eq("id", loanId)
      .single();

    const { data: paymentsData } = await supabase
      .from("loan_payments")
      .select("amount")
      .eq("loan_id", loanId)
      .eq("status", "completed");

    const totalPaid = paymentsData.reduce(
      (sum: number, payment: { amount: number }) => sum + payment.amount,
      0
    );

    const loanTotal = loanData.amount * (1 + loanData.interest_rate / 100);

    // If loan is fully paid, update its status
    if (totalPaid >= loanTotal) {
      await supabase
        .from("loans")
        .update({ status: "paid" })
        .eq("id", loanId);

      // Increase user's credit score for fully paying off a loan
      await supabase.rpc("increase_credit_score", { user_id: user.id, points: 15 });
    }

    return data as LoanPayment;
  };

  // Use the makeLoanPayment function with react-query
  const useMakeLoanPaymentMutation = () => {
    return useMutation({
      mutationFn: makeLoanPayment,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["loans", variables.loanId, "payments"],
        });
        queryClient.invalidateQueries({
          queryKey: ["loans"],
        });
        toast.success("Payment successful!");
      },
      onError: (error) => {
        toast.error(`Payment failed: ${error.message}`);
      },
    });
  };

  return {
    useApplyForLoanMutation,
    useUserLoansQuery,
    useLoanQuery,
    useLoanPaymentsQuery,
    useMakeLoanPaymentMutation,
  };
}
