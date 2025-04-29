
"use client"

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
  import { HiOutlinePencilSquare } from "react-icons/hi2";
  import { FaRegTrashCan } from "react-icons/fa6";

  import { fetchProperties, getAllVirtualCard, getTotalSales, getRevenue, getUserProfile, getMembershipPlans, getDailyTransactions, getAllUserProfile, getId } from "../api/action";
  
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { useEffect, useState } from "react";
  
  

type Property = {
  id: string;
  user: string;
  firstname: string;
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
      console.log("propertyId: ", propertyId);

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



export default function FetchAllProperties() {

  const [isMounted, setIsMounted] = useState(false);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [cards, setCards] = useState([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  
    const fetchAllProperties = async () => {
      try {
        const response = await fetchProperties();
        setAllProperties(response);
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    };
  
  
    useEffect(() => {
        fetchAllProperties();
    }, []);
  

      const filteredCards = cards.filter((card) =>
        `${card.firstname} ${card.lastname}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    
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

     return (
           <div className={`mt-4`}>
        <div
        className="md:hidden flex items-center space-x-2 p-2 mb-4 w-10
                    text-blue-800 border border-blue-800 
                rounded-md cursor-pointer hover:bg-blue-800 
                hover:text-white transition-colors duration-300"
        >
        <RiMenuFold3Fill className="text-xl" />
        </div>
        <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">
            {" "}
            listes des propriétés
        </h2>
        </div>

        <div className="w-full">
        <div className="flex items-center py-4">
            <Input
            placeholder="Filter by title"
            value={
                (table.getColumn("title")?.getFilterValue() as string) ??
                ""
            }
            onChange={(event) =>
                table
                .getColumn("title")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
        </div>

        <div className="rounded-md border">
            <Table>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-bold cyber-font bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
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
                {table.getRowModel()?.rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    >
                    {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
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
                    className="h-24 text-center"
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
)
}