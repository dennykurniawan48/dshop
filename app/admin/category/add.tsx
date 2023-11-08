import { StatusLoading } from "@/app/utils/enum/StatusLoading";
import { categorySchema } from "@/app/utils/schema/category/category";
import { useFormik } from "formik";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React, { useEffect, useState } from "react";

function Add(props: {
  open: boolean;
  closeModal: () => void;
  router: AppRouterInstance;
}) {
  const [statusLoading, setStatusLoading] = useState(StatusLoading.Idle);
  const [errorDisabled, setErrorDisabled] = useState(false);

  useEffect(() => {
    if(statusLoading === StatusLoading.Success){
        props.closeModal()
        props.router.refresh();
        setStatusLoading(StatusLoading.Idle)
    }
  }, [statusLoading])

  const addCategory = useFormik({
    initialValues: {
      name: "",
      thumbnail: "",
    },
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: async (values) => {
      //   console.log(values);
      if (statusLoading == StatusLoading.Loading || errorDisabled) {
        // do nothing on loading to login
        return;
      }
      setStatusLoading(StatusLoading.Loading);
      fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => {
          if (res.ok) {
            setStatusLoading(StatusLoading.Success);
            return res.json();
          }
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => setStatusLoading(StatusLoading.Error));
    },
    validationSchema: categorySchema,
  });

  return (
    <div
      className={`fixed inset-0 transition-colors flex justify-center items-center z-10 overflow-y-scroll ${
        props.open
          ? "visible scale-100 bg-opacity-60 bg-gray-400"
          : "invisible scale-0 opacity-0"
      }`}
    >
      <form className="w-1/3 p-4 bg-white rounded-lg flex flex-col space-y-4" onSubmit={addCategory.handleSubmit}>
        <div className="flex justify-between items-center space-y-2">
          <span>Add Category</span>
          <button
            type="button"
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
          <label className="text-sm">Category Name</label>
          <input
            type="text"
            name="name"
            id="name"
            onBlur={addCategory.handleBlur}
              onChange={addCategory.handleChange}
              value={addCategory.values.name}
            className=" border border-gray-300 outline-none px-3 py-1"
            placeholder="Category Name"
          />
           {addCategory.touched.name &&
              addCategory.errors.name && (
                <span className="text-xs text-red-500">
                  {addCategory.errors.name}
                </span>
              )}
        </div>
        <div className="flex flex-col space-y-2">
          <label>Thumbnail</label>
          <input
            type="text"
            name="thumbnail"
            id="thumbnail"
            onBlur={addCategory.handleBlur}
              onChange={addCategory.handleChange}
              value={addCategory.values.thumbnail}
            className=" border border-gray-300 outline-none px-3 py-1"
            placeholder="Thumbnail Link"
          />
          {addCategory.touched.thumbnail &&
              addCategory.errors.thumbnail && (
                <span className="text-xs text-red-500">
                  {addCategory.errors.thumbnail}
                </span>
              )}
        </div>
        <div className="flex w-full justify-around mt-14">
          <button
          type="button"
            onClick={() => {
              props.closeModal();
            }}
            className="bg-red-600 px-4 py-2 text-white"
          >
            Close
          </button>
          <button className="bg-green-600 px-4 py-2 text-white" type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}

export default Add;
