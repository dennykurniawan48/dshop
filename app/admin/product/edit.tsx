import { StatusLoading } from "@/app/utils/enum/StatusLoading";
import productSchema from "@/app/utils/schema/product/product";
import { useFormik } from "formik";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React, { useEffect, useState } from "react";

type Category = { id: string; name: string; thumbnail: string };

function Edit(props: {
  open: boolean;
  id: string;
  closeModal: () => void;
  cat: Category[];
  router: AppRouterInstance
}) {
  const [data, setData] = useState({
    name: "",
    price: 0,
    categoryId: "",
    availableStock: 0,
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    desc: "",
  });
  const [statusFirstLoading, setStatusFirstLoading] = useState<StatusLoading>(
    StatusLoading.Idle
  );
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<StatusLoading>(
    StatusLoading.Idle
  );
  const [errorDisabled, setErrorDisabled] = useState(false);
  const [initialValues, setInitialValue] = useState({
    productname: "",
    price: 0,
    category: "",
    stock: 0,
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    desc: "",
  });

  const editProduct = useFormik({
    initialValues,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: async (values) => {
      //   console.log(values);
        if (statusUpdateLoading == StatusLoading.Loading || errorDisabled) {
          // do nothing on loading to login
          return;
        }
        setStatusUpdateLoading(StatusLoading.Loading);
        fetch("/api/product", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...values, id: props.id}),
        })
          .then((res) => {
            if (res.ok) {
              setStatusUpdateLoading(StatusLoading.Success);
              return res.json();
            }
          })
          .then((res) => {console.log(res.data)
        props.router.refresh()})
          .catch((err) => setStatusUpdateLoading(StatusLoading.Error));
    },
    validationSchema: productSchema,
  });

  useEffect(() => {
    if(statusUpdateLoading === StatusLoading.Success){
        props.closeModal()
        setStatusUpdateLoading(StatusLoading.Idle)
    }
  }, [statusUpdateLoading])

  useEffect(() => {
    if (statusFirstLoading === StatusLoading.Success) {
      setInitialValue({
        productname: data.name,
        price: data.price,
        category: data.categoryId,
        stock: data.availableStock,
        image1: data.image1,
        image2: data.image2,
        image3: data.image3,
        image4: data.image4,
        desc: data.desc,
      });
    }
  }, [data, statusFirstLoading]);

  useEffect(() => {
    setStatusFirstLoading(StatusLoading.Loading);
    fetch(`/api/product/${props.id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((res) => {
        setData(res.data);
        setStatusFirstLoading(StatusLoading.Success);
      })
      .catch((err) => {
        console.log(err);
        setStatusFirstLoading(StatusLoading.Error);
      });
  }, [props.id]);
  return (
    <div
      className={`fixed inset-0 transition-colors flex justify-center items-start overflow-y-scroll ${
        props.open
          ? "visible bg-gray-200/70 scale-100 bg-opacity-60"
          : "invisible scale-0 opacity-0"
      }`}
    >
      {statusFirstLoading === StatusLoading.Success && (
        <form
          onSubmit={editProduct.handleSubmit}
          className="px-6 py-4 rounded-lg bg-white grid grid-cols-2 gap-2 w-2/4"
        >
          <div className="flex justify-between col-span-2">
            <span>Update Product</span>
            <button
              onClick={() => {
                props.closeModal();
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
              onBlur={editProduct.handleBlur}
              onChange={editProduct.handleChange}
              value={editProduct.values.productname}
              className="px-3 py-1 w-full rounded-md outline-none border border-gray-300"
            />
            {editProduct.touched.productname &&
              editProduct.errors.productname && (
                <span className="text-xs text-red-500">
                  {editProduct.errors.productname}
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
                onBlur={editProduct.handleBlur}
                onChange={editProduct.handleChange}
                value={editProduct.values.price}
                step={0.01}
                className="px-1 py-1 w-full rounded-md outline-none"
              />
            </div>
            {editProduct.touched.price && editProduct.errors.price && (
              <span className="text-xs text-red-500">
                {editProduct.errors.price}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-500">Category</label>
            <select
              onBlur={editProduct.handleBlur}
              onChange={editProduct.handleChange}
              value={editProduct.values.category}
              name="category"
              id="category"
              className="outline-none border border-gray-300 px-3 py-1"
            >
              <option value={""}>Select Category</option>
              {props.cat
                .filter((cat) => cat.id != "all")
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
            {editProduct.touched.category && editProduct.errors.category && (
              <span className="text-xs text-red-500">
                {editProduct.errors.category}
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
                onBlur={editProduct.handleBlur}
                onChange={editProduct.handleChange}
                value={editProduct.values.stock}
                step={1}
                className="px-1 py-1 w-full rounded-md outline-none"
              />
            </div>
            {editProduct.touched.stock && editProduct.errors.stock && (
              <span className="text-xs text-red-500">
                {editProduct.errors.stock}
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
              onBlur={editProduct.handleBlur}
              onChange={editProduct.handleChange}
              value={editProduct.values.image1}
              className="px-3 py-1 w-full rounded-md outline-none border border-gray-300"
            />
            {editProduct.touched.image1 && editProduct.errors.image1 && (
              <span className="text-xs text-red-500">
                {editProduct.errors.image1}
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
              onBlur={editProduct.handleBlur}
              onChange={editProduct.handleChange}
              value={editProduct.values.image2}
              className="px-3 py-1 w-full rounded-md outline-none border border-gray-300"
            />
            {editProduct.touched.image2 && editProduct.errors.image2 && (
              <span className="text-xs text-red-500">
                {editProduct.errors.image2}
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
              onBlur={editProduct.handleBlur}
              onChange={editProduct.handleChange}
              value={editProduct.values.image3}
              className="px-3 py-1 w-full rounded-md outline-none border border-gray-300"
            />
            {editProduct.touched.image3 && editProduct.errors.image3 && (
              <span className="text-xs text-red-500">
                {editProduct.errors.image3}
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
              onBlur={editProduct.handleBlur}
              onChange={editProduct.handleChange}
              value={editProduct.values.image4}
              className="px-3 py-1 w-full rounded-md outline-none border border-gray-300"
            />
            {editProduct.touched.image4 && editProduct.errors.image4 && (
              <span className="text-xs text-red-500">
                {editProduct.errors.image4}
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
              onBlur={editProduct.handleBlur}
              onChange={editProduct.handleChange}
              value={editProduct.values.desc}
              className="px-3 py-1 w-full rounded-md outline-none border border-gray-300"
            />
            {editProduct.touched.desc && editProduct.errors.desc && (
              <span className="text-xs text-red-500">
                {editProduct.errors.desc}
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
                props.closeModal();
              }}
              className="px-3 py-2 bg-red-500 text-white"
            >
              Cancel
            </button>
            <button type="submit" className="px-3 py-2 bg-green-500 text-white">
              Update
            </button>
          </div>
        </form>
      )}
      {statusFirstLoading === StatusLoading.Loading && <span>Loading...</span>}
    </div>
  );
}

export default Edit;
