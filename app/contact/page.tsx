import Navbar from "@/components/navbar";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
  return (
    <>
      <Navbar />

      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-white/80">
              We&apos;d love to hear from you. Get in touch with us anytime.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  content: "info@sanatansamaj.org",
                  subtitle: "Response within 24 hours",
                },
                {
                  icon: Phone,
                  title: "Phone",
                  content: "0433677022",
                  subtitle: "Available 9AM - 6PM EST",
                },
                {
                  icon: MapPin,
                  title: "Location",
                  content: "47 Murrijinelle Circuit, Bonner",
                  subtitle: " ACT 2914, Australia.",
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <item.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-bold text-black mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 font-semibold mb-1">
                    {item.content}
                  </p>
                  <p className="text-sm text-gray-500">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-black mb-12 text-center">
              Send us a Message
            </h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your first name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your last name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Subject
                </label>
                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors">
                  <option>Membership Inquiry</option>
                  <option>Event Information</option>
                  <option>Donation</option>
                  <option>Volunteer Opportunity</option>
                  <option>General Inquiry</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Your message here..."
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105">
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-center text-black mb-16">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "How do I become a member?",
                  a: "You can join our community through our membership page. We offer flexible plans to suit everyone's needs. Visit the Membership page for more details.",
                },
                {
                  q: "Can I attend events without being a member?",
                  a: "Some events are open to the public, but members receive priority access and discounts. Check our Events page for more information.",
                },
                {
                  q: "Do you offer spiritual guidance for beginners?",
                  a: "Absolutely! We welcome beginners with our introductory programs and mentorship opportunities. Our community leaders are here to guide you.",
                },
                {
                  q: "What if I have financial constraints?",
                  a: "We offer sliding scale memberships and service-based options. Please contact us to discuss alternatives that work for your situation.",
                },
                {
                  q: "Can I volunteer with Sanatansamaj?",
                  a: "We always welcome passionate volunteers! Contact us with your interests, and we&apos;ll find the perfect role for you.",
                },
                {
                  q: "Are children welcome at events?",
                  a: "Yes! We have family-friendly events and special children&apos;s programs. Some events have specific age recommendations - please check details.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
                  <h3 className="text-lg font-serif font-bold text-black mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold mb-6">
              We&apos;re Here to Help
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Have questions? Reach out to us and our friendly team will assist
              you promptly.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
