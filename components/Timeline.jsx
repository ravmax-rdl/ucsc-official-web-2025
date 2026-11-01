"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";

import { timelineData } from "@/utils";

gsap.registerPlugin(ScrollTrigger);

const Timeline = () => {
  const [current, setCurrent] = useState(0);

  useGSAP(() => {
    const timelineItems = document.querySelectorAll(".timeline-item");

    timelineItems.forEach((item, index) => {
      gsap.fromTo(
        item,
        {
          opacity: 0.5,
        },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: "top 50%",
            end: "bottom 20%",
            onEnter: () => {
              setCurrent(index);
              gsap.to(item, { opacity: 1, duration: 0.3 });
            },
            onEnterBack: () => {
              setCurrent(index);
              gsap.to(item, { opacity: 1, duration: 0.3 });
            },
            onLeave: () => gsap.to(item, { opacity: 0.5, duration: 0.3 }),
            onLeaveBack: () => gsap.to(item, { opacity: 0.5, duration: 0.3 }),
          },
        }
      );
    });
  }, []);

  return (
    <section className="my-32 px-20" id="timeline">
      {/* <div>
        <h2>Timeline</h2>
      </div> */}

      <div className="flex my-10 gap-8">
        <div className="w-full flex flex-col justify-center">
          {timelineData.map(
            ({ title, subHeading, description, date, image }, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center w-full md:h-[400px] border-l border-l-primary-blue timeline-item"
                >
                  <div className="flex items-center gap-x-4 py-10">
                    <div className="rounded-full bg-primary-blue aspect-square w-[10px] h-[10px] -translate-x-[5.5px]" />
                    <div className="w-[200px] text-secondary-blue font-medium hidden md:flex">
                      {date}
                    </div>

                    <div className="w-full space-y-4">
                      <div className="flex flex-col">
                        <span className="text-secondary-blue font-semibold text-2xl">
                          {title}
                        </span>
                        <span className="font-medium text-secondary-blue">
                          {subHeading}
                        </span>
                        <span className="font-medium text-secondary-blue flex md:hidden">
                          {date}
                        </span>
                      </div>

                      <div>
                        <p className="text-secondary-blue">{description}</p>
                      </div>

                      <div className="flex md:hidden">
                        <Image
                          src={image}
                          alt={title}
                          width={1200}
                          height={1200}
                          className="object-cover aspect-video"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>

        <div className="w-full sticky top-24 py-10 h-[400px] md:flex hidden">
          <Image
            src={timelineData[current].image}
            alt={timelineData[current].title}
            width={1200}
            height={1200}
            className="object-cover aspect-video"
          />
        </div>
      </div>
    </section>
  );
};

export default Timeline;
