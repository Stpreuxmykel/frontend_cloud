
"use client"

import { fetchProperties, getAllVirtualCard, getTotalSales, getRevenue, getUserProfile, getMembershipPlans, getDailyTransactions, getAllUserProfile } from "../api/action";

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
import { useEffect, useState } from "react";
import { getToken } from "../lib/auth";
import { HiOutlinePencil, FaRegTrashCan } from "react-icons/hi2";



type Property = {
  id: string;
  address: string;
  lastname: string;
  firstname: string;
  country: string;
  city: string;
  state: string;
  createdat: string;
  image: string;
  images?: { imageUrl: string }[];
};

const columns: ColumnDef<Property>[] = [
  {
    accessorKey: "firstname",
    header: "Firstname",
    cell: ({ row }) => {
      const firstname = row.getValue("firstname") as string; // Explicitly cast to string
      const truncatedFirstname =
      firstname.length > 70 ? firstname.slice(0, 10) + "..." : firstname;
      return <div className="lowercase">{truncatedFirstname}</div>;
    },
  },

  {
    accessorKey: "lastname",
    header: "Lastname",
    cell: ({ row }) => {
      const lastname = row.getValue("lastname") as string; // Explicitly cast to string
      const truncatedLastname =
        lastname.length > 70
          ? lastname.slice(0, 10) + "..."
          : lastname;
      return <div className="lowercase">{truncatedLastname}</div>;
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

//   {
//     accessorKey: "images", // Assuming the field name is "images" in your data
//     header: "Aperçu",
//     cell: ({ row }) => {
//       // Get the images array from the row
//       const imagesArray = Array.isArray(row.original.images)
//         ? row.original.images
//         : [];

//       const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

//       // Define your base API URL
//       const baseUrl = api_url; // Adjust this as per your actual API URL

//       const propertyId = row.original.property_id;
//       console.log("propertyId: ", propertyId);

//       // Function to handle edit click
//       const handlePropertyView = () => {
//         localStorage.setItem("propertyId", row.original.id);
//         window.location.href = `/properties/${propertyId}`;
//       };

//       // Get the first image URL or set a default image if no images exist
//       const firstImage =
//         imagesArray.length > 0
//           ? `${imagesArray[0].imageUrl}`
//           : "/images/espaslink.png";

//       return (
//         <div>
//           <img
//             onClick={handlePropertyView}
//             src={firstImage}
//             alt="Property"
//             // width={190}
//             // height={190}
//             className="w-16 h-16 object-cover rounded-md cursor-pointer"
//           />
//         </div>
//       );
//     },
//   },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const userId = row.original.id;
      const active = row.original.is_active;

   

      const handleActivation = async (id, active) => {
        try {
          const res = await fetch('http://localhost:8000/api/toggle-activation/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // make sure token is defined
            },
            body: JSON.stringify({
              user_id: id,   // make sure userId is defined
              is_active: active // make sure isActive is a boolean
            }),
          });
      
          if (!res.ok) throw new Error('Something went wrong');
      
          const data = await res.json();
          console.log('Activation toggled:', data);
          return data;
        } catch (err) {
          console.error('Toggle user error:', err);
          throw err;
        }
      };

   

      return (
        <div className="flex space-x-4">
          <HiOutlinePencil
            className="text-sky-600 cursor-pointer"
           
          />
          <FaRegTrashCan
            className="text-rose-500 cursor-pointer"
         
          />
        </div>
      );
    },
  },
];

export default function FetchAllUsers () {

    const [allUserProfile, setAllUserProfile] = useState([])
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    console.log(" allUserProfile componnent: ", allUserProfile)

    const token = getToken();

      const fetchAllUserProfile = async () => {
        try {
          const all_users_profile = await getAllUserProfile();       
          console.log("all_users  : ", all_users_profile);
          setAllUserProfile(all_users_profile);
        } catch (error) {
          console.error("Error fetching cards :", error);
        }
      };


 
      
     

    useEffect(() => {
        fetchAllUserProfile()
    }, []);



      const table = useReactTable({
        data: allUserProfile,
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
    
      return(

            <>
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
                    listes des utilisateurs 
                </h2>
                </div>

                <div className="w-full">
                <div className="flex items-center py-4">
                    <Input
                    placeholder="Filter by title"
                    value={
                        (table.getColumn("firstname")?.getFilterValue() as string) ??
                        ""
                    }
                    onChange={(event) =>
                        table
                        .getColumn("firstname")
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
            </>
      )
}