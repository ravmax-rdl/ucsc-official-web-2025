"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";

import TransitionLink from "./helpers/TransitionLink";
import { ieeeURL, navbarLinks } from "@/utils";
import miniLogo from "@/public/logo-blue.svg";
import ieeeLogo from "@/public/logo-ieee-blue.svg";

const Navbar = () => {
  const [isOpened, setIsOpended] = useState(false);
  const mobileNav = useRef(null);
  const handleClick = () => {
    if (!isOpened) {
      gsap.fromTo(
        mobileNav.current,
        {
          clipPath: "inset(0 0 100% 0)",
        },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.5,
        }
      );
    } else {
      gsap.fromTo(
        mobileNav.current,
        {
          clipPath: "inset(0 0 0 0)",
        },
        {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.5,
        }
      );
    }

    setIsOpended((prev) => !prev);
  };
  return (
    <>
      <nav className="fixed w-full hidden md:flex gap-6 items-center justify-between px-8 py-2 backdrop-blur-lg z-20 bg-primary-white">
        <div className="">
          <TransitionLink href="/">
            <Image src={miniLogo} width={140} height={60} alt="Logo" />
          </TransitionLink>
        </div>

        <div className="flex gap-6 py-2 px-6 items-center justify-center text-primary-blue uppercase font-semibold">
          {navbarLinks.map(({ name, link }, index) => (
            <TransitionLink
              href={link}
              key={index}
              className="hover:bg-primary-blue/10 px-1 py-1 rounded-sm transition-color duration-200"
            >
              {name}
            </TransitionLink>
          ))}

          <DropDown />
          <ContactButton />
        </div>

        <div className="">
          <Link href={ieeeURL} target="_blank" rel="noreferrer">
            <Image src={ieeeLogo} width={80} height={40} alt="Logo" />
          </Link>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="flex md:hidden  w-full fixed top-0 z-20 bg-primary-white">
        <div className="py-4 px-3 justify-between  items-center flex w-full">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className=" text-primary-blue"
              onClick={handleClick}
            >
              <path d="M4 12h16" />
              <path d="M4 18h16" />
              <path d="M4 6h16" />
            </svg>
          </div>

          <div className="">
            <Image src={miniLogo} width={140} height={60} alt="Logo" />
          </div>
        </div>

        <div
          ref={mobileNav}
          style={{ clipPath: "inset(0 0 100% 0)" }}
          className="fixed top-16 bg-primary-white w-full flex flex-col px-4 py-8"
        >
          {navbarLinks.map(({ name, link }, index) => (
            <div key={link} onClick={handleClick}>
              <TransitionLink
                href={link}
                className="hover:bg-primary-blue/10 px-1 py-1 rounded-sm transition-color duration-200 uppercase text-primary-blue font-semibold text-xl"
              >
                {name}
              </TransitionLink>
            </div>
          ))}
          <div className="mb-2 text-xl">
            <p className=" px-1 py-1 rounded-sm transition-color duration-200 uppercase text-primary-blue font-semibold">
              Our team
            </p>
            <div className="ml-4 flex flex-col">
              <div onClick={handleClick}>
                <TransitionLink
                  href="#current-team"
                  className="hover:bg-primary-blue/10 px-1 py-1 rounded-sm transition-color duration-200 uppercase text-primary-blue font-semibold text-lg"
                >
                  - Current Team
                </TransitionLink>
              </div>
              <div onClick={handleClick}>
                <TransitionLink
                  href="/previous-officers"
                  className="hover:bg-primary-blue/10 px-1 py-1 rounded-sm transition-color duration-200 uppercase text-primary-blue font-semibold text-lg"
                >
                  - Previous Officers
                </TransitionLink>
              </div>
            </div>
          </div>

          <div onClick={handleClick}>
            <TransitionLink
              href="#contact-us"
              className="hover:bg-primary-blue/10 px-1 py-1 rounded-sm transition-color duration-200 uppercase text-primary-blue font-semibold text-xl"
            >
              Contact us
            </TransitionLink>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

const DropDown = () => {
  const box = useRef();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (!isClicked) {
      gsap.fromTo(
        box.current,
        {
          clipPath: "inset(0 0 100% 0)",
        },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.5,
        }
      );
    } else {
      gsap.fromTo(
        box.current,
        {
          clipPath: "inset(0 0 0 0)",
        },
        {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.5,
        }
      );
    }

    setIsClicked((prev) => !prev);
  };
  return (
    <div className="cursor-pointer relative" onClick={handleClick}>
      <span className="flex hover:bg-primary-blue/10 px-2 py-1 rounded-sm">
        {" "}
        Our Team{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-chevron-down"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
      <div
        className="absolute -bottom-24 -left-1 w-[180px] bg-[#E3EBF0] px-2 py-2 rounded-sm space-y-2"
        ref={box}
        style={{ clipPath: "inset(0 0 100% 0)" }}
      >
        <div className="">
          <TransitionLink href="#current-team">Current Team</TransitionLink>
        </div>

        <div>
          <TransitionLink href="/previous-officers">
            Previous Officers
          </TransitionLink>
        </div>
      </div>
    </div>
  );
};

const ContactButton = () => {
  return (
    <TransitionLink
      href="#contact-us"
      className="border border-primary-blue text-primary-blue hover:bg-primary-blue/10 px-2 py-1 rounded-sm"
    >
      contact us
    </TransitionLink>
  );
};
