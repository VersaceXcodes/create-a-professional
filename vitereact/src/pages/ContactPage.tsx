import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import { submitContactForm } from '@/lib/api';
import { toast } from 'sonner';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContactForm(formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', company: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const offices = [
    {
      city: 'Dubai',
      country: 'UAE',
      address: 'DIFC, Gate Building, Level 15\nDubai, United Arab Emirates',
      phone: '+971 4 123 4567',
    },
    {
      city: 'Riyadh',
      country: 'Saudi Arabia',
      address: 'King Fahd Road, Business District\nRiyadh, Saudi Arabia',
      phone: '+966 11 123 4567',
    },
    {
      city: 'Cairo',
      country: 'Egypt',
      address: 'Smart Village, Building B4\nCairo, Egypt',
      phone: '+20 2 1234 5678',
    },
  ];

  return (
    <PageLayout
      title="Contact MENALANE – Get in Touch"
      description="Contact our team for inquiries about our services, market intelligence, and MENA investment advisory."
    >
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-blue-100">
              Get in touch with our team of MENA market experts
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-blue-900 text-white font-semibold rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? 'Sending...' : (
                    <>
                      Send Message
                      <Send className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="mb-8">
                <div className="flex items-start mb-6">
                  <Mail className="w-6 h-6 text-blue-900 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">General Inquiries</h3>
                    <a href="mailto:info@menalane.com" className="text-blue-900 hover:text-blue-700">
                      info@menalane.com
                    </a>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Offices</h3>
              <div className="space-y-6">
                {offices.map((office) => (
                  <div key={office.city} className="border-l-4 border-blue-900 pl-4">
                    <h4 className="font-bold text-lg text-gray-900 mb-2">
                      {office.city}, {office.country}
                    </h4>
                    <div className="flex items-start text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                      <p className="text-sm whitespace-pre-line">{office.address}</p>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="text-sm hover:text-blue-900">
                        {office.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ContactPage;
