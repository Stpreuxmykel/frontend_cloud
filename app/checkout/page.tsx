"use client";

import { useEffect, useState } from "react";
import { getId, getPlan } from "../api/action";
import axios from "axios";
import { getToken } from "../lib/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Checkout() {
  const [plan, setPlan] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [expiry, setExpiry] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [insufficientBalance, setInsufficientBalance] =
    useState<boolean>(false);

  const router = useRouter();

  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const userId = getId();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [router, token]);

  useEffect(() => {
    const storedPlan = localStorage.getItem("plan");
    setPlan(storedPlan);

    if (storedPlan) {
      // const token = getToken()

      axios
        .get(`${api_url}/membership_plans/?name=${storedPlan}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPrice(response.data.price);
        })
        .catch((error) => {
          console.error("Error fetching plan price:", error);
          setError("Failed to fetch plan details");
        });
    }
  }, [api_url, token]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    setInsufficientBalance(false);

    // const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found");
      setLoading(false);
      return;
    }

    try {
      // Fetch the virtual card associated with the user
      const cardResponse = await axios.get(
        `${api_url}/virtual-card/${userId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userCard = cardResponse.data.card_info;
      console.log(" userCard: ", userCard);

      // Card number, CVV, and expiry date validation
      if (
        userCard.card_number !== cardNumber ||
        userCard.cvv !== cvv ||
        userCard.expiry_date !== expiry
      ) {
        toast.error("Invalid card details");
        setLoading(false);
        return;
      }

      // Check if the user has sufficient balance
      if (Number(userCard.amount) < price) {
        toast.error("Balance insuffisant");
        setInsufficientBalance(true);
        setLoading(false);
        return;
      }

      // Process the payment (you may need to adjust the logic here)
      const response = await axios.post(
        `${api_url}/membership_plans/`,
        { name: plan, card_number: cardNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Checkout successful");

      console.log("Checkout successful:", response.data);

      localStorage.setItem("has_plan", "true");
      localStorage.setItem("plan_name", response.data.plan_name);
      localStorage.setItem("membershipPlan", JSON.stringify(response.data));
      router.push("/success"); // Redirect to success page after payment
    } catch (error) {
      console.log("Checkout error:", error);
      toast.error("Failed to process checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8 flex items-center justify-center">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20 animate-pulse" />

      <div className="relative max-w-2xl w-full bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-cyan-400/20 p-8 space-y-8 neon-glow">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold cyber-font bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            CHECKOUT TERMINAL
          </h1>
          <div className="text-cyan-400 flex items-center justify-center gap-2">
            <span className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse" />
            <span>SECURE PAYMENT GATEWAY</span>
          </div>
        </div>

        {/* Selected Plan Display */}
        <div className="p-6 bg-gray-800/30 rounded-xl border border-cyan-400/20">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-cyan-400 cyber-font">
                {plan ? `${plan.toUpperCase()} PLAN` : "No Plan Selected"}
              </h2>

              <p className="text-gray-400">Monthly Subscription</p>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              {/* {price } HTG */}

              {price !== null ? (
                <p className="text-xl">Price: {price} HTG</p>
              ) : (
                <p className="text-gray-400">Loading price...</p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-6">
          {/* Card Number Input */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-xl blur opacity-30 group-focus-within:opacity-60 transition-opacity" />
            <div className="relative bg-gray-900/50 rounded-xl">
              <label className="block text-sm text-cyan-400 mb-2 px-4 pt-3">
                CARD NUMBER
              </label>
              <input
                type="text"
                placeholder="•••• •••• •••• ••••"
                className="w-full bg-transparent border-none text-cyan-300 placeholder-cyan-400/50 font-mono text-xl px-4 pb-3 "
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="h-8 w-12 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded-md" />
              </div>
            </div>
          </div>

          {/* Expiry & CVV */}
          <div className="grid grid-cols-2 gap-6">
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 to-cyan-400/30 rounded-xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
              <div className="relative bg-gray-900/50 rounded-xl">
                <label className="block text-sm text-cyan-400 mb-2 px-4 pt-3">
                  EXPIRY
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full bg-transparent border-none text-cyan-300 placeholder-cyan-400/50 font-mono text-xl px-4 pb-3"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                />
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 to-cyan-400/30 rounded-xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
              <div className="relative bg-gray-900/50 rounded-xl">
                <label className="block text-sm text-cyan-400 mb-2 px-4 pt-3">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="•••"
                  className="w-full bg-transparent border-none text-cyan-300 placeholder-cyan-400/50 font-mono text-xl px-4 pb-3"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Country Selector */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 to-cyan-400/30 rounded-xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
            <div className="relative bg-gray-900/50 rounded-xl">
              <label className="block text-sm text-cyan-400 mb-2 px-4 pt-3">
                COUNTRY
              </label>
              <select className="w-full bg-transparent border-none text-cyan-300 font-mono text-xl px-4 pb-3 appearance-none">
                <option className="bg-gray-900">Select Country</option>
                {/* Add country options */}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="space-y-4">
          <div className="flex justify-between text-cyan-300">
            <span>Plan Cost</span>
            <span>
              {price === null ? (
                <p className="text-gray-400">Loading price...</p>
              ) : (
                `${price} HTG`
              )}
            </span>
          </div>
          <div className="flex justify-between text-green-400">
            {/* <span>Service Tax (15%)</span> */}
            {/* <span>{price?.toFixed(2)} HTG</span> */}
          </div>
          <div className="border-t border-cyan-400/20 pt-4">
            <div className="flex justify-between text-xl font-bold  bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              <span>TOTAL</span>
              {/* <span>{(500 * 1.15).toFixed(2)} HTG</span> */}
              <span>{price?.toFixed(2)} HTG</span>
              {/* {price } HTG */}
            </div>
          </div>
        </div>

        {/* Confirm Payment Button */}
        {/* <button className="w-full py-4 bg-gradient-to-r from-green-400 to-cyan-400 rounded-xl text-gray-900 font-bold text-xl hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-300 hover:scale-[1.02]">
      CONFIRM PAYMENT
      <span className="ml-2 animate-pulse">▸</span>
    </button> */}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className={`mt-4 px-6 py-3 rounded-lg font-bold transition ${
            loading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-cyan-400/50 text-sm">
          <div className="h-4 w-4 bg-cyan-400/20 rounded-full animate-pulse" />
          256-BIT SSL ENCRYPTED
          <div className="h-4 w-4 bg-cyan-400/20 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 w-0.5 bg-cyan-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
