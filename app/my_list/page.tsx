"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar";
import { RiMenuFold3Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { getToken } from "../lib/auth";
import { useSession } from "next-auth/react";
import axios from "axios";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaRegTrashCan } from "react-icons/fa6";
import { CiMenuKebab } from "react-icons/ci";

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
import { ArrowUpDown, ChevronDown, Router } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import Image from "next/image";
import { getUserProperties } from "../api/action";

type Property = {
  id: string;
  user: string;
  title: string;
  description: string;
  location: string;
  price: number;
  country: string;
  state: string;
  property_id: string;
  city: string;
  address: string;
  currency: string;
  status: string;
  decision: string;
  image: string;
  images?: { imageUrl: string }[];
};

const columns: ColumnDef<Property>[] = [
  {
    accessorKey: "title",
    header: "Titre",
    cell: ({ row }) => {
      const title = row.getValue("title") as string; // Explicitly cast to string
      const truncatedTitle =
        title.length > 70 ? title.slice(0, 10) + "..." : title;
      return <div className="lowercase">{truncatedTitle}</div>;
    },
  },

  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string; // Explicitly cast to string
      const truncatedDescription =
        description.length > 70
          ? description.slice(0, 70) + "..."
          : description;
      return <div className="lowercase">{truncatedDescription}</div>;
    },
  },

  {
    accessorKey: "country",
    header: "Pays",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("country")}</div>
    ),
  },
  {
    accessorKey: "state",
    header: "Departement",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("state")}</div>
    ),
  },

  {
    accessorKey: "city",
    header: "Ville",
    cell: ({ row }) => <div className="capitalize">{row.getValue("city")}</div>,
  },

  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as string | number; // Explicit type assertion
      const currency = row.getValue("currency") as string;
      const type = row.getValue("type") as string;

      return (
        <div className="text-right font-medium">
          {price && price !== "0.00"
            ? currency === "USD"
              ? `$${price}`
              : price
            : ""}
        </div>
      );
    },
  },

  {
    accessorKey: "currency",
    header: "Monnaie",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("currency")}</div>
    ),
  },

  {
    accessorKey: "decision",
    header: "Decision",
    cell: ({ row }) => (
      <div className="capitalize text-sm">{row.getValue("decision")}</div>
    ),
  },

  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <div className="capitalize text-sm">
          {status === "open" ? (
            <SiProgress className="text-sky-500" />
          ) : (
            <FaPowerOff className="text-rose-500" />
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "images", // Assuming the field name is "images" in your data
    header: "Aperçu",
    cell: ({ row }) => {
      // Get the images array from the row
      const imagesArray = Array.isArray(row.original.images)
        ? row.original.images
        : [];

      const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

      // Define your base API URL
      const baseUrl = api_url; // Adjust this as per your actual API URL

      const propertyId = row.original.property_id;

      // Function to handle edit click
      const handlePropertyView = () => {
        localStorage.setItem("propertyId", row.original.id);
        window.location.href = `/properties/${propertyId}`;
      };

      // Get the first image URL or set a default image if no images exist
      const firstImage =
        imagesArray.length > 0
          ? `${imagesArray[0].imageUrl}`
          : "/images/espaslink.png";

      return (
        <div>
          <img
            onClick={handlePropertyView}
            src={firstImage}
            alt="Property"
            // width={190}
            // height={190}
            className="w-16 h-16 object-cover rounded-md cursor-pointer"
          />
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const propertyId = row.original.property_id;

      // Function to handle edit click
      const handleEditClick = () => {
        // Redirect to the update page using window.location
        localStorage.setItem("propertyId", row.original.id);
        localStorage.setItem("propertyUser", row.original.user);
        window.location.href = `/update/${propertyId}`;
      };

      // Function to handle delete click
      const handleDeleteClick = () => {
        // Perform delete operation (you can also show a confirmation modal here)
        localStorage.setItem("propertyId", row.original.id);
        localStorage.setItem("propertyUser", row.original.user);
        window.location.href = `/delete/${propertyId}`;
        // You can call your API to delete the property
      };

      return (
        <div className="flex space-x-4">
          <HiOutlinePencilSquare
            className="text-sky-600 cursor-pointer"
            onClick={handleEditClick} // Redirect to edit page
          />
          <FaRegTrashCan
            className="text-rose-500 cursor-pointer"
            onClick={handleDeleteClick} // Trigger delete action
          />
        </div>
      );
    },
  },
];

const MyList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [googleData, setGoogleData] = useState("");

  const [verification, setVerification] = useState(false);

  const token = getToken();
  const router = useRouter();

  const table = useReactTable({
    data: allProperties,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  });

  console.log("All properties: ", allProperties);

  useEffect(() => {
    if (!token) {
      setVerification(true);
      router.push("/login");
    }
  }, [router, token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getUserProperties();
        console.log("The property list : ", result);
        setAllProperties(result?.properties); // Set propertyState with the fetched result
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (verification) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="flex flex-col items-center">
          {/* Pulsing dot animation */}
          <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse mb-2"></div>
          {/* Optional text */}
          <span className="text-gray-600">Vérification...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex-1 p-10 text-gray-100 z-60 overflow-y-auto ${
          isSidebarOpen ? "" : "w-full"
        } md:ml-64 relative z-60`}
      >
        {/* Mobile Menu Button */}
        {/* Mobile Menu Button */}
        <button
          className="fixed top-20 left-2 mt-1  z-50 flex items-center space-x-2 rounded-lg   text-white transition-color md:hidden"
          onClick={toggleSidebar}
        >
          {/* <CiMenuKebab /> */}
          <CiMenuKebab className="text-2xl" />
        </button>

        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Mes listes de propriétés
          </h2>
        </div>

        {/* Content Container */}
        <div className="w-full backdrop-blur-xl rounded-2xl bg-gradient-to-br from-blue-900/40 to-blue-800/30 border border-white/10 p-6 shadow-2xl">
          {/* Filter Input */}
          <div className="flex items-center py-4 mb-6">
            <Input
              placeholder="Filter by title"
              value={
                (table.getColumn("title")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="max-w-sm border-white/20 bg-white/5 focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-gray-400 text-white"
            />
          </div>

          {/* Table Container */}
          <div className="rounded-xl border border-white/20 overflow-hidden bg-gradient-to-br from-blue-900/30 to-blue-800/20">
            <Table>
              <TableHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className=" border-b border-white/10"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-cyan-300 font-bold py-4"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="border-b border-white/10 transition-colors duration-200"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="py-3.5 text-gray-200"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-white"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyList;
