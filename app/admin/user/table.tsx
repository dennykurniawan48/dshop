'use client'
import React, { useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component';

type DataRow={
    name: string | null, email: string | null
}

function Table(props: {data: DataRow[]}) {
    const [query, setQuery] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] =
      React.useState(false);
    const filteredItems = props.data.filter(
      (item) => item.name && item.name.toLowerCase().includes(query.toLowerCase())
    );
  
    const columns: TableColumn<DataRow>[] = [
      {
        name: "Image",
        cell: (row) => <img src='/avatar.svg' className=" w-16 h-16 p-2" />,
      },
      {
        name: "Name",
        selector: (row) => row.name ?? '',
      },
      {
        name: "Email",
        selector: (row) => {
            const emailArr = row.email!.split("@")
            return "*******@"+emailArr[1]
      }
    }
    ];
  
    return (
      <div className="w-full px-4 my-2">
        <h3 className="text-2xl font-bold">List User</h3>
        <DataTable
          columns={columns}
          data={filteredItems}
          pagination
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          subHeaderComponent={
            <div className="w-full flex justify-end mt-12">
              
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
      </div>
    );
}

export default Table