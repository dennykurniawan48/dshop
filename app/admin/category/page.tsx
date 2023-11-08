"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable, { TableColumn } from "react-data-table-component";
import Edit from "./edit";
import Add from "./add";
import { useSession } from "next-auth/react";

type DataRow = {
  id: string;
  name: string;
  thumbnail: string;
};

async function Page() {
  const [query, setQuery] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [data, setData] = useState<DataRow[]>([]);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedEditCategory, setSelectedEditCategory] =
    useState<DataRow | null>(null);
  const router = useRouter();

  const { data: session, status } = useSession();
   useEffect(() => {
    console.log(session)
      if(status === 'unauthenticated'){
        router.replace("/admin/login")
      }else if(status === "authenticated" && !session?.user?.is_admin){
        router.replace("/admin/login")
      }
   }, [session, status])

  useEffect(() => {
    if (!isLoading) {
      fetch("/api/category")
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((res) => {
          setData(res.data);
        });
    }
  }, [isLoading]);

  const columns: TableColumn<DataRow>[] = [
    {
      name: "Image",
      cell: (row) => <img src={row.thumbnail} className="w-16 h-16" />,
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => {
            setSelectedEditCategory(row);
            setIsOpenEditModal(true);
          }}
          className="px-3 py-2 bg-yellow-500 text-white"
        >
          Edit
        </button>
      ),
    },
  ];
  return (
    <div className="w-full px-4 my-2">
      <h3 className="text-2xl font-bold">List Category</h3>
      <DataTable
        columns={columns}
        data={data}
        progressPending={isLoading}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={
          <div className="w-full flex justify-between mt-12">
            <button
              onClick={() => {
                setIsOpenAddModal(true);
              }}
              className="px-3 py-2 bg-green-500 rounded-sm text-white flex space-x-3 items-center justify-center text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span>Add Product</span>
            </button>
            <input
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              value={query}
              className="px-2 py-1 border border-gray-300 focus:outline-purple-600"
              placeholder="Search"
            />
          </div>
        }
        className="w-full"
      />
      <Edit
        open={isOpenEditModal}
        closeModal={() => setIsOpenEditModal(false)}
        router={router}
        selectedCategory={selectedEditCategory}
      />
      <Add
        open={isOpenAddModal}
        closeModal={() => {
          setIsOpenAddModal(false);
        }}
        router={router}
      />
    </div>
  );
}

export default Page;
