import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { FaMapMarkerAlt, FaBox, FaCreditCard, FaUser, FaBell } from 'react-icons/fa';
import { orderAPI, userAPI } from '../services/api';
import AddressManagement from '../components/AddressManagement';
import { useAuth } from '../context/AuthContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Profile() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    orderUpdates: true,
    promotionalEmails: true,
    newProductArrivals: true,
    priceDropAlerts: false,
  });

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPreferences((prev) => ({ ...prev, [name]: checked }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(false);

    if (password && password !== confirmPassword) {
      setUpdateError('Passwords do not match');
      return;
    }

    try {
      const updatedUser = await userAPI.updateProfile({
        name,
        email,
        phone,
        password: password || undefined,
      });
      setUpdateSuccess(true);
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
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
    
    if (!authLoading) {
      fetchUserData();
    }
  }, [user, authLoading]);

  const tabs = [
    { name: 'Orders', icon: FaBox },
    { name: 'Addresses', icon: FaMapMarkerAlt },
    { name: 'Payment Methods', icon: FaCreditCard },
    { name: 'Account Settings', icon: FaUser },
    { name: 'Notifications', icon: FaBell },
  ];

  if (authLoading || loading) {
    return (
      <main className="bg-background min-h-screen py-10 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="bg-background min-h-screen py-10 flex justify-center items-center">
        <div className="text-red-500 text-center bg-red-100 p-8 rounded-xl shadow-lg border border-red-200">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>{error || 'User not logged in.'}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <div className="relative inline-block">
              <img
                src="https://randomuser.me/api/portraits/men/88.jpg"
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-primary shadow-lg"
              />
              <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-accent transition-colors shadow-md">
                <FaUser size={16} />
              </button>
            </div>
            <h1 className="text-3xl font-bold text-primary mt-4">{user.name}</h1>
            <p className="text-accent/80">{user.email}</p>
          </div>

          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-primary/10 p-1 mb-8">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-3 px-4 text-sm font-medium leading-5',
                      'flex items-center justify-center gap-2',
                      'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                      selected
                        ? 'bg-primary text-white shadow'
                        : 'text-accent hover:bg-white/50'
                    )
                  }
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="hidden md:inline">{tab.name}</span>
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="bg-white rounded-xl shadow-lg border border-accent/20 p-8">
              <Tab.Panel>
                <div className="space-y-6">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : error ? (
                    <div className="text-red-500 text-center py-8">{error}</div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <FaBox className="w-16 h-16 text-accent/30 mx-auto mb-4" />
                      <p className="text-accent/80 text-lg">You have no past orders.</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order._id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-primary font-semibold">Order #{order._id.slice(-6)}</h3>
                            <p className="text-accent/80 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
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

              <Tab.Panel>
                <AddressManagement />
              </Tab.Panel>

              <Tab.Panel>
                <div className="text-center py-12">
                  <FaCreditCard className="w-16 h-16 text-accent/30 mx-auto mb-4" />
                  <p className="text-accent/80 text-lg">Payment methods feature is coming soon.</p>
                </div>
              </Tab.Panel>

              <Tab.Panel>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-6">Account Settings</h3>
                  <form className="space-y-6 max-w-lg mx-auto" onSubmit={handleProfileUpdate}>
                    {updateError && <p className="text-red-500 bg-red-100 p-3 rounded-lg">{updateError}</p>}
                    {updateSuccess && <p className="text-green-500 bg-green-100 p-3 rounded-lg">Profile updated successfully!</p>}
                    <div>
                      <label className="block text-sm font-medium text-accent/80 mb-2">Full Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-accent/80 mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-accent/80 mb-2">Phone</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-accent/80 mb-2">New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-accent/80 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-primary hover:bg-accent text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg transform hover:scale-105"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              </Tab.Panel>

              <Tab.Panel>
                <div className="max-w-lg mx-auto">
                  <h3 className="text-2xl font-bold text-primary mb-6">Notification Preferences</h3>
                  <div className="space-y-5">
                    <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div>
                        <p className="font-semibold text-accent">Order Updates</p>
                        <p className="text-sm text-accent/70">Get notified about your order status.</p>
                      </div>
                      <input type="checkbox" className="form-checkbox h-5 w-5 text-primary rounded" name="orderUpdates" checked={notificationPreferences.orderUpdates} onChange={handleNotificationChange} />
                    </label>
                    <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div>
                        <p className="font-semibold text-accent">Promotional Emails</p>
                        <p className="text-sm text-accent/70">Receive news about deals and offers.</p>
                      </div>
                      <input type="checkbox" className="form-checkbox h-5 w-5 text-primary rounded" name="promotionalEmails" checked={notificationPreferences.promotionalEmails} onChange={handleNotificationChange} />
                    </label>
                    <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div>
                        <p className="font-semibold text-accent">New Product Arrivals</p>
                        <p className="text-sm text-accent/70">Be the first to know about new items.</p>
                      </div>
                      <input type="checkbox" className="form-checkbox h-5 w-5 text-primary rounded" name="newProductArrivals" checked={notificationPreferences.newProductArrivals} onChange={handleNotificationChange} />
                    </label>
                    <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div>
                        <p className="font-semibold text-accent">Price Drop Alerts</p>
                        <p className="text-sm text-accent/70">Get alerts when items you like go on sale.</p>
                      </div>
                      <input type="checkbox" className="form-checkbox h-5 w-5 text-primary rounded" name="priceDropAlerts" checked={notificationPreferences.priceDropAlerts} onChange={handleNotificationChange} />
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