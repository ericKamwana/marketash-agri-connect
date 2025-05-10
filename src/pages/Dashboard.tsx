
import { useEffect, useState } from 'react';
import { useSupabase } from '@/lib/supabase/supabase-provider';
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, 
  Activity, 
  ShoppingBag, 
  Truck, 
  Star, 
  CreditCard,
  User,
  MapPin,
  Package
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type UserStats = {
  totalSales: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
};

const Dashboard = () => {
  const { userProfile, loading, supabase } = useSupabase();
  const [stats, setStats] = useState<UserStats>({
    totalSales: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
  });
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userProfile) return;
      
      try {
        // Make sure to convert userProfile.id to a string for all database queries
        const userId = userProfile.id.toString();
        
        // Fetch user transactions - using string ID for the query
        const { data: transactions, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);
          
        if (transactionsError) throw transactionsError;
        
        // Fetch user products if they are a farmer
        let products = [];
        if (userProfile.user_type === 'farmer') {
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('user_id', userId);
            
          if (productsError) throw productsError;
          products = productsData || [];
        }
        
        // Calculate statistics - using string ID for all comparisons
        const sales = transactions?.filter(t => t.seller_id === userId).length || 0;
        const orders = transactions?.filter(t => t.buyer_id === userId).length || 0;
        const revenue = transactions?.filter(t => t.seller_id === userId)
          .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
        
        setStats({
          totalSales: sales,
          totalOrders: orders,
          totalRevenue: revenue,
          averageRating: userProfile.rating || 0,
        });
        
        setUserProducts(products || []);
        setUserTransactions(transactions || []);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          variant: "destructive",
          title: "Failed to load dashboard",
          description: "We couldn't load your data. Please try again later.",
        });
      }
    };
    
    if (userProfile) {
      fetchUserData();
    }
  }, [userProfile, toast, supabase]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-marketash-blue"></div>
      </div>
    );
  }
  
  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to view your dashboard</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <a href="/auth">Sign In</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Welcome, {userProfile.display_name || 'User'}</CardTitle>
              <CardDescription>
                Account Type: {userProfile.user_type === 'farmer' ? 'Farmer/Seller' : 'Buyer'}
              </CardDescription>
            </div>
            <Avatar className="h-16 w-16">
              <AvatarImage src={userProfile.avatar_url || ''} />
              <AvatarFallback className="bg-marketash-blue text-white text-lg">
                {userProfile.display_name ? userProfile.display_name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-marketash-blue" />
              <span className="text-gray-500">Profile: {userProfile.display_name || 'Not set'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-marketash-green" />
              <span className="text-gray-500">Location: {userProfile.location || 'Not set'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-amber-500" />
              <span className="text-gray-500">Credit Score: {userProfile.credit_score || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-gray-500">Rating: {userProfile.rating || 0}/5</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-marketash-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales}</div>
            <p className="text-xs text-muted-foreground">Products sold</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-marketash-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Products purchased</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total earnings</p>
          </CardContent>
        </Card>
      </div>

      {userProfile.user_type === 'farmer' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">My Products</h2>
          {userProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProducts.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle>{product.title}</CardTitle>
                    <CardDescription>
                      Status: <span className={`font-medium ${
                        product.status === 'available' ? 'text-green-500' : 
                        product.status === 'sold' ? 'text-red-500' : 'text-amber-500'
                      }`}>{product.status}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-bold">KSh {parseFloat(product.base_price).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{product.quantity} {product.unit} available</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-6">
                <p className="text-center text-gray-500">You haven't listed any products yet.</p>
                <div className="flex justify-center mt-4">
                  <Button asChild>
                    <a href="/marketplace">Add Product</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        {userTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {userTransactions.slice(0, 5).map((transaction) => {
                  const isSeller = transaction.seller_id === userProfile.id;
                  return (
                    <tr key={transaction.id} className="border-b border-gray-200">
                      <td className="px-4 py-2">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <span className={isSeller ? "text-green-500" : "text-blue-500"}>
                          {isSeller ? "Sale" : "Purchase"}
                        </span>
                      </td>
                      <td className="px-4 py-2">Product ID: {transaction.product_id.substring(0, 8)}...</td>
                      <td className="px-4 py-2">KSh {parseFloat(transaction.amount).toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <span className={
                          transaction.status === 'completed' ? 'text-green-500' : 
                          transaction.status === 'processing' ? 'text-amber-500' : 'text-gray-500'
                        }>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-gray-500">You don't have any transactions yet.</p>
              <div className="flex justify-center mt-4">
                <Button asChild>
                  <a href="/marketplace">Start Shopping</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
