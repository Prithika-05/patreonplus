import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'; // Added Loader2
import { motion } from 'framer-motion';
import api from "@/lib/axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setIsVerifying(false);
      return;
    }

    let intervalId;
    let attempts = 0;
    const maxAttempts = 10; 

    const checkStatus = async () => {
      try {
        attempts += 1;
        const token = localStorage.getItem("token");

        const response = await api.get(
          `/subscriptions/status?session_id=${sessionId}`
        );
        const data = response.data;

        if (data.status === 'active' || data.status === 'success') {
          clearInterval(intervalId);
          queryClient.invalidateQueries({
            queryKey: ['my-subscriptions']
          }); 
          setIsVerifying(false);
        } else if (attempts >= maxAttempts) {
          clearInterval(intervalId);
          setIsVerifying(false);
          setError("Taking longer than expected. Please check your dashboard in a moment.");
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
      }
    };

    intervalId = setInterval(checkStatus, 2000);
    checkStatus(); 

    return () => clearInterval(intervalId);
  }, [sessionId, queryClient]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="max-w-md p-8 rounded-3xl border border-border/60 bg-card shadow-xl space-y-6"
      >
        {isVerifying ? (
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Loader2 className="h-12 w-12 animate-spin" />
          </div>
        ) : (
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 animate-bounce">
            <CheckCircle2 className="h-12 w-12" />
          </div>
        )}
        
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            {isVerifying ? "Confirming Payment..." : "Payment Successful!"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isVerifying 
              ? "We are unlocking your membership tier. Please do not close this page."
              : error || "Thank you for your support! Your membership tier has been unlocked, and you now have access to exclusive creator content."
            }
          </p>
        </div>

        {sessionId && (
          <div className="p-3 bg-muted/50 rounded-xl border border-border/40 text-[10px] text-muted-foreground font-mono truncate">
            Session Ref: {sessionId}
          </div>
        )}

        <Button 
          className="w-full shadow-lg shadow-primary/20" 
          disabled={isVerifying} 
          onClick={() => navigate('/subscriber/subscriptions')}
        >
          {isVerifying ? "Processing..." : "Go to Dashboard"} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
