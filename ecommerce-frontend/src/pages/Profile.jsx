import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { MapPin, Package, CreditCard, User, Bell } from 'lucide-react';
import { orderAPI } from '../services/api';
import AddressManagement from '../components/AddressManagement';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Profile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!localStorage.getItem('token')) {
        setError('Please login to view your profile');
        setLoading(false);
        return;
      }

      try {
        const ordersData = await orderAPI.getMyOrders();
        setOrders(ordersData);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.response?.data?.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const tabs = [
    { name: 'Orders', icon: Package },
    { name: 'Addresses', icon: MapPin },
    { name: 'Payment Methods', icon: CreditCard },
    { name: 'Account Settings', icon: User },
    { name: 'Notifications', icon: Bell },
  ];

  return (
    <main className="bg-background min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="mb-8 text-center">
            <div className="relative inline-block">
              <img
                src="https://randomuser.me/api/portraits/men/88.jpg"
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-primary"
              />
              <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-accent transition-colors">
                <User size={16} />
              </button>
            </div>
            <h1 className="text-2xl font-bold text-primary mt-4">John Doe</h1>
            <p className="text-accent">Member since August 2025</p>
          </div>

          {/* Tabs Navigation */}
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-accent/10 p-1 mb-8">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-3 px-4 text-sm font-medium leading-5',
                      'flex items-center justify-center gap-2',
                      'focus:outline-none',
                      selected
                        ? 'bg-primary text-white shadow'
                        : 'text-accent hover:bg-accent/20'
                    )
                  }
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.name}</span>
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels>
              {/* Orders Panel */}
              <Tab.Panel>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : error ? (
                    <div className="text-red-500 text-center py-8">{error}</div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-16 h-16 text-accent/50 mx-auto mb-4" />
                      <p className="text-accent">No orders found</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order._id} className="bg-white rounded-lg shadow p-6 border border-accent/10">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-primary font-semibold">Order #{order._id.slice(-6)}</h3>
                            <p className="text-accent text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Tab.Panel>

              {/* Addresses Panel */}
              <Tab.Panel>
                <AddressManagement />
              </Tab.Panel>

              {/* Payment Methods Panel */}
              <Tab.Panel>
                <div className="text-center py-8">
                  <CreditCard className="w-16 h-16 text-accent/50 mx-auto mb-4" />
                  <p className="text-accent">Payment methods coming soon</p>
                </div>
              </Tab.Panel>

              {/* Account Settings Panel */}
              <Tab.Panel>
                <div className="bg-white rounded-lg shadow p-6 border border-accent/10">
                  <h3 className="text-primary font-semibold mb-4">Personal Information</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-accent text-sm mb-1">Full Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-accent/20 focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-accent text-sm mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 rounded-lg border border-accent/20 focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-accent text-sm mb-1">Phone</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2 rounded-lg border border-accent/20 focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue="+91 1234567890"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-primary hover:bg-accent text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              </Tab.Panel>

              {/* Notifications Panel */}
              <Tab.Panel>
                <div className="bg-white rounded-lg shadow p-6 border border-accent/10">
                  <h3 className="text-primary font-semibold mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="form-checkbox text-primary rounded" defaultChecked />
                      <span className="text-accent">Order updates</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="form-checkbox text-primary rounded" defaultChecked />
                      <span className="text-accent">Promotional emails</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="form-checkbox text-primary rounded" defaultChecked />
                      <span className="text-accent">New product arrivals</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="form-checkbox text-primary rounded" />
                      <span className="text-accent">Price drop alerts</span>
                    </label>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </main>
  );
}

export default Profile;
