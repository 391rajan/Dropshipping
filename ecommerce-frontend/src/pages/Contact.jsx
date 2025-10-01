import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would handle form submission here,
    // e.g., send the data to your backend.
    alert("Thank you for your message! We'll get back to you soon.");
    e.target.reset(); // Reset form after submission
  };

  return (
    <main className="bg-background min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Get in Touch</h1>
          <p className="text-lg text-accent/90 max-w-3xl mx-auto">
            Have a question or feedback? We'd love to hear from you. Fill out the form below or use our contact details to reach us directly.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-12">
          {/* Contact Information */}
          <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-lg border border-accent/20">
            <h2 className="text-3xl font-bold text-accent mb-8">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <FaEnvelope className="mt-1 mr-4 text-primary flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-lg text-accent">Email</h3>
                  <a href="mailto:contact@estore.com" className="text-accent/80 hover:text-primary transition">contact@estore.com</a>
                </div>
              </div>
              <div className="flex items-start">
                <FaPhone className="mt-1 mr-4 text-primary flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-lg text-accent">Phone</h3>
                  <p className="text-accent/80">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-4 text-primary flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-lg text-accent">Address</h3>
                  <p className="text-accent/80">123 Business Street, Suite 100<br />San Francisco, CA 94107</p>
                </div>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-accent/20">
              <h3 className="text-xl font-semibold text-accent mb-4">Business Hours</h3>
              <p className="text-accent/80">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-3 bg-white p-8 rounded-xl shadow-lg border border-accent/20">
            <h2 className="text-3xl font-bold text-accent mb-8">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-accent/80 mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-accent/80 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-accent/80 mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-accent/80 mb-2">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  required
                  className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  placeholder="Write your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-accent text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contact;