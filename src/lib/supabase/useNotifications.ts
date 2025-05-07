
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./supabase-provider";
import { toast } from "sonner";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  data: any;
  created_at: string;
}

export function useNotifications() {
  const { supabase, user } = useSupabase();
  const queryClient = useQueryClient();
  const [newNotificationCount, setNewNotificationCount] = useState(0);

  // Fetch all notifications for the current user
  const fetchNotifications = async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      throw new Error(error.message);
    }

    const unreadCount = (data || []).filter((n: Notification) => !n.read).length;
    setNewNotificationCount(unreadCount);
    
    return data as Notification[];
  };

  // Use the fetchNotifications function with react-query
  const useNotificationsQuery = () => {
    return useQuery({
      queryKey: ["notifications"],
      queryFn: fetchNotifications,
      enabled: !!user,
      staleTime: 30 * 1000, // 30 seconds
    });
  };

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error marking notification as read:", error);
      throw new Error(error.message);
    }

    return data;
  };

  // Use the markAsRead function with react-query
  const useMarkAsReadMutation = () => {
    return useMutation({
      mutationFn: markAsRead,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["notifications"],
        });
      },
      onError: (error) => {
        toast.error(`Failed to mark notification as read: ${error.message}`);
      },
    });
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false)
      .select();

    if (error) {
      console.error("Error marking all notifications as read:", error);
      throw new Error(error.message);
    }

    setNewNotificationCount(0);
    return data;
  };

  // Use the markAllAsRead function with react-query
  const useMarkAllAsReadMutation = () => {
    return useMutation({
      mutationFn: markAllAsRead,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["notifications"],
        });
      },
      onError: (error) => {
        toast.error(`Failed to mark all notifications as read: ${error.message}`);
      },
    });
  };

  // Listen for real-time notifications
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const notification = payload.new as Notification;
          
          // Show toast for new notification
          toast({
            title: notification.title,
            description: notification.message,
          });
          
          // Update notification count
          setNewNotificationCount((prev) => prev + 1);
          
          // Invalidate the notifications query to refetch
          queryClient.invalidateQueries({
            queryKey: ["notifications"],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [supabase, user, queryClient]);

  return {
    useNotificationsQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
    newNotificationCount,
  };
}
