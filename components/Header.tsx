import React, { ReactElement } from "react";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import Link from "next/link";
import {
  BellIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

interface Props {}

function Header({}: Props): ReactElement {
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();

  return (
    <div className="max-w-6xl mx-auto p-3">
      <nav className="flex justify-between">
        <div className="flex items-center space-x-3 text-sm">
          {address ? (
            <button onClick={disconnect} className="connectWalletButton">
              Hi, {address.slice(0, 5) + "..." + address.slice(-4)}
            </button>
          ) : (
            <button
              onClick={connectWithMetamask}
              className="connectWalletButton"
            >
              Connect your wallet
            </button>
          )}

          <p className="headertext">Daily Deals</p>
          <p className="headertext">Help & Contacts</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <p className="headertext">Ship to</p>
          <p className="headertext">Sell</p>
          <p className="headertext">Watchlist</p>

          <Link href="/addItem" className="flex items-center hover:linkClass">
            Add to Inventory
            <ChevronDownIcon className="h-5" />
          </Link>
          <BellIcon className="h-6 w-6" />
          <ShoppingCartIcon className="h-6 w-6" />
        </div>
      </nav>

      <hr className="mt-2" />

      <section className="flex items-center space-x-4 py-4">
        <div className="h-16 w-16 sm:w-20 md:w-44 flex-shrink-0 cursor-pointer">
          <Link href="/">
            <Image
              className="w-full h-full object-contain"
              src="https://upload.wikimedia.org/wikipedia/commons/e/e8/1Asset_8.png"
              alt="Thirdweb Logo"
              width={100}
              height={100}
            />
          </Link>
        </div>
        <button className="items-center flex space-x-2 w-20 hidden lg:flex">
          <p className="text-gray-800 text-sm">Shop by Category</p>
          <ChevronDownIcon className="h-4 flex-shrink-0" />
        </button>
        <div className="flex items-center space-x-2 px-2 md:px-5 py-2 border-black border-2 flex-1">
          <MagnifyingGlassIcon className="w-5 text-gray-600 h-5" />
          <input
            className="flex-1 outline-none"
            placeholder="Search for any "
          />
        </div>
        <button className="hidden sm:inline bg-red-900 text-white px-5 md:px-10 py-2 border-2 border-red-900">
          Search
        </button>
        <Link href="">
          <button className="border-2 border-red-900 px-5 md:px-10 py-2 text-red-900 hover:text-white hover:bg-red-900/50">
            List Items
          </button>
        </Link>
      </section>
      <hr className="mt-4" />

      <section className="flex py-3 space-x-4 text-xs md:text-sm whitespace-nowrap justify-center px-6">
        <p className="link">Home</p>
        <p className="link">Dresses</p>
        <p className="link">Shirts</p>
        <p className="link hidden sm:inline">Trousers</p>
        <p className="link hidden sm:inline">Sneakers</p>
        <p className="link hidden md:inline">Sandals</p>
        <p className="link hidden lg:inline">Caps</p>
        <p className="link hidden lg:inline">Cooperate Wears</p>
        <p className="link hidden lg:inline">Suits</p>
        <p className="link hidden xl:inline">Kaftans</p>
        <p className="link hidden xl:inline">Blouses</p>
        <p className="link hidden xl:inline">Skirts</p>
        <p className="link">More</p>
      </section>
    </div>
  );
}

export default Header;
