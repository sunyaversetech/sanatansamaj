import Navbar from "@/components/navbar";
import Link from "next/link";
import { Check, Users, Heart, Award } from "lucide-react";
import MembershipFormDialog from "@/components/MembershipDIalog";

export default function Membership() {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        {/* How to Join */}

        <MembershipFormDialog />

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-center text-black mb-16">
              What Our Members Say
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Amit Sharma",
                  text: "Joining Sanatansamaj has been transformative. The community support and spiritual guidance have enriched my life immensely.",
                },
                {
                  name: "Pooja Gupta",
                  text: "This is the perfect place for my family to connect with our heritage. The events are well-organized and truly meaningful.",
                },
                {
                  name: "Ravi Patel",
                  text: "I love being part of this community. The educational programs have deepened my understanding of our traditions.",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="p-8 bg-white rounded-lg shadow-lg border-l-4 border-primary">
                  <p className="text-gray-700 mb-6 italic">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <p className="font-serif font-bold text-black">
                    - {testimonial.name}
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
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Start your journey with Sanatansamaj today
            </p>
            <button className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105">
              Become a Member Now
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
