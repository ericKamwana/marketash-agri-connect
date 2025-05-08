
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { useSupabase } from '@/lib/supabase/supabase-provider';
import { useNotifications, Notification } from '@/lib/supabase/useNotifications';
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle, ShoppingBag, AlertCircle, CreditCard, Calendar, Truck } from 'lucide-react';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'bid':
      return <ShoppingBag className="h-5 w-5 text-marketash-blue" />;
    case 'bid_accepted':
      return <CheckCircle className="h-5 w-5 text-marketash-green" />;
    case 'bid_rejected':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'payment':
      return <CreditCard className="h-5 w-5 text-purple-500" />;
    case 'reminder':
      return <Calendar className="h-5 w-5 text-amber-500" />;
    case 'delivery':
      return <Truck className="h-5 w-5 text-blue-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useSupabase();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  
  // Redirect to login if not authenticated
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  const { 
    useNotificationsQuery, 
    useMarkAsReadMutation,
    useMarkAllAsReadMutation 
  } = useNotifications();
  
  const { data: notifications = [], isLoading } = useNotificationsQuery();
  const { mutate: markAsRead } = useMarkAsReadMutation();
  const { mutate: markAllAsRead } = useMarkAllAsReadMutation();
  
  const unreadNotifications = notifications.filter(n => !n.read);
  const displayNotifications = activeTab === 'all' ? notifications : unreadNotifications;
  
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Navigate based on the notification type and reference
    if (notification.reference_id) {
      if (notification.type.includes('bid')) {
        navigate(`/marketplace/product/${notification.reference_id}`);
      } else if (notification.type.includes('payment') || notification.type.includes('transaction')) {
        navigate(`/dashboard`);
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-marketash-gray py-8 pt-24">
        <div className="container mx-auto px-4">
          {/* Header with filter tabs */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => setActiveTab('all')} 
                variant={activeTab === 'all' ? 'default' : 'outline'}
                className={activeTab === 'all' ? 'bg-marketash-blue text-white' : ''}
              >
                All
              </Button>
              <Button 
                onClick={() => setActiveTab('unread')} 
                variant={activeTab === 'unread' ? 'default' : 'outline'}
                className={activeTab === 'unread' ? 'bg-marketash-blue text-white' : ''}
              >
                Unread {unreadNotifications.length > 0 && `(${unreadNotifications.length})`}
              </Button>
              {unreadNotifications.length > 0 && (
                <Button 
                  onClick={() => markAllAsRead()} 
                  variant="ghost"
                  className="text-marketash-blue hover:text-marketash-blue/80"
                >
                  Mark all as read
                </Button>
              )}
            </div>
          </div>
          
          {/* Notifications list */}
          <div className="space-y-4">
            {isLoading ? (
              // Loading state
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4 flex items-center space-x-4">
                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                    <div className="h-3 bg-gray-100 rounded w-20"></div>
                  </CardContent>
                </Card>
              ))
            ) : displayNotifications.length === 0 ? (
              // Empty state
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-600">No notifications</h2>
                <p className="text-gray-500 mt-2">
                  {activeTab === 'all' 
                    ? "You don't have any notifications yet" 
                    : "You don't have any unread notifications"}
                </p>
              </div>
            ) : (
              // Notifications
              displayNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${!notification.read ? 'border-l-4 border-l-marketash-blue' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4 flex items-start space-x-4">
                    <div className="rounded-full bg-gray-100 p-2">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-medium ${!notification.read ? 'text-marketash-blue' : 'text-gray-800'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500">{formatDate(notification.created_at)}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Notifications;
