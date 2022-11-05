import React, { FormEvent, useState } from "react";
import Header from "../components/Header";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

type Props = {};

function addItem({}: Props) {
  const address = useAddress();
  const router = useRouter();
  const [preview, setPreview] = useState<string>("");
  const [image, setImage] = useState<File>();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );

  const minNFT = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contract || !address) return;

    if (!image) {
      toast.success("Please select an image", {
        position: "bottom-center",
        style: {
          width: "320px",
          height: "100px",
          backgroundColor: "#fff",
          color: "#61181E",
          fontSize: 18,
          fontWeight: "bold",
        },
        icon: "👏",
        duration: 3000,
        iconTheme: {
          primary: "#000",
          secondary: "#61181E",
        },
      });
      return;
    }

    const target = e.target as typeof e.target & {
      // this means e.target.name
      name: { value: string };
      //   e.target.description
      description: { value: string };
    };

    // defining NFT metadata

    const metadata = {
      name: target.name.value,
      description: target.description.value,
      image: image,
    };

    try {
      const transaction = await contract.mintTo(address, metadata);
      const receipt = transaction.receipt;
      const tokenId = transaction.id;
      const nft = await transaction.data();

      toast.success(`${receipt}, ${tokenId}, ${nft}`);
      // redirect to homepage
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Header />
      <main className="max-w-6xl p-10 mx-auto border">
        <div>
          <h1 className="text-4xl font-bold">Add an item to the Marketplace</h1>
          <h2 className="pt-5 text-xl font-semibold">Item Details</h2>
          <p className="pb-5">
            Adding an item to the Marketplace means you are minting an NFT of
            that item into your wallet, and the item can be placed for sales
            directly or through auction.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center pt-5 md:flex-row md:space-x-5">
          <img
            src={
              preview ||
              "https://upload.wikimedia.org/wikipedia/commons/e/e8/1Asset_8.png"
            }
            alt="mylogo"
            className="object-contain border h-80 w-80"
          />
          <form
            onSubmit={minNFT}
            className="flex flex-col flex-1 p-2 space-y-3"
          >
            <label className="font-light">Name of Item</label>
            <input
              className="formField"
              placeholder="Name of Item"
              type="text"
              name="name"
              id="name"
            />

            <label className="font-light">Description</label>
            <input
              className="formField"
              placeholder="Enter description"
              type="text"
              name="description"
              id="description"
            />

            <label className="font-light">Image of the Item</label>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setPreview(URL.createObjectURL(e.target.files[0]));
                  setImage(e.target.files[0]);
                }
              }}
            />

            <button
              type="submit"
              className="w-56 px-10 py-4 mx-auto font-bold text-white bg-red-900 rounded-full md:mt-auto md:ml-auto"
            >
              Add/ Mint Item
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default addItem;
