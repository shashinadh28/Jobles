import { useState } from 'react';
import { subscribeToJobAlerts } from '@/lib/subscription';
import { toast } from 'sonner';

const [email, setEmail] = useState('');
const [isSubscribing, setIsSubscribing] = useState(false);

const handleSubscribe = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubscribing(true);
  
  try {
    const result = await subscribeToJobAlerts(email);
    if (result.success) {
      toast.success(result.message);
      setEmail('');
    } else {
      toast.error(result.message);
    }
  } catch (error) {
    toast.error('Failed to subscribe. Please try again later.');
  } finally {
    setIsSubscribing(false);
  }
};

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Subscribe</h3>
            <p className="text-gray-600">Get the latest job updates delivered to your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">About Us</h3>
            <p className="text-gray-600 max-w-md">
              JoBless started with a vision to provide latest placement updates for students & fresher graduates. Keep visiting for daily updates.
            </p>
          </div> 