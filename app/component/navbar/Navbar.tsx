"use client";
import React from "react";
import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { useEffect, useState } from "react";
import Link from "next/link";
// import Logo from './Logo'
// import Search from './Search'
// import UserMenu from './UserMenu'
// import { SafeUser } from '@/app/types';
// import Categories from './Categories';

// interface NavbarProps {
//   currentUser?: SafeUser | null;
// }

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { BiSolidDonateHeart } from "react-icons/bi";

const Navbar = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed w-full bg-white z-50 shadow-sm">
      <div
        className="
        py-1
        border-b-[1px]
        "
      >
        <Container>
          <div
            className="
                flex
                flex-row
                items-center
                justify-between
                gap-3
                md:gap-0
                "
          >
            <Logo />
            <Search />

            {/*  Donate  */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="inline-flex items-center bg-gradient-to-r 
  from-indigo-600 via-purple-500 to-pink-500 
  hover:from-pink-500 hover:via-purple-500 hover:to-indigo-600 
  text-white font-bold md:py-2 md:px-4 py-1 px-1
  rounded-full shadow-lg md:text-sm text-[12px]
  transition-transform transform hover:scale-105 duration-300"
                
                >
                  <BiSolidDonateHeart className="md:mr-2 mr-1" size={18} />
                  Donate
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle> Donation</DialogTitle>
                  <DialogDescription>
                  <div className="justify-center text-justify">
                 <span className="font-bold mt-3 ">Soutenez EspasLink : Aidez-nous à construire un avenir meilleur pour Haïti !</span> <br />

Votre don nous aidera à développer ce projet porteur de sens et à apporter des technologies qui changeront la vie des personnes qui en ont le plus besoin. 

Ensemble, nous pouvons élever Haïti et tracer la voie vers un avenir plus solide. Aucun don n'est trop petit – chaque contribution nous rapproche de notre vision.

Participez à ce mouvement. Faites un don aujourd'hui et aidez-nous à créer un impact durable pour les générations à venir !</div>
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="paypal" className="text-left">
                      Faire un don avec Paypal
                    </Label>
                    <Link
                      href="https://www.paypal.com/donate/?hosted_button_id=EY7C8BVH8XVDE"
                      legacyBehavior
                    >
                      <a
                        className="inline-block w-fit bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-600 text-white font-bold py-2 px-6 rounded-full shadow-lg text-center transition-transform transform hover:scale-105 duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Donate
                      </a>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="moncash" className="text-left">
                      Faire un don avec Moncash
                    </Label>
                    <input
                      type="text"
                      id="moncash"
                      defaultValue="+509 3102-2885"
                      className="col-span-3 bg-gray-100 text-gray-500 cursor-not-allowed px-4 py-2 rounded"
                      disabled
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="moncash" className="text-left">
                      Faire un don avec NatCash
                    </Label>
                    <input
                      type="text"
                      id="moncash"
                      defaultValue="+509 4305-7691"
                      className="col-span-3 bg-gray-100 text-gray-500 cursor-not-allowed px-4 py-2 rounded"
                      disabled
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <UserMenu />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
