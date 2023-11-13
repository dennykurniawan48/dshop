"use client";
import { data } from "autoprefixer";
import { type } from "os";
import React, { useEffect, useState } from "react";

function DetailReview(props: {
  data:
    | ({
        id: string;
        name: string;
        price: number;
        categoryId: string;
        image1: string;
        image2: string;
        image3: string;
        image4: string;
        desc: string;
        averageRating: number | null;
        availableStock: number;
        isActive: boolean;
      })
    | null;
}) {
  
  type Review = {
    comment: string,
    rating: number,
    user: {
      name: string,
      image: string | null
    }
  }
  const [isDetail, setIsDetail] = useState(true);
  const [ratings, setRatings] = useState<{ rating: number, count: number }[]>([{rating: 1, count: 0},{rating: 2, count: 0},{rating: 3, count: 0},{rating: 4, count: 0},{rating: 5, count: 0}]);
  const [totalReview, setTotalReview] = useState(0);
  const [allReview, setAllReview] = useState<Review[]>([])

  useEffect(() => {
    fetch(`/api/review?productId=${props.data?.id}&limit=5`).then(res => {if(res.ok){
      return res.json()
    }}).then(res => {
      setRatings(res.data.star)
      setTotalReview(res.data.total)
      setAllReview(res.data.review)
    }).catch(err => console.log("error"))
  }, []);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-col-reverse space-y-6 md:flex-row">
        <div className="w-full md:w-3/5 mt-4 flex flex-col space-y-3 text-sm font-normal">
            <div className="flex flex-row mt-12 space-x-1">
        <button
          className={`${
            isDetail && "bg-purple-400 text-white"
          } border border-gray-500 rounded-t-md px-2 py-1`}
          onClick={() => {
            setIsDetail(true);
          }}
        >
          Details
        </button>
        <button
          className={`${
            !isDetail && "bg-purple-400 text-white"
          } border border-gray-500 rounded-t-md px-2 py-1`}
          onClick={() => {
            setIsDetail(false);
          }}
        >
          Reviews
        </button>
      </div>
            {isDetail && props.data?.desc.split("\n").map((d, index) => (
              <div key={index}>{d}</div>
            ))}
            {!isDetail &&
            allReview.map((review, index) => (
              <div
              key={index}
              className="w-full flex flex-row space-x-2"
            >
              <img src="/avatar.svg" className=" w-12 h-12"/>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col justify-center space-y-1">
                <span className="text-sm">{review.user.name}</span>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-4 h-4 mr-2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>{" "}
                    <span className="text-xs">{review.rating}</span>
                  </div>
                </div>
                <span>{review.comment}</span>
              </div>
              </div>
            ))}
          </div>        
        
        <div className="flex flex-col md:w-2/5 space-y-3">
          <div className="flex items-center justify-between w-full">
            <div className="space-x-1 flex flex-row">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="fill-yellow-400 w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </div>
            <div className="text-black text-xl ml-2">
              {Math.round((props.data?.averageRating ?? 0) * 10) / 10}
            </div>
          </div>
          {ratings.map((item, index) => {
            return (
              <div
                key={index}
                className="flex flex-row space-x-4 items-center justify-center"
              >
                <span>{item.rating}</span>{" "}
                <div className="h-1 bg-gray-600 flex-1">
                  <div
                    className="h-1 bg-purple-600 flex-1"
                    style={{
                      width: `${
                        totalReview === 0 ? "0%" : (item.count / totalReview) * 100
                      }%`,
                    }}
                  ></div>
                </div>{" "}
                <span>{item.count}</span>
              </div>
            );
          })}
        </div>
        </div>
    </div>
  );
}

export default DetailReview;
