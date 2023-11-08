"use client";
import { StatusLoading } from "@/app/utils/enum/StatusLoading";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import Loading from "../loading";

type DataRow = {
  status: {
    id: string;
    status_name: string;
  };
} & {
  id: string;
  fullName: string;
  address: string;
  discount: number;
  deliveryCost: number;
  zipCode: string;
  total: number;
  stateId: string;
  userId: string;
  statusId: string;
  deliveryId: string;
  paid: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function Table() {
  const [data, setData] = useState<DataRow[]>([]);
  const [query, setQuery] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const filteredItems = data.filter(
    (item) =>
      item.fullName && item.fullName.toLowerCase().includes(query.toLowerCase())
  );
  const [status, setStatus] = useState<StatusLoading>(StatusLoading.Idle);

  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  );

  useEffect(() => {
    setStatus(StatusLoading.Loading);
    fetch(`/api/admin/order?start=${startDate}&end=${endDate}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((res) => {
        setData(res.data);
        setStatus(StatusLoading.Success);
      })
      .catch((err) => {
        console.log(err);
        setStatus(StatusLoading.Error);
      });
  }, [startDate, endDate]);

  const columns: TableColumn<DataRow>[] = [
    {
      name: "Name",
      selector: (row) => row.fullName,
    },
    {
      name: "Date",
      selector: (row) => row.createdAt.toLocaleString(),
    },
    {
      name: "Status",
      selector: (row) => row.status.status_name,
    },
    {
      name: "Total",
      selector: (row) => "$" + row.total,
    },
    {
      name: "Action",
      cell: (row) => (
        <Link
          href={`/admin/order/${row.id}`}
          id={row.id}
          className="px-3 py-2 bg-blue-500 rounded-md text-white"
        >
          Detail
        </Link>
      ),
    },
  ];

  return (
    <div className="w-full px-4 my-2">
      {status === StatusLoading.Loading && <Loading />}
      {status === StatusLoading.Success && (
        <>
          <h3 className="text-2xl font-bold">List Order</h3>
          <DataTable
            columns={columns}
            data={filteredItems}
            pagination
            paginationResetDefaultPage={resetPaginationToggle}
            subHeader
            subHeaderComponent={
              <div className="w-full flex justify-between mt-12">
                <div className="flex flex-row space-x-4">
                  <DatePicker
                    className="w-32 outline-none border border-gray-300"
                    dateFormat="dd/MM/yyyy"
                    showIcon
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 48 48"
                      >
                        <mask id="ipSApplication0">
                          <g
                            fill="none"
                            stroke="#fff"
                            strokeLinejoin="round"
                            strokeWidth="4"
                          >
                            <path
                              strokeLinecap="round"
                              d="M40.04 22v20h-32V22"
                            ></path>
                            <path
                              fill="#fff"
                              d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
                            ></path>
                          </g>
                        </mask>
                        <path
                          fill="currentColor"
                          d="M0 0h48v48H0z"
                          mask="url(#ipSApplication0)"
                        ></path>
                      </svg>
                    }
                  />
                  <DatePicker
                    className="w-32 outline-none border border-gray-300"
                    dateFormat="dd/MM/yyyy"
                    showIcon
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 48 48"
                      >
                        <mask id="ipSApplication0">
                          <g
                            fill="none"
                            stroke="#fff"
                            strokeLinejoin="round"
                            strokeWidth="4"
                          >
                            <path
                              strokeLinecap="round"
                              d="M40.04 22v20h-32V22"
                            ></path>
                            <path
                              fill="#fff"
                              d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
                            ></path>
                          </g>
                        </mask>
                        <path
                          fill="currentColor"
                          d="M0 0h48v48H0z"
                          mask="url(#ipSApplication0)"
                        ></path>
                      </svg>
                    }
                  />
                </div>
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
        </>
      )}
    </div>
  );
}

export default Table;
