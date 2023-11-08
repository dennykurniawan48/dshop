import Header from "./components/header";
import Categories from "./components/categories";
import Products from "./components/products";
import { prisma } from "./utils/prisma";
import Slider from "./components/Slider";

export default async function Home({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | null };
}) {
  const slider = await prisma.slider.findMany();

  return (
    <>
      <div className="z-10 w-full items-start justify-between font-mono text-sm bg-white">
        <Header />
      </div>
      <div className={`w-full flex items-center mt-24 px-6 lg:px-24`}>
        <div className="w-full space-y-6">
          <Slider data={slider} />
          <Categories />
          <Products cat={searchParams.cat} />
        </div>
      </div>
    </>
  );
}
