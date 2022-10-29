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
    <div className="max-w-6xl p-3 mx-auto">
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
          <BellIcon className="w-6 h-6" />
          <ShoppingCartIcon className="w-6 h-6" />
        </div>
      </nav>

      <hr className="mt-2" />

      <section className="flex items-center py-4 space-x-4">
        <div className="flex-shrink-0 w-16 h-16 cursor-pointer sm:w-20 md:w-44">
          <Link href="/">
            <Image
              className="object-contain w-full h-full"
              src="https://upload.wikimedia.org/wikipedia/commons/e/e8/1Asset_8.png"
              alt="Thirdweb Logo"
              width={100}
              height={100}
            />
          </Link>
        </div>
        <button className="flex items-center hidden w-20 space-x-2 lg:flex">
          <p className="text-sm text-gray-800">Shop by Category</p>
          <ChevronDownIcon className="flex-shrink-0 h-4" />
        </button>
        <div className="flex items-center flex-1 px-2 py-2 space-x-2 border-2 border-black md:px-5">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
          <input
            className="flex-1 outline-none"
            placeholder="Search for any "
          />
        </div>
        <button className="hidden px-5 py-2 text-white bg-red-900 border-2 border-red-900 sm:inline md:px-10">
          Search
        </button>
        <Link href="/createItem">
          <button className="px-5 py-2 text-red-900 border-2 border-red-900 md:px-10 hover:text-white hover:bg-red-900/50">
            List Items
          </button>
        </Link>
      </section>
      <hr className="mt-4" />

      <section className="flex justify-center px-6 py-3 space-x-4 text-xs md:text-sm whitespace-nowrap">
        <p className="link">Home</p>
        <p className="link">Dresses</p>
        <p className="link">Shirts</p>
        <p className="hidden link sm:inline">Trousers</p>
        <p className="hidden link sm:inline">Sneakers</p>
        <p className="hidden link md:inline">Sandals</p>
        <p className="hidden link lg:inline">Caps</p>
        <p className="hidden link lg:inline">Cooperate Wears</p>
        <p className="hidden link lg:inline">Suits</p>
        <p className="hidden link xl:inline">Kaftans</p>
        <p className="hidden link xl:inline">Blouses</p>
        <p className="hidden link xl:inline">Skirts</p>
        <p className="link">More</p>
      </section>
    </div>
  );
}

export default Header;
