import Navbar from '@/components/navbar'
import Link from 'next/link'
import { Heart, Target, Users, BookOpen } from 'lucide-react'

export default function Donate() {
  return (
    <>
      <Navbar />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-6">
              Support Our Mission
            </h1>
            <p className="text-xl text-white/80">
              Your generosity helps us preserve and celebrate our rich cultural heritage
            </p>
          </div>
        </section>

        {/* Why Donate */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-center text-black mb-16">
              Why Your Support Matters
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="flex gap-4">
                <Users className="w-12 h-12 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-serif font-bold text-black mb-2">
                    Growing Community
                  </h3>
                  <p className="text-gray-700">
                    Your donations help us expand our programs and reach more people seeking spiritual connection and cultural knowledge.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <BookOpen className="w-12 h-12 text-secondary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-serif font-bold text-black mb-2">
                    Educational Programs
                  </h3>
                  <p className="text-gray-700">
                    Support scholarships and free educational programs that bring Hindu knowledge and philosophy to everyone.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Heart className="w-12 h-12 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-serif font-bold text-black mb-2">
                    Community Service
                  </h3>
                  <p className="text-gray-700">
                    Enable us to continue our seva (service) initiatives that help those in need and strengthen community bonds.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Target className="w-12 h-12 text-secondary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-serif font-bold text-black mb-2">
                    Cultural Events
                  </h3>
                  <p className="text-gray-700">
                    Organize meaningful festivals and cultural celebrations that bring our community together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Donation Levels */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-center text-black mb-4">
              Donation Options
            </h2>
            <p className="text-center text-gray-700 mb-16 text-lg">
              Choose an amount that works for you, or make a custom donation
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { amount: '$25', impact: 'Supports 1 Person\'s Program Access' },
                { amount: '$50', impact: 'Funds Weekly Spiritual Program' },
                { amount: '$100', impact: 'Supports Educational Workshop' },
                { amount: '$250', impact: 'Enables Community Service Day' },
                { amount: '$500', impact: 'Sponsors Cultural Event' },
                { amount: '$1000', impact: 'Supports Full Scholarship' },
                { amount: 'Custom', impact: 'Make Your Own Donation' },
                { amount: 'Monthly', impact: 'Become a Sustaining Donor' },
              ].map((option, index) => (
                <button
                  key={index}
                  className="p-6 bg-white border-2 border-primary rounded-lg hover:shadow-lg transition-all hover:border-secondary group"
                >
                  <h3 className="text-3xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                    {option.amount}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {option.impact}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-center text-black mb-16">
              Your Impact
            </h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { number: '2,500+', label: 'Active Members' },
                { number: '50+', label: 'Annual Events' },
                { number: '30+', label: 'Volunteers' },
                { number: '$100K+', label: 'Community Service' },
              ].map((stat, index) => (
                <div key={index} className="p-8 bg-gradient-to-br from-primary/10 to-transparent rounded-lg">
                  <h3 className="text-4xl font-serif font-bold text-primary mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-gray-700 font-semibold">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How Donations Are Used */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-center text-black mb-16">
              How We Use Your Donations
            </h2>
            <div className="space-y-6">
              {[
                { category: 'Educational Programs', percent: 35, color: 'from-primary' },
                { category: 'Community Events', percent: 25, color: 'from-secondary' },
                { category: 'Facility & Operations', percent: 20, color: 'from-primary' },
                { category: 'Community Service', percent: 20, color: 'from-secondary' },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <h3 className="font-semibold text-black">
                      {item.category}
                    </h3>
                    <span className="font-bold text-primary">
                      {item.percent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${item.color} to-opacity-70 h-full rounded-full transition-all`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-700 mt-12">
              We are a transparent organization committed to using your donations responsibly and effectively. 
              Our financial reports are available upon request.
            </p>
          </div>
        </section>

        {/* Donation Form */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-center text-black mb-12">
              Make Your Donation
            </h2>
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-lg border-2 border-primary/20">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your first name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your last name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Donation Amount
                  </label>
                  <div className="flex gap-3 mb-4">
                    {['$25', '$50', '$100', '$250'].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        className="flex-1 py-2 px-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    placeholder="Or enter custom amount"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Donation Type
                  </label>
                  <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary">
                    <option>One-time Donation</option>
                    <option>Monthly Recurring</option>
                    <option>Annual Donation</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="anonymous"
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-700">
                    Make this donation anonymous
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
                >
                  Donate Now
                </button>

                <p className="text-center text-sm text-gray-600">
                  Your donation is secure and processed through our trusted payment partner.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Corporate Partnerships */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold text-black mb-6">
              Corporate Partnerships
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Are you a business interested in supporting our mission? We offer corporate partnership opportunities with meaningful benefits.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all"
            >
              Explore Partnership Opportunities
            </Link>
          </div>
        </section>

        {/* Tax Information */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-2xl font-serif font-bold text-black mb-4">
              Tax Benefits
            </h3>
            <p className="text-gray-700 mb-4">
              Sanatansamaj is a registered 501(c)(3) nonprofit organization. Your donation is tax-deductible to the extent allowed by law.
            </p>
            <p className="text-gray-700">
              Tax ID: XX-XXXXXXX | Donations are deductible for federal income tax purposes.
            </p>
          </div>
        </section>

        {/* Thank You Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-serif font-bold mb-6">
              Thank You for Your Support
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Your generosity makes our mission possible and helps us serve our community better every day.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
