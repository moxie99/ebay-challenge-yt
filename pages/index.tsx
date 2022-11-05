import type { NextPage } from "next";
import {
  useActiveListings,
  useContract,
  MediaRenderer,
} from "@thirdweb-dev/react";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import { ListingType } from "@thirdweb-dev/sdk";
import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const Home: NextPage = () => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const { data: listings, isLoading: loading } = useActiveListings(contract);

  return (
    <div>
      <Head>
        <title>Ebay Challenge || 2022</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="max-w-6xl p-5 py-5 mx-auto">
        {loading ? (
          <p className="text-center text-red-900 animate-bounce">
            Loading Listings ....
          </p>
        ) : (
          <div className="grid max-w-6xl grid-cols-1 gap-5 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {listings?.map((listing, index) => (
              <Link href={`/listing/${listing.id}`} key={index}>
                <div
                  key={listing.id}
                  className="flex flex-col transition-all duration-150 ease-out card hover:scale-110"
                >
                  <div className="flex flex-col items-center flex-1 pb-2">
                    <MediaRenderer
                      src={listing.asset.image}
                      className="h-48 transition duration-150 ease-in-out w-44 hover:animate-bounce"
                    />
                  </div>
                  <div className="pt-2 space-y-4">
                    <div>
                      <h2 className="text-lg truncate">{listing.asset.name}</h2>
                      <hr />
                      <p className="mt-3 text-sm text-gray-700 truncate">
                        {listing.asset.description}
                      </p>
                    </div>
                    <p className="h-24">
                      <span className="font-bold">
                        {listing.buyoutCurrencyValuePerToken.displayValue}
                      </span>{" "}
                      {listing.buyoutCurrencyValuePerToken.symbol}
                    </p>
                    <div
                      className={`flex items-center space-x-1 justify-end text-xs border ml-auto p-2 w-fit mx-auto rounded-lg text-white ${
                        listing.type === ListingType.Direct
                          ? "bg-red-900"
                          : "bg-purple-900"
                      }`}
                    >
                      <p>
                        {listing.type === ListingType.Direct
                          ? "Buy Now"
                          : "Auction"}
                      </p>
                      {listing.type === ListingType.Direct ? (
                        <BanknotesIcon className="w-5 h-5" />
                      ) : (
                        <ClockIcon className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
