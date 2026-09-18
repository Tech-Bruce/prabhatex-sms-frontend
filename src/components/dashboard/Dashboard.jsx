import React from 'react';
import { TrendingUp, Users, Activity, CreditCard, MessageSquare } from 'lucide-react';

const StatCard = ({ title, value, change, positive, icon: Icon }) => (
  <div className="bg-white backdrop-blur-xl border border-slate-200 p-6 rounded-2xl hover:border-slate-300 transition-colors shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-slate-100 rounded-lg">
        <Icon className="h-5 w-5 text-indigo-600" />
      </div>
      <span className={`text-sm font-medium ${positive ? 'text-emerald-600' : 'text-red-600'}`}>
        {positive ? '+' : ''}{change}%
      </span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold mt-1 text-slate-900">{value}</p>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Earnings" value="$45,231.89" change="20.1" positive={true} icon={CreditCard} />
        <StatCard title="SMS Sent" value="12,350" change="15.2" positive={true} icon={MessageSquare} />
        <StatCard title="Total Customers" value="4,520" change="-2.4" positive={false} icon={Users} />
        <StatCard title="Conversion Rate" value="12.5%" change="4.1" positive={true} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white backdrop-blur-xl border border-slate-200 p-6 rounded-2xl h-96 flex flex-col shadow-sm">
          <h3 className="font-semibold mb-4 text-lg text-slate-900">Earnings Overview</h3>
          <div className="flex-1 flex items-center justify-center border border-slate-200 border-dashed rounded-xl bg-slate-50 text-slate-400">
            [Chart Placeholder]
          </div>
        </div>
        
        <div className="bg-white backdrop-blur-xl border border-slate-200 p-6 rounded-2xl h-96 flex flex-col shadow-sm">
          <h3 className="font-semibold mb-4 text-lg text-slate-900">Recent SMS Campaigns</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 pb-4 border-b border-slate-200 last:border-0">
                <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Promo Campaign #{i}</p>
                  <p className="text-xs text-slate-500">Sent to {500 * i} recipients • 2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
