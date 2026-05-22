import Navbar from "@/components/navbar";
import Link from "next/link";
import { Heart, Users, Calendar, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen pt-20 bg-black pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-gray-950 to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col justify-center items-center min-h-screen">
          <div className="text-center space-y-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight text-balance">
              Welcome to Sanatan Samaj Australia
            </h1>
            <p className="text-2xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed text-balance">
              Nurturing Spiritual Growth, Preserving Culture, Serving Community
            </p>
            <p className="text-sm sm:text-base text-gray-400 max-w-3xl mx-auto leading-relaxed text-balance">
              Surah Tunus, Verse 25
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                href="/membership"
                className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg">
                Become a Member
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Spiritual Events",
                description:
                  "Experience sacred ceremonies and spiritual gatherings that connect us to our roots.",
                icon: BookOpen,
              },
              {
                title: "Community Support",
                description:
                  "Join a loving community dedicated to personal growth and mutual support.",
                icon: Users,
              },
              {
                title: "Cultural Programs",
                description:
                  "Celebrate and preserve the rich traditions of Hindu culture through engaging programs.",
                icon: Calendar,
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-8 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-lg transition-all border-l-4 border-primary group hover:border-secondary">
                  <Icon className="w-12 h-12 text-primary mb-4 group-hover:text-secondary transition-colors" />
                  <h3 className="text-2xl font-serif font-bold text-black mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-center text-black mb-16">
            Our Community Impact
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "2500+", label: "Community Members", icon: Users },
              { number: "150+", label: "Events Annually", icon: Calendar },
              { number: "50+", label: "Volunteers", icon: Heart },
              { number: "100+", label: "Families Served", icon: BookOpen },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-4xl font-serif font-bold text-primary mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Donation Progress Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-center text-black mb-16">
            Support Our Mission
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Temple Fund",
                // collected: 75000,
                // target: 100000,
                // color: "from-primary",
              },
              {
                title: "Community Center",
                // collected: 45000,
                // target: 80000,
                // color: "from-secondary",
              },
              {
                title: "Charity Programs",
                // collected: 60000,
                // target: 90000,
                // color: "from-primary",
              },
            ].map((fund, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-serif font-bold text-black mb-4">
                  {fund.title}
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    {/* <span className="text-sm text-gray-600">Progress</span> */}
                    {/* <span className="text-sm font-semibold text-primary">
                      ${(fund.collected / 1000).toFixed(0)}K / $
                      {(fund.target / 1000).toFixed(0)}K
                    </span> */}
                  </div>
                  {/* <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`bg-gradient-to-r ${fund.color} to-secondary h-3 rounded-full transition-all duration-500`}
                      style={{
                        width: `${(fund.collected / fund.target) * 100}%`,
                      }}
                    />
                  </div> */}
                </div>
                {/* <p className="text-gray-600 text-sm">
                  {Math.round((fund.collected / fund.target) * 100)}% funded
                </p> */}
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/donate"
              className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105">
              Support Our Cause
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-center text-black mb-16">
            Upcoming Festivals & Events
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-6 py-4 text-left font-serif font-bold">
                    Festival / Event
                  </th>
                  <th className="px-6 py-4 text-left font-serif font-bold">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left font-serif font-bold">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left font-serif font-bold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  {
                    name: "Teej",
                    date: "Aug 15, 2026",
                    desc: "Festival dedicated to Goddess Parvati",
                  },
                  {
                    name: "Shree Kishna Janmaashtami",
                    date: "Sep 5, 2026",
                    desc: "Cultural Event",
                  },
                  {
                    name: "Dashain",
                    date: "Oct 11-20, 2026",
                    desc: "Biggest and longest festival in Nepal",
                  },
                ].map((event, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 transition-colors">
                    <td className="px-6 py-4 font-serif font-semibold text-black">
                      {event.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{event.date}</td>
                    <td className="px-6 py-4 text-gray-700">{event.desc}</td>
                    <td className="px-6 py-4">
                      <Link
                        href="/events"
                        className="text-primary font-semibold hover:underline transition-all">
                        Register
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <Link
              href="/events"
              className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Past Events & News Section */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-center text-black mb-16">
            Recent News & Past Events
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Diwali Celebration 2023",
                date: "November 12, 2023",
                description:
                  "Over 500 community members gathered for our spectacular Diwali celebration with traditional performances, food, and fireworks.",
                category: "Event Recap",
              },
              {
                title: "Youth Leadership Program Launched",
                date: "October 30, 2023",
                description:
                  "New mentorship program connecting young community members with spiritual leaders for guidance and personal growth.",
                category: "News",
              },
              {
                title: "Charity Drive Success",
                date: "October 15, 2023",
                description:
                  "Our Daan (charity) initiative successfully distributed supplies to 200+ families in need.",
                category: "Community Service",
              },
              {
                title: "Hindu Philosophy Workshop",
                date: "September 28, 2023",
                description:
                  "Interactive workshop on Bhagavad Gita with renowned scholar Dr. Sharma, attracting over 300 participants.",
                category: "Education",
              },
              {
                title: "Cultural Festival Grand Success",
                date: "September 10, 2023",
                description:
                  "Two-day cultural festival featured classical dance, music performances, and traditional cuisine from across India.",
                category: "Event Recap",
              },
              {
                title: "Membership Drive Results",
                date: "August 25, 2023",
                description:
                  "Welcomed 150 new members to our growing community through our summer membership drive initiative.",
                category: "Milestone",
              },
            ].map((news, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden border-l-4 border-primary">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                      {news.category}
                    </span>
                    <span className="text-xs text-gray-500">{news.date}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-black mb-3">
                    {news.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {news.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
            Ready to Join Us?
          </h2>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Become part of our growing community and experience the richness of
            Sanatan dharma with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/membership"
              className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105">
              Become a Member
            </Link>
            <Link
              href="/events"
              className="px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all">
              View Upcoming Events
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white/70 py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-serif font-bold text-lg mb-4">
                Sanatansamaj
              </h3>
              <p className="text-sm leading-relaxed">
                Preserving and celebrating Hindu culture and spirituality.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="hover:text-primary transition-colors">
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/membership"
                    className="hover:text-primary transition-colors">
                    Membership
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/donate"
                    className="hover:text-primary transition-colors">
                    Donate
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-xs">
            <p>&copy; 2024 Sanatansamaj. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
