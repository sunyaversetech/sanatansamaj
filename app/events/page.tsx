"use client";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import EventCard from "@/components/Event/EventCard";
import { formatDate } from "date-fns";

export default function Events() {
  const [eventData, setEventData] = useState<{ data: any[] }>({ data: [] });
  const getEvents = async () => {
    const res = await fetch("http://localhost:3000/api/sanatansamaj/event");
    const data = await res.json();
    return setEventData(data);
  };

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <>
      <Navbar />

      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-6">
              Community Events
            </h1>
            <p className="text-xl text-white/80">
              Join us for spiritual gatherings, cultural celebrations, and
              educational programs
            </p>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* {eventData?.data?.map((event) => (
                <EventCard key={event._id} event={event} />
              ))} */}
              {eventData?.data?.map((event, index) => (
                <div
                  key={index}
                  className="p-8 bg-white rounded-lg shadow-lg border-l-4 border-primary hover:shadow-xl transition-shadow">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={500}
                    height={500}
                    className="mb-4 h-40 w-full object-cover rounded-lg"
                  />
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-primary rounded-full">
                      {event.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-black mb-4">
                    {event.title}
                  </h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span className="text-gray-700">
                        {formatDate(event.dateRange.from, "yyyy-MM-dd")}{" "}
                        {event.dateRange.from === event.dateRange.to
                          ? ""
                          : ` - ${formatDate(event.dateRange.to, "yyyy-MM-dd")}`}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{event.location}</span>
                    </div>
                    {/* <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span className="text-gray-700">
                        {event.attendees} expected attendees
                      </span>
                    </div> */}
                  </div>
                  {/* 
                  <button className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all">
                    Register Now
                  </button> */}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Event Categories */}
        {/* <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-center text-black mb-16">
              Event Categories
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { name: "Festivals", count: "3", color: "from-primary" },

                {
                  name: "Community Service",
                  count: "4",
                  color: "from-secondary",
                },
              ].map((cat, index) => (
                <div
                  key={index}
                  className={`p-8 bg-gradient-to-br ${cat.color} to-opacity-20 rounded-lg text-white text-center shadow-lg`}>
                  <h3 className="text-2xl font-serif font-bold mb-2">
                    {cat.count}
                  </h3>
                  <p className="text-lg font-semibold">{cat.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Newsletter Signup */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold mb-6">
              Never Miss an Event
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Subscribe to our newsletter to get updates on upcoming events and
              community news
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
