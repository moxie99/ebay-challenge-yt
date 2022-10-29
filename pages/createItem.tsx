import React, { FormEvent, ReactElement, useState } from "react";
import Header from "../components/Header";
import {
  useAddress,
  useContract,
  MediaRenderer,
  useNetwork,
  useNetworkMismatch,
  useOwnedNFTs,
  useCreateAuctionListing,
  useCreateDirectListing,
} from "@thirdweb-dev/react";
import {
  NFT,
  ChainId,
  NATIVE_TOKENS,
  NATIVE_TOKEN_ADDRESS,
} from "@thirdweb-dev/sdk";
import network from "../utils/network";
import { useRouter } from "next/router";

interface Props {}

function createItem({}: Props): ReactElement {
  // getting address
  const address = useAddress();

  //   creating an instance of router
  const router = useRouter();
  //   marketplace contract
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  console.log("address:" + address);

  //   collection contract
  const { contract: collectionContract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );

  //   getting owned NFTs
  const ownedNFTS = useOwnedNFTs(collectionContract, address);

  //   instance for network mismatch
  const networkMismatch = useNetworkMismatch();

  //   checking network
  const [, switchNetwork] = useNetwork();

  //   creating instance of direct listing creation
  const {
    mutate: createDirectListing,
    isLoading: dloading,
    error: derror,
  } = useCreateDirectListing(contract);

  //   creating instance of aunction listing creation
  const {
    mutate: createAuctionListing,
    isLoading: aloading,
    error: aerror,
  } = useCreateAuctionListing(contract);

  //   state for selected NFT
  const [selected, setSelected] = useState<NFT>();

  //   submit function

  const handleCreateListing = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }

    if (!selected) return;
    const target = e.target as typeof e.target & {
      elements: { listingType: { value: string }; price: { value: string } };
    };

    const { listingType, price } = target.elements;

    if (listingType.value === "directListing") {
      createDirectListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          tokenId: selected.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7,
          quantity: 2,
          buyoutPricePerToken: price.value,
          startTimestamp: new Date(),
        },
        {
          onSuccess(data, variables, context) {
            console.log(data, variables, context);
            router.push("/");
          },

          onError(error, variables, context) {
            console.log(error);
          },
        }
      );
    }

    if (listingType.value === "auctionListing") {
      createAuctionListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          tokenId: selected.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7,
          quantity: 1,
          buyoutPricePerToken: price.value,
          startTimestamp: new Date(),
          reservePricePerToken: 0,
        },
        {
          onSuccess(data, variables, context) {
            console.log(data, variables, context);
            router.push("/");
          },

          onError(error, variables, context) {
            console.log(error);
          },
        }
      );
    }
  };

  return (
    <div>
      <Header />
      <main className="max-w-6xl p-10 pt-2 mx-auto">
        <h1 className="text-4xl font-bold">List an item</h1>
        <h2 className="pt-5 text-xl font-semibold">
          Select an item you would love to sell or aunction
        </h2>

        <hr className="mb-5" />
        <p className="">Below you would find the NFTs you own in your wallet</p>

        <div className="flex p-5 space-x-3 overflow-x-scroll">
          {ownedNFTS?.data?.map((nft) => (
            <div
              key={nft.metadata.id}
              onClick={() => setSelected(nft)}
              className={`flex flex-col space-y-2 bg-gray-200 border-2 cursor-pointer card min-w-fit ${
                nft.metadata.id === selected?.metadata.id
                  ? "border-red-900"
                  : "border-transparent"
              }`}
            >
              <MediaRenderer
                className="h-48 rounded-lg"
                src={nft.metadata.image}
              />
              <p className="text-lg font-bold truncate">{nft.metadata.name}</p>
              <p className="text-xs truncate">{nft.metadata.description}</p>
            </div>
          ))}
        </div>

        {selected && (
          <form onSubmit={handleCreateListing}>
            <div className="flex flex-col p-10">
              <div className="grid grid-cols-2 gap-5">
                <label className="font-light border-r">
                  Direct Listing / Fixed Price
                </label>
                <input
                  type="radio"
                  className="w-8 h-8 ml-auto"
                  name="listingType"
                  value="directListing"
                />
                <label className="font-light border-r">Aunction</label>
                <input
                  type="radio"
                  className="w-8 h-8 ml-auto"
                  name="listingType"
                  value="auctionListing"
                />
                <label className="font-light border-r">Price</label>
                <input
                  name="price"
                  className="p-5 bg-gray-100"
                  placeholder="0.05"
                  type="text"
                />
              </div>
              <button
                type="submit"
                className="p-4 mt-10 text-white bg-red-900 rounded-lg"
              >
                Create Listing
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default createItem;
