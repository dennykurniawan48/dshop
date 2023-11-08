"use client";
import React, { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Add from "./add";
import { StatusLoading } from "@/app/utils/enum/StatusLoading";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import productSchema from "@/app/utils/schema/product/product";
import Edit from "./edit";
import { useSession } from "next-auth/react";

type DataRow = {
  id: string;
  name: string;
  price: number;
  image1: string;
  isActive: boolean;
};

type Category = { id: string; name: string; thumbnail: string };

function Page() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [data, setData] = useState<DataRow[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [errorDisabled, setErrorDisabled] = useState(true);
  const [addStatus, setAddStatus] = useState<StatusLoading>(StatusLoading.Idle);

  const [isAddOpen, setisAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedIdEdit, setSelectedIdEdit] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const { data: session, status } = useSession();
   useEffect(() => {
    console.log(session)
      if(status === 'unauthenticated'){
        router.replace("/admin/login")
      }else if(status === "authenticated" && !session?.user?.is_admin){
        router.replace("/admin/login")
      }
   }, [session, status])

  const fetchUsers = async (page: number) => {
    setLoading(true);

    fetch(
      `/api/product?page=${page}&limit=${perPage}&active=false&query=${query}`
    ).then((res) => {
      if (res.ok) {
        return res.json()
      }
    }).then((res) => {
      const newData: DataRow[] = res.data.products
      console.log(newData)
      setData(newData);
      setTotalRows(res.data.total);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchUsers(1)
  }, [query])

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    setLoading(true);
    setPerPage(newPerPage)

    fetch(
      `/api/product?page=${page}&limit=${perPage}&active=false&query=${query}`
    ).then((res) => {
      if (res.ok) {
        return res.json()
      }
    }).then((res) => {
      const newData: DataRow[] = res.data.products
      console.log(newData)
      setData(newData);
      setTotalRows(res.data.total);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!isEditOpen) {
      setSelectedIdEdit("");
    }
  }, [isEditOpen]);

  useEffect(() => {
    if (addStatus === StatusLoading.Success) {
      setAddStatus(StatusLoading.Idle);
      setisAddOpen(false);
    }
  }, [addStatus]);

  const addProduct = useFormik({
    initialValues: {
      productname: "",
      price: 0,
      category: "",
      stock: 0,
      image1: "",
      image2: "",
      image3: "",
      image4: "",
      desc: "",
    },
    onSubmit: async (values) => {
      console.log(values);
      if (addStatus == StatusLoading.Loading || errorDisabled) {
        // do nothing on loading to login
        return;
      }
      setAddStatus(StatusLoading.Loading);
      fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => {
          if (res.ok) {
            setAddStatus(StatusLoading.Success);
            return res.json();
          }
        })
        .then((res) => {
          console.log(res);
          router.refresh();
        })
        .catch((err) => setAddStatus(StatusLoading.Error));
    },
    validationSchema: productSchema,
  });

  const columns: TableColumn<DataRow>[] = [
    {
      name: "Image",
      cell: (row) => <img src={row.image1} className=" w-24 h-24 p-2" />,
    },
    {
      name: "Title",
      selector: (row) => row.name,
    },
    {
      name: "Price",
      selector: (row) => "$" + row.price,
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => {
            setSelectedIdEdit(row.id);
            setIsEditOpen(true);
          }}
          id={row.id}
          className="px-3 py-2 bg-yellow-500 rounded-md text-white"
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="w-full px-4 my-2">
      <h3 className="text-2xl font-bold">List Product</h3>
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
			pagination
			paginationServer
			paginationTotalRows={totalRows}
			onChangeRowsPerPage={handlePerRowsChange}
			onChangePage={handlePageChange}
        subHeader
        subHeaderComponent={
          <div className="w-full flex justify-between mt-12">
            <button
              onClick={() => {
                setisAddOpen(true);
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
        open={isEditOpen}
        id={selectedIdEdit}
        closeModal={() => setIsEditOpen(false)}
        cat={category}
        router={router}
      />
      <Add open={isAddOpen}>
        <form
          onSubmit={addProduct.handleSubmit}
          className="px-6 py-4 rounded-lg bg-white grid grid-cols-2 gap-2 w-2/4 z-10"
        >
          <div className="flex justify-between col-span-2">
            <span>Add</span>
            <button
              onClick={() => {
                setisAddOpen(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-500">Product Name</label>
            <input
              placeholder="Product Name"
              type="text"
              id="produtname"
              name="productname"
              onBlur={addProduct.handleBlur}
              onChange={addProduct.handleChange}
              value={addProduct.values.productname}
              className="px-3 py-1 w-full rounded-md outline-none border border-gray-300"
            />
            {addProduct.touched.productname &&
              addProduct.errors.productname && (
                <span className="text-xs text-red-500">
                  {addProduct.errors.productname}
                </span>
              )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-500">Product Price</label>
            <div className="flex border border-gray-300 justify-center items-center">
              <span className="px-2 py-1 text-md font-bold text-center w-6">
                $
              </span>
              <input
                placeholder="Product Price"
                type="number"
                id="price"
                name="price"
                onBlur={addProduct.handleBlur}
                onChange={addProduct.handleChange}
                value={addProduct.values.price}
                step={0.01}
                className="px-1 py-1 w-full rounded-md outline-none"
              />
            </div>
            {addProduct.touched.price && addProduct.errors.price && (
              <span className="text-xs text-red-500">
                {addProduct.errors.price}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-500">Category</label>
            <select
              onBlur={addProduct.handleBlur}
              onChange={addProduct.handleChange}
              value={addProduct.values.category}
              name="category"
              id="category"
              className="outline-none border border-gray-300 px-3 py-1"
            >
              <option value={""}>Select Category</option>
              {category
                .filter((cat) => cat.id != "all")
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
            {addProduct.touched.category && addProduct.errors.category && (
              <span className="text-xs text-red-500">
                {addProduct.errors.category}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-500">Stock</label>
            <div className="flex border border-gray-300 justify-center items-center">
              <input
                placeholder="Stock"
                type="number"
                name="stock"
                id="stock"
                onBlur={addProduct.handleBlur}
                onChange={addProduct.handleChange}
                value={addProduct.values.stock}
                step={1}
                className="px-1 py-1 w-full rounded-md outline-none"
              />
            </div>
            {addProduct.touched.stock && addProduct.errors.stock && (
              <span className="text-xs text-red-500">
                {addProduct.errors.stock}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-500">Image 1</label>
            <input
              placeholder="Image Link"
              type="text"
              name="image1"
              id="image2"
              onBlur={addProduct.handleBlur}
              onChange={addProduct.handleChange}
              value={addProduct.values.image1}
              className="px-3 py-1 w-full rounded-md outline-none border border-gray-300"
            />
            {addProduct.touched.image1 && addProduct.errors.image1 && (
              <span className="text-xs text-red-500">
                {addProduct.errors.image1}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-500">Image 2</label>
            <input
              placeholder="Image Link"
              type="text"
              name="image2"
              id="image2"
              onBlur={addProduct.handleBlur}
              onChange={addProduct.handleChange}
              value={addProduct.values.image2}
              className="px-3 py-1 w-full rounded-md outline-none border border-gray-300"
            />
            {addProduct.touched.image2 && addProduct.errors.image2 && (
              <span className="text-xs text-red-500">
                {addProduct.errors.image2}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-500">Image 3</label>
            <input
              placeholder="Image Link"
              type="text"
              name="image3"
              id="image3"
              onBlur={addProduct.handleBlur}
              onChange={addProduct.handleChange}
              value={addProduct.values.image3}
              className="px-3 py-1 w-full rounded-md outline-none border border-gray-300"
            />
            {addProduct.touched.image3 && addProduct.errors.image3 && (
              <span className="text-xs text-red-500">
                {addProduct.errors.image3}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-500">Image 4</label>
            <input
              placeholder="Image Link"
              type="text"
              name="image4"
              id="image4"
              onBlur={addProduct.handleBlur}
              onChange={addProduct.handleChange}
              value={addProduct.values.image4}
              className="px-3 py-1 w-full rounded-md outline-none border border-gray-300"
            />
            {addProduct.touched.image4 && addProduct.errors.image4 && (
              <span className="text-xs text-red-500">
                {addProduct.errors.image4}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2 col-span-2">
            <label className="text-sm text-gray-500">Desc</label>
            <textarea
              placeholder="desc"
              rows={4}
              name="desc"
              id="desc"
              onBlur={addProduct.handleBlur}
              onChange={addProduct.handleChange}
              value={addProduct.values.desc}
              className="px-3 py-1 w-full rounded-md outline-none border border-gray-300"
            />
            {addProduct.touched.desc && addProduct.errors.desc && (
              <span className="text-xs text-red-500">
                {addProduct.errors.desc}
              </span>
            )}
          </div>
          <div className="flex w-full col-span-2 my-4">
            {errorDisabled && (
              <div
                className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm"
                role="alert"
              >
                <strong className="font-bold">
                  Sorry, add data is disabled on demo.
                </strong>
              </div>
            )}
          </div>
          <div className="flex justify-around col-span-2">
            <button
              onClick={() => {
                setisAddOpen(false);
              }}
              className="px-3 py-2 bg-red-500 text-white"
            >
              Cancel
            </button>
            <button type="submit" className="px-3 py-2 bg-green-500 text-white">
              Add
            </button>
          </div>
        </form>
      </Add>
    </div>
  );
}

export default Page;
