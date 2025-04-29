"use client";

import { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiHome,
  FiBook,
  FiUsers,
  FiFileText,
  FiDollarSign,
  FiSettings,
} from "react-icons/fi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaRegTrashCan } from "react-icons/fa6";
import Image from "next/image";
import axios from "axios";
import FetchAllUsers from "../component/FetchAllUsers";
import FetchAllProperties from "../component/FetchAllProperties";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { RiMenuFold3Fill } from "react-icons/ri";
import { Input } from "@/components/ui/input";
import { SiProgress } from "react-icons/si";
import { FaPowerOff } from "react-icons/fa6";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fetchProperties,
  getAllVirtualCard,
  getTotalSales,
  getRevenue,
  getUserProfile,
  getMembershipPlans,
  getDailyTransactions,
  getAllUserProfile,
  getId,
} from "../api/action";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { getToken } from "../lib/auth";

export default function Cartes() {
  const [amount, setAmount] = useState("");
  const [inCome, setInCome] = useState("");
  const [search, setSearch] = useState("");

  const [cards, setCards] = useState([]);
  const backend_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const token = getToken();

  const filteredCards = cards.filter((card) =>
    `${card.firstname} ${card.lastname}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const fetchCardData = async () => {
    try {
      const result = await getAllVirtualCard();
      console.log("The card list : ", result);
      setCards(result);
    } catch (error) {
      console.error("Error fetching cards :", error);
    }
  };

  useEffect(() => {
    fetchCardData();
  }, []);

  const handleRecharge = async (cardId) => {
    try {
      const response = await axios.post(
        `${backend_url}/card/${cardId}/update-amount/`,
        { amount: Number(amount) }, // Sending the new amount from the frontend
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Amount updated successfully:", response.data);
      fetchCardData();
    } catch (error) {
      console.error(
        "Error updating amount:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="p-4 neon-dashboard   ">
      {/* Search Filter Input */}
      <input
        type="text"
        placeholder="Search card by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 w-full lg:w-1/2 rounded-lg border border-green-400/30 bg-gray-900 text-green-300 placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-screen overflow-y-auto">
        {filteredCards.map((card) => (
          <Dialog key={card.id}>
            <DialogTrigger asChild>
              <div
                className="relative cursor-pointer h-64 bg-gradient-to-br
                   from-gray-900/80 to-black/90 backdrop-blur-xl 
                   rounded-2xl p-6 border border-green-400/20 
                   hover:border-cyan-400/30 transition-all duration-300
                    hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]  "
              >
                {/* Holographic Top Bar */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />

                {/* Logo */}
                <div className="absolute top-4 left-4">
                  <Image
                    src="/images/espaslink.png"
                    alt="EspasLink Logo"
                    width={40}
                    height={40}
                  />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-2 gap-6 pl-12">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="cyber-font">
                      <div className="text-sm text-cyan-400/80 tracking-widest">
                        CARD HOLDER
                      </div>
                      <div className="text-xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                        {card.firstname} {card.lastname}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-green-400/80">
                        CARD NUMBER
                      </div>
                      <div className="font-mono text-lg text-green-300 tracking-wider glow-text">
                        {card.card_number.replace(/(\d{4})/g, "•••• ").trim()}
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div>
                        <div className="text-sm text-cyan-400/80">EXPIRY</div>
                        <div className="font-mono text-green-300">
                          {card.expiry_date}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-cyan-400/80">CVV</div>
                        <div className="font-mono text-green-300">•••</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 border-l border-green-400/20 pl-6">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          card.is_active
                            ? "bg-gradient-to-r from-green-400 to-cyan-400"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm text-green-400/80">
                        {card.is_active ? "ACTIVE CARD" : "INACTIVE"}
                      </span>
                    </div>

                    <div>
                      <div className="text-sm text-cyan-400/80">BALANCE</div>
                      <div className="text-xl font-bold text-green-300">
                        {card.amount}{" "}
                        <span className="text-sm text-cyan-400/80">HTG</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-cyan-400/80">CREATED</div>
                      <div className="text-sm text-green-300/80">
                        {new Date(card.created_at).toLocaleDateString("en-GB")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogTrigger>

            <DialogContent className="bg-gray-900 border border-green-400/30 rounded-lg max-w-md">
              <DialogHeader>
                <DialogTitle className="text-green-400 text-xl">
                  Card Details
                </DialogTitle>
                <div className="relative group max-w-md">
                  {/* Floating holographic effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-lg blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Main input container */}
                  <div className="relative bg-gray-900/80 backdrop-blur-sm border border-green-400/30 rounded-lg overflow-hidden transition-all duration-300 group-hover:border-cyan-400/50">
                    {/* Animated top border */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 via-blue-400 to-transparent animate-[shine_3s_linear_infinite]" />

                    {/* Input field */}
                    <div className="flex items-center px-4 py-3">
                      <span className="font-mono text-green-400/80 mr-2">
                        HTG
                      </span>
                      <input
                        type="number"
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter recharge amount"
                        className="w-full bg-transparent border-none outline-none text-green-300 placeholder-green-400/50 font-mono text-lg"
                      />
                      <div
                        onClick={() => handleRecharge(card.id)}
                        className="ml-2 h-6 w-6 cursor-pointer bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center"
                      >
                        <DialogClose>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 text-gray-900"
                          >
                            <path d="M18 8L22 12L18 16" />
                            <path d="M2 12H22" />
                          </svg>
                        </DialogClose>
                      </div>
                    </div>

                    {/* Bottom animated border */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-rose-400 to-blue-400 animate-[shine_3s_linear_infinite] animation-delay-1000" />
                  </div>

                  {/* Validation message area */}
                  <div className="mt-2 h-5">
                    {/* Example error message - replace with your logic */}
                    {/* <p className="text-sm text-rose-400 animate-pulse">Insufficient balance</p> */}
                  </div>
                </div>

                <DialogDescription className="text-gray-300">
                  <div className="space-y-4 mt-4">
                    <div>
                      <h3 className="text-cyan-400 text-lg">
                        {card.firstname} {card.lastname}
                      </h3>
                      <p className="text-green-300/80">Card Holder</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-cyan-400">Card Number</p>
                        <p className="font-mono text-green-300">
                          {card.card_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-cyan-400">CVV</p>
                        <p className="font-mono text-green-300">{card.cvv}</p>
                      </div>
                      <div>
                        <p className="text-cyan-400">Expiry</p>
                        <p className="text-green-300">{card.expiry_date}</p>
                      </div>
                      <div>
                        <p className="text-cyan-400">Status</p>
                        <p
                          className={
                            card.is_active ? "text-green-400" : "text-red-400"
                          }
                        >
                          {card.is_active ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-green-400/20">
                      <p className="text-cyan-400">Balance</p>
                      <p className="text-2xl text-green-300">
                        {card.amount} HTG
                      </p>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-green-400 rounded-lg transition-colors">
                  Close
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
