import Navbar from "@/components/navbar";
import Link from "next/link";
import { Award, Target, Heart } from "lucide-react";

export default function About() {
  return (
    <>
      <Navbar />

      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-6">
              About Us
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Learn about our mission, values, and the team behind Sanatansamaj
            </p>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-gradient-to-br from-primary/10 to-transparent rounded-lg border border-primary/20">
                <Target className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-serif font-bold text-black mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  To preserve, promote, and celebrate Hindu culture,
                  spirituality, and traditions while building a strong,
                  supportive community that bridges heritage with modern life.
                </p>
              </div>
              <div className="p-8 bg-gradient-to-br from-secondary/10 to-transparent rounded-lg border border-secondary/20">
                <Heart className="w-12 h-12 text-secondary mb-4" />
                <h3 className="text-2xl font-serif font-bold text-black mb-4">
                  Our Values
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Community, spirituality, cultural preservation, education,
                  service, inclusivity, and mutual support form the foundation
                  of everything we do.
                </p>
              </div>
              <div className="p-8 bg-gradient-to-br from-primary/10 to-transparent rounded-lg border border-primary/20">
                <Award className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-serif font-bold text-black mb-4">
                  Our Vision
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  A vibrant, thriving community where individuals of all
                  backgrounds can connect, learn, and grow spiritually while
                  celebrating our rich cultural heritage.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Spiritual Quote Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-y border-primary/10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-2xl sm:text-3xl font-serif italic text-gray-800 mb-4">
              "Vasudhaiva Kutumbakam" - The World is One Family
            </p>
            <p className="text-lg text-gray-700">
              This ancient Sanskrit philosophy guides our mission to build a
              connected, compassionate community that honors diversity and
              celebrates our shared humanity through the lens of Sanatan Dharma.
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-black mb-8">
              Who We Are
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Sanatansamaj is a vibrant community organization dedicated to
                the promotion and preservation of Hindu culture, spirituality,
                and traditions. We bring together individuals from diverse
                backgrounds who share a deep appreciation for Sanatan Dharma and
                its profound wisdom.
              </p>
              <p>
                Founded on the principles of community service, educational
                excellence, and spiritual growth, we have established ourselves
                as a trusted space for those seeking to deepen their
                understanding of Hindu philosophy and connect with like-minded
                individuals.
              </p>
              <p>
                Our community engages in a variety of activities including
                religious ceremonies, cultural programs, educational workshops,
                charitable endeavors, and social gatherings that foster a sense
                of belonging and shared purpose.
              </p>
              <p>
                Through our initiatives, we aim to ensure that the timeless
                wisdom of the Vedas, Upanishads, and Bhagavad Gita remains
                relevant and accessible to all, bridging the ancient teachings
                with contemporary life.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-center text-black mb-16">
              Our Team
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Santosh malla",
                  role: "President ",
                  bio: "With over 20 years of experience in community service and spiritual leadership, Rajesh founded Sanatansamaj to create a welcoming space for spiritual seekers.",
                },
                {
                  name: "Prakash pokharel",
                  role: "Treasurer",
                  bio: "Prakash manages our financial operations and ensures transparency in our community's fiscal responsibilities.",
                },
                {
                  name: "Basu dhakal",
                  role: " Cultural Coordinator",
                  bio: "Basu dhakal coordinates our events and community initiatives, ensuring every member feels valued and engaged in our growing community.",
                },
                {
                  name: "Hemant bhandari",
                  role: "Public officer",
                  bio: "Hemant represents our community in public forums and ensures effective communication with local authorities and stakeholders.",
                },
              ].map((member, index) => (
                <div
                  key={index}
                  className="p-8 bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mb-4" />
                  <h3 className="text-xl font-serif font-bold text-black mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-semibold mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold mb-6">
              Join Our Community Today
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Become part of our mission to preserve and celebrate Hindu culture
            </p>
            <Link
              href="/membership"
              className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105">
              Learn About Membership
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
