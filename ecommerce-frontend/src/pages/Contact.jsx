import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would handle form submission here,
    // e.g., send the data to your backend.
    alert("Thank you for your message! We'll get back to you soon.");
    e.target.reset(); // Reset form after submission
  };

  return (
    <main className="bg-background min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Get in Touch</h1>
          <p className="text-lg text-accent/90 max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you. Fill out the form below or use our contact details to reach us directly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow-lg border border-accent/10">
          {/* Contact Form */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-accent mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-accent/80 mb-1">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary transition"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-accent/80 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary transition"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-accent/80 mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary transition"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-accent/80 mb-1">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary transition"
                  placeholder="Write your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-md transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-accent mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="mt-1 mr-3 text-primary flex-shrink-0" size={20} />
                  <p className="text-accent/90">contact@company.com</p>
                </div>
                <div className="flex items-start">
                  <Phone className="mt-1 mr-3 text-primary flex-shrink-0" size={20} />
                  <p className="text-accent/90">+1 (555) 123-4567</p>
                </div>
                <div className="flex items-start">
                  <MapPin className="mt-1 mr-3 text-primary flex-shrink-0" size={20} />
                  <p className="text-accent/90">123 Business Street, Suite 100<br />San Francisco, CA 94107</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-accent mb-4">Business Hours</h3>
              <p className="text-accent/90">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contact;
