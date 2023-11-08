import { prisma } from '@/app/utils/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react'

async function Page(props: { params: { id: string } }) {
    const data = await prisma.order.findUnique({
      where: { id: props.params.id },
      include: {
        detailorder: {
          select: {
            id: true,
            price: true,
            qty: true,
            addReview: true,
            products: { select: { image1: true, name: true } },
          },
        },
        status: true,
        state: {
            include: {
                country: true
            }
        }
      },
    });
  
    if (!data) {
      notFound();
    }
  
    return (
      <>
      <div className='flex space-x-8 px-8 py-4'>
            <Link href={`/admin/order`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
</svg>

            </Link>
            <span className='font-bold'>Detail Order</span>
          </div>
        <div className="w-full flex justify-center lg:px-8 py-4 mt-12 flex-col md:flex-row md:space-x-24">
          <div className="border border-gray-500 w-full md:w-3/5 p-4 rounded-md flex flex-col space-y-6">
            <div className="flex flex-col space-y-2 text-sm text-gray-500">
              <span>Created at: {data.createdAt.toLocaleString()}</span>
              <span>Status: {data.status.status_name}</span>
            </div>
            {data?.detailorder.map((item) => (
              <div className="flex flex-col space-y-3"  key={item.id}>
                <div className="w-full flex flex-row space-x-6">
                  <img src={item.products.image1} className="w-24" />
                  <div className="flex flex-col space-y-3 justify-center">
                    <span className="text-xl font-bold">
                      {item.products.name}
                    </span>
                    <div>
                      <span>
                        ${item.price} x {item.qty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className='flex flex-col text-sm text-gray-600'>
            <span>User name: {data.fullName}</span>
              <span>State: {data.state.name} - {data.state.country.name}  - {data.zipCode}</span>
              <span>Address: {data.address}</span>
            </div>
            <div className='flex justify-end'>
                <span className='text-lg font-bold'>Total: ${data.total+data.discount}</span>
            </div>
          </div>
          <div className="md:w-2/5 flex flex-col space-y-6">
            <ol className="relative text-gray-500 border-l border-gray-200 dark:border-gray-700 dark:text-gray-400">
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-white rounded-full -left-4 ring-4 ring-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 fill-gray-300"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
                <h3 className="font-medium leading-tight text-gray-600">
                  Order created
                </h3>
                <p className="text-sm">{data.createdAt.toLocaleString()}</p>
              </li>
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-white rounded-full -left-4 ring-4 ring-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 fill-gray-600"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                    />
                  </svg>
                </span>
                <h3 className="font-medium leading-tight text-gray-600">
                  Waiting for payment
                </h3>
                <p className="text-sm">{data.createdAt.toLocaleString()}</p>
              </li>
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-white rounded-full -left-4 ring-4 ring-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 fill-gray-200"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                    />
                  </svg>
                </span>
                <h3 className="font-medium leading-tight text-gray-600">
                  In delivery
                </h3>
                <p className="text-sm">{data.createdAt.toLocaleString()}</p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-white rounded-full -left-4 ring-4 ring-gray-600">
                  <svg
                    className="w-3.5 h-3.5 text-gray-500 fill-gray-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 20"
                  >
                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
                  </svg>
                </span>
                <h3 className="font-medium leading-tight text-gray-600">
                  Complete
                </h3>
                <p className="text-sm">{data.createdAt.toLocaleString()}</p>
              </li>
            </ol>
          </div>
        </div>
      </>
    );
                }

export default Page