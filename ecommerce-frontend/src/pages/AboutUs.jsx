import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  // Example team members
  const teamMembers = [
    { name: "Alice Johnson", role: "Founder & CEO", avatar: "https://randomuser.me/api/portraits/women/68.jpg", bio: "Alice founded the company with a passion for delivering quality products and exceptional customer service." },
    { name: "Bob Williams", role: "Head of Operations", avatar: "https://randomuser.me/api/portraits/men/75.jpg", bio: "Bob ensures that everything runs smoothly from warehouse to your doorstep." },
    { name: "Charlie Brown", role: "Marketing Director", avatar: "https://randomuser.me/api/portraits/men/80.jpg", bio: "Charlie is the creative mind behind our brand, connecting with customers worldwide." },
  ];

  // Core values
  const values = [
    { icon: "🌟", title: "Customer Obsession", description: "We start with the customer and work backwards. We work vigorously to earn and keep customer trust." },
    { icon: "💡", title: "Innovation", description: "We are never done improving. We constantly seek to innovate and create better solutions for our customers." },
    { icon: "🤝", title: "Integrity", description: "We are honest, transparent, and committed to doing what’s best for our customers and our company." },
  ];

  return (
    <div className="bg-background text-accent">
      {/* Hero Section */}
      <section className="bg-primary/10 py-16 text-center">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">About Our Store</h1>
          <p className="text-lg md:text-xl text-accent/90 max-w-3xl mx-auto">
            Your one-stop shop for high-quality products, curated with passion and delivered with care.
          </p>
        </div>
      </section>

      {/* Our Story & Mission Section */}
      <section className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-4">Our Story</h2>
            <p className="mb-4 text-accent/80">
              Founded in 2023, our store was born from a simple idea: to make great products accessible to everyone. What started as a small passion project has grown into a thriving online destination for shoppers who value quality, style, and convenience. We believe that shopping should be an enjoyable and seamless experience, and we've built our platform to reflect that.
            </p>
            <p className="text-accent/80">
              From our carefully curated collections to our dedicated customer support, every detail is designed with you in mind.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary mb-4">Our Mission</h2>
            <p className="text-accent/80">
              Our mission is to enrich our customers' lives by providing an exceptional selection of products that combine quality, innovation, and value. We are committed to creating a trusted and delightful shopping experience, fostering a community built on satisfaction and long-term relationships.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary mb-10">Our Core Values</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((value) => (
              <div key={value.title} className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
                <span className="text-5xl mb-4">{value.icon}</span>
                <h3 className="text-xl font-semibold text-accent mb-2">{value.title}</h3>
                <p className="text-accent/80">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet The Team Section */}
      <section className="container mx-auto px-4 md:px-8 py-16">
        <h2 className="text-3xl font-bold text-primary text-center mb-10">Meet The Team</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-white rounded-xl shadow p-6 w-80 flex flex-col items-center text-center border border-accent/20">
              <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-primary" />
              <h3 className="text-xl font-semibold text-primary">{member.name}</h3>
              <p className="text-accent font-medium mb-2">{member.role}</p>
              <p className="text-accent/80 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-accent/10 py-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold text-accent mb-4">Ready to Start Shopping?</h2>
          <p className="text-accent/90 mb-8 max-w-2xl mx-auto">
            Explore our wide range of products and find exactly what you're looking for. Join our community of happy shoppers today!
          </p>
          <Link
            to="/shop"
            className="inline-block bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Explore All Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;