import { UserCircleIcon } from "@heroicons/react/24/solid";
import {
  MediaRenderer,
  useContract,
  useListing,
  useNetwork,
  useNetworkMismatch,
  useMakeBid,
  useOffers,
  useMakeOffer,
  useBuyNow,
  useAddress,
  useAcceptDirectListingOffer,
} from "@thirdweb-dev/react";
import { ListingType, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Countdown from "react-countdown";
import network from "../../utils/network";
import { ethers } from "ethers";
import toast from "react-hot-toast";

type Props = {};

function ListingPage({}: Props) {
  // address
  const address = useAddress();

  //   router to get id
  const router = useRouter();
  //   getting the id of the NFT
  const { listingid } = router.query as { listingid: string };

  // state for value and symbols
  const [mimimumNextBid, setMinimumNextBid] = useState<{
    displayValue: string;
    symbol: string;
  }>();
  const [bidOrOffer, setBidOrOffer] = useState("");
  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();

  //   contract
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  // using offer, displaying offer on the screen
  const { data: offers } = useOffers(contract, listingid);

  console.log(offers);

  // making offers
  const { mutate: makeOffer } = useMakeOffer(contract);

  const { mutate: buyNow } = useBuyNow(contract);

  // making bid function

  const { mutate: makeBid } = useMakeBid(contract);

  //   function to buy NFT
  const buyNft = async () => {
    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }
    if (!listingid || !contract || !listing) return;

    await buyNow(
      { id: listingid, buyAmount: 1, type: listing?.type },
      {
        onSuccess(data, variables, context) {
          toast.success("NFT bought successfully", {
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
          console.log("SUCCESS", data, variables, context);
          router.replace("/");
        },
        onError(error, variables, context) {
          toast.error("ERROR: NFT can not be bought", {
            position: "bottom-center",
            style: {
              width: "600",
              height: "100px",
              backgroundColor: "#fff",
              color: "#61181E",
              fontSize: 18,
              fontWeight: "bold",
            },
          });
          console.log("ERROR", error, variables, context);
        },
      }
    );
  };

  //   function to create bid or offer
  const createBidOrOffer = async () => {
    try {
      if (networkMismatch) {
        switchNetwork && switchNetwork(network);
        return;
      }

      //   if listing type is Direct Listing
      if (listing?.type === ListingType.Direct) {
        if (
          listing.buyoutPrice.toString() ===
          ethers.utils.parseEther(bidOrOffer).toString()
        ) {
          toast.success("Buyout Price Met, buying NFT...", {
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
          buyNft();
          return;
        }

        console.log("Butout Price Not Met,making offer ");

        await makeOffer(
          {
            quantity: 1,
            listingId: listingid,
            pricePerToken: bidOrOffer,
          },
          {
            onSuccess(data, variables, context) {
              toast.success("Offer made successfully", {
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
              console.log("SUCCESS", data, variables, context);
              setBidOrOffer("");
            },
            onError(error, variables, context) {
              toast.error("ERROR: Offer could not be made", {
                position: "bottom-center",
                style: {
                  width: "600",
                  height: "100px",
                  backgroundColor: "#fff",
                  color: "#61181E",
                  fontSize: 18,
                  fontWeight: "bold",
                },
              });
              console.log("ERROR", error, variables, context);
              setBidOrOffer("");
            },
          }
        );
      }

      // if listing type is Auction Listing
      if (listing?.type === ListingType.Auction) {
        console.log("Making bid ...");
        await makeBid(
          { listingId: listingid, bid: bidOrOffer },
          {
            onSuccess(data, variables, context) {
              toast.success("Bid made successfully", {
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
              console.log("SUCCESS", data, variables, context);
              setBidOrOffer("");
            },
            onError(data, variables, context) {
              toast.error("Bid could not be made", {
                position: "bottom-center",
                style: {
                  width: "600",
                  height: "100px",
                  backgroundColor: "#fff",
                  color: "#61181E",
                  fontSize: 18,
                  fontWeight: "bold",
                },
              });
              console.log("ERROR", data, variables, context);
              setBidOrOffer("");
            },
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  //   getting listing data
  const { data: listing, isLoading, error } = useListing(contract, listingid);

  // accept offer

  const { mutate: acceptDirectOffer } = useAcceptDirectListingOffer(contract);

  // const acceptOffer = (offer: Record<string, any>) => {
  //   try {
  //     await;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    if (!listingid || !contract || !listing) return;

    if (listing.type === ListingType.Auction) {
      fetchMinNextBid();
    }
  }, [listingid, listing, contract]);

  const fetchMinNextBid = async () => {
    if (!listingid || !contract) return;

    const minBidResponse = await contract.auction.getMinimumNextBid(listingid);

    setMinimumNextBid({
      displayValue: minBidResponse.displayValue,
      symbol: minBidResponse.symbol,
    });
  };

  // placeholder value
  const formatPlaceholder = () => {
    if (!listing) return;
    if (listing.type === ListingType.Direct) return "Enter Offer Now";
    if (listing.type === ListingType.Auction)
      return Number(mimimumNextBid?.displayValue) === 0
        ? "Enter Bid Amount"
        : `${mimimumNextBid?.displayValue} ${mimimumNextBid?.symbol} or more`;
  };

  //   if data is loading
  if (isLoading)
    return (
      <div>
        {" "}
        <Header />
        <p className="text-center text-red-900 animate-bounce">
          Loading Item...
        </p>
      </div>
    );

  // if no data returned
  if (!listing) return <div>Listing Not Found</div>;

  //   if data is returned
  return (
    <div>
      <Header />
      <main className="flex flex-col max-w-6xl p-2 pr-10 mx-auto space-x-5 space-y-10 lg:flex-row">
        <div className="max-w-md p-10 mx-auto border lg:mx-0 lg:max-w-xl">
          <MediaRenderer src={listing.asset.image} />
        </div>
        <section className="flex-1 pb-20 space-y-5 lg:pb-0">
          <div>
            <h1 className="text-xl font-bold">{listing.asset.name}</h1>
            <p>{listing.asset.description}</p>
            <p className="flex items-center text-xs sm:text-base">
              <UserCircleIcon className="h-5" />
              <span className="pr-1 font-bold">Seller: </span>
              {listing.sellerAddress}
            </p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-bold">Listing Type: </p>
            <p>
              {listing.type === ListingType.Direct
                ? "Direct Listing"
                : "Auction Listing"}
            </p>
            <p className="font-bold">Buy it Now Price:</p>
            <p className="font-bold text-md">
              {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
              {listing.buyoutCurrencyValuePerToken.symbol}
            </p>
            <button
              onClick={buyNft}
              className="col-start-2 px-10 py-4 mt-4 font-bold text-white bg-red-900 rounded-full w-44"
            >
              Buy Now
            </button>
          </div>
          {/* showing offers */}

          {listing.type === ListingType.Direct && offers && (
            <div className="grid grid-cols-2 gap-y-2">
              <p>Offers: </p>
              <p className="font-bold">
                {offers.length > 0 ? offers.length : 0}
              </p>

              {offers?.map((offer, index) => (
                <>
                  <p
                    key={index}
                    className="italic items-center ml-5 text-sm flex"
                  >
                    <UserCircleIcon className="h-3 mr-2" />
                    {offer.offeror.slice(0, 5)} + "..." +
                    {offer.offeror.slice(-5)}
                  </p>
                  <div>
                    <p className="text-sm italic">
                      {ethers.utils.formatEther(offer.totalOfferAmount)}{" "}
                      {NATIVE_TOKENS[network].symbol}
                    </p>

                    {listing.sellerAddress === address && (
                      <button
                        onClick={() =>
                          acceptDirectOffer(
                            {
                              listingId: listingid,
                              addressOfOfferor: offer.offeror,
                            },
                            {
                              onSuccess(data, variables, context) {
                                toast.success("Offer accepted successfully", {
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
                                console.log(
                                  "SUCCESS",
                                  data,
                                  variables,
                                  context
                                );
                                router.replace("/");
                              },
                              onError(data, variables, context) {
                                toast.error("Offer rejected", {
                                  position: "bottom-center",
                                  style: {
                                    width: "600",
                                    height: "100px",
                                    backgroundColor: "#fff",
                                    color: "#61181E",
                                    fontSize: 18,
                                    fontWeight: "bold",
                                  },
                                });
                                console.log("ERROR", data, variables, context);
                              },
                            }
                          )
                        }
                        className="p-2 w-32 bg-green-600/50 rounded-lg"
                      >
                        Accept Offer
                      </button>
                    )}
                  </div>
                </>
              ))}
            </div>
          )}

          <div className="grid items-center justify-end grid-cols-2 space-y-2">
            <hr className="col-span-2" />
            <p className="col-span-2 font-bold">
              {listing.type === ListingType.Direct
                ? "Make an Offer"
                : "Bid on this Auction"}
            </p>

            {listing.type === ListingType.Auction && (
              <>
                <p>Current Minimum Bid</p>
                <p className="font-bold">
                  {mimimumNextBid?.displayValue} {mimimumNextBid?.symbol}
                </p>
                <p>Time Remaining</p>
                {/* <p>{listing?.endTimeInEpochSeconds}</p> */}
                <Countdown
                  date={
                    Number(listing?.endTimeInEpochSeconds.toString()) * 1000
                  }
                />
              </>
            )}
            <input
              className="flex-1 p-2 mr-5 border rounded-lg outline-none"
              type="text"
              placeholder={formatPlaceholder()}
              onChange={(e) => setBidOrOffer(e.target.value)}
            />
            <button
              onClick={createBidOrOffer}
              className={`px-10 py-4 ${
                ListingType.Direct ? "bg-red-900" : "bg-purple-900"
              } font-bold text-white  rounded-full w-44`}
            >
              {listing.type === ListingType.Direct ? "Offer" : "Bid"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ListingPage;
