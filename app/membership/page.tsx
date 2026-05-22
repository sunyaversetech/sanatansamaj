import Navbar from '@/components/navbar'
import Link from 'next/link'
import { Check, Users, Heart, Award } from 'lucide-react'

export default function Membership() {
  return (
    <>
      <Navbar />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-6">
              Membership
            </h1>
            <p className="text-xl text-white/80">
              Join our vibrant community and become part of something meaningful
            </p>
          </div>
        </section>

        {/* Membership Info */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-center text-black mb-12">
              Why Join Sanatansamaj?
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {[
                'Access to all community events and programs',
                'Discounted rates on workshops and classes',
                'Exclusive member-only gatherings',
                'Networking opportunities with community leaders',
                'Educational resources and library access',
                'Priority registration for major festivals',
                'Community service opportunities',
                'Family and group membership options',
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Plans */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-center text-black mb-16">
              Choose Your Membership Plan
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Basic',
                  price: '$50',
                  period: 'per year',
                  description: 'Perfect for those just beginning their spiritual journey',
                  features: [
                    'Access to weekly satsang',
                    'Monthly newsletter',
                    'Community event updates',
                    'Basic learning resources',
                    'Community forum access',
                  ],
                  color: 'border-t-4 border-primary',
                },
                {
                  name: 'Premium',
                  price: '$150',
                  period: 'per year',
                  description: 'For active members seeking deeper engagement',
                  features: [
                    'All Basic benefits',
                    'Access to all events & workshops',
                    'Discounts on programs (20%)',
                    'Priority event registration',
                    'Member-only networking events',
                    'Mentorship program access',
                    'Exclusive online courses',
                  ],
                  color: 'border-t-4 border-secondary',
                  highlighted: true,
                },
                {
                  name: 'Family',
                  price: '$300',
                  period: 'per year',
                  description: 'For families wanting to grow together',
                  features: [
                    'All Premium benefits (4 members)',
                    'Family event packages',
                    'Children\'s education programs',
                    'Family mentorship',
                    'Extended online resource library',
                    'Priority on family activities',
                    'Annual family retreat',
                  ],
                  color: 'border-t-4 border-primary',
                },
              ].map((plan, index) => (
                <div
                  key={index}
                  className={`p-8 rounded-lg shadow-lg transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-br from-secondary/10 to-transparent scale-105 shadow-2xl'
                      : 'bg-white'
                  } ${plan.color}`}
                >
                  {plan.highlighted && (
                    <div className="mb-4 inline-block px-3 py-1 bg-secondary text-white text-sm font-bold rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-3xl font-serif font-bold text-black mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    {plan.description}
                  </p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold text-primary">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-4 font-semibold rounded-lg transition-all transform hover:scale-105 ${
                      plan.highlighted
                        ? 'bg-secondary text-white hover:bg-opacity-90'
                        : 'bg-primary text-white hover:bg-opacity-90'
                    }`}
                  >
                    Choose {plan.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Donation-Based Membership */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold text-black mb-6">
              Financial Constraints?
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              We believe everyone should have access to our community. Membership options are available on a sliding scale or through service contributions.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all"
            >
              Contact Us About Options
            </Link>
          </div>
        </section>

        {/* How to Join */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-center text-black mb-16">
              How to Join
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Choose Plan',
                  description: 'Select the membership plan that best suits your needs and budget.',
                },
                {
                  step: '2',
                  title: 'Register',
                  description: 'Fill out our membership form with your contact information.',
                },
                {
                  step: '3',
                  title: 'Payment',
                  description: 'Make payment through our secure payment gateway.',
                },
                {
                  step: '4',
                  title: 'Welcome!',
                  description: 'Receive your membership confirmation and gain access to benefits.',
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-serif font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-black mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-700">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Member Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-center text-black mb-16">
              What Our Members Say
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Amit Sharma',
                  text: 'Joining Sanatansamaj has been transformative. The community support and spiritual guidance have enriched my life immensely.',
                },
                {
                  name: 'Pooja Gupta',
                  text: 'This is the perfect place for my family to connect with our heritage. The events are well-organized and truly meaningful.',
                },
                {
                  name: 'Ravi Patel',
                  text: 'I love being part of this community. The educational programs have deepened my understanding of our traditions.',
                },
              ].map((testimonial, index) => (
                <div key={index} className="p-8 bg-white rounded-lg shadow-lg border-l-4 border-primary">
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
  )
}
