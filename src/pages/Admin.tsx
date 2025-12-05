import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useFirebaseUsers, useFirebaseCommunity } from "@/hooks/useFirebaseData";
import { StatsCard } from "@/components/admin/StatsCard";
import { UsersTable } from "@/components/admin/UsersTable";
import { CommunityTable } from "@/components/admin/CommunityTable";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Activity, Brain, BarChart3, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { users, loading: usersLoading } = useFirebaseUsers();
  const { members, loading: communityLoading } = useFirebaseCommunity();
  const [activeTab, setActiveTab] = useState("patients");

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  // Calculate stats
  const totalPatients = users.length;
  const totalCommunity = members.length;
  const lowRiskCount = users.filter(u => u.result?.profileType === "low-risk").length;
  const avgRiskScore = users.length > 0
    ? Math.round(users.reduce((sum, u) => sum + (u.result?.riskScore || 0), 0) / users.length)
    : 0;

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | ZLAQA</title>
        <meta name="description" content="ZLAQA Admin Dashboard - Patient management and analytics" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-brand flex items-center justify-center">
                  <span className="text-xl font-bold text-foreground">Z</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground tracking-tight">ZLAQA</h1>
                  <p className="text-xs text-muted-foreground">Admin Dashboard</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-muted-foreground">Secure Portal</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Patients"
              value={totalPatients}
              subtitle="Assessment completions"
              icon={Users}
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Community Members"
              value={totalCommunity}
              subtitle="Joined support network"
              icon={UserPlus}
            />
            <StatsCard
              title="Low Risk Profiles"
              value={lowRiskCount}
              subtitle={`${totalPatients > 0 ? Math.round((lowRiskCount / totalPatients) * 100) : 0}% of patients`}
              icon={Activity}
            />
            <StatsCard
              title="Avg Risk Score"
              value={avgRiskScore}
              subtitle="Across all patients"
              icon={Brain}
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="patients" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <Users className="h-4 w-4" />
                  Patients
                </TabsTrigger>
                <TabsTrigger value="community" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <UserPlus className="h-4 w-4" />
                  Community
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="patients" className="animate-fade-in">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Patient Records</h2>
                  <p className="text-muted-foreground">Assessment results and clinical data</p>
                </div>
                <UsersTable users={users} loading={usersLoading} />
              </div>
            </TabsContent>

            <TabsContent value="community" className="animate-fade-in">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Community Members</h2>
                  <p className="text-muted-foreground">Support network participants</p>
                </div>
                <CommunityTable members={members} loading={communityLoading} />
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="animate-fade-in">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Analytics Overview</h2>
                  <p className="text-muted-foreground">Insights and performance metrics</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Risk Distribution */}
                  <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                    <h3 className="font-semibold text-foreground mb-4">Risk Distribution</h3>
                    <div className="space-y-4">
                      {["low-risk", "moderate-risk", "high-risk"].map((type) => {
                        const count = users.filter(u => u.result?.profileType === type).length;
                        const percentage = totalPatients > 0 ? (count / totalPatients) * 100 : 0;
                        return (
                          <div key={type} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize text-foreground">{type.replace("-", " ")}</span>
                              <span className="text-muted-foreground">{count} ({Math.round(percentage)}%)</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  type === "low-risk" ? "bg-accent" : 
                                  type === "moderate-risk" ? "bg-yellow-500" : "bg-destructive"
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Common Triggers */}
                  <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                    <h3 className="font-semibold text-foreground mb-4">Common Triggers</h3>
                    <div className="space-y-3">
                      {(() => {
                        const triggerCounts: Record<string, number> = {};
                        users.forEach(u => {
                          u.result?.triggers?.forEach(t => {
                            triggerCounts[t] = (triggerCounts[t] || 0) + 1;
                          });
                        });
                        return Object.entries(triggerCounts)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 5)
                          .map(([trigger, count]) => (
                            <div key={trigger} className="flex items-center justify-between">
                              <span className="text-sm text-foreground">{trigger}</span>
                              <span className="text-sm font-medium text-accent">{count}</span>
                            </div>
                          ));
                      })()}
                      {users.length === 0 && (
                        <p className="text-sm text-muted-foreground">No data available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-6 mt-12">
          <div className="container mx-auto px-6 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 ZLAQA. Clinical Assessment Platform. All data is confidential.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
