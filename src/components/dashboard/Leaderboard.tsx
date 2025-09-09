import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Star, TrendingUp, Award, Target, Calendar, Users } from "lucide-react";

export const Leaderboard = () => {
  const leaderboardData = [
    { rank: 1, name: "TradeMaster Pro", returns: "+24.5%", value: "₹12,45,000", trades: 156, badge: "🏆", streak: 12 },
    { rank: 2, name: "StockGuru_2024", returns: "+22.8%", value: "₹12,28,000", trades: 89, badge: "🥈", streak: 8 },
    { rank: 3, name: "WolfOfDalal", returns: "+19.2%", value: "₹11,92,000", trades: 234, badge: "🥉", streak: 15 },
    { rank: 4, name: "BullRunner", returns: "+18.7%", value: "₹11,87,000", trades: 67, badge: "⭐", streak: 5 },
    { rank: 5, name: "MarketMaven", returns: "+17.9%", value: "₹11,79,000", trades: 123, badge: "🌟", streak: 9 },
    { rank: 6, name: "You", returns: "+15.8%", value: "₹11,58,000", trades: 47, badge: "👤", streak: 3 },
    { rank: 7, name: "ChartExpert", returns: "+14.2%", value: "₹11,42,000", trades: 98, badge: "📈", streak: 7 },
    { rank: 8, name: "ValuePicker", returns: "+13.8%", value: "₹11,38,000", trades: 43, badge: "💎", streak: 4 },
  ];

  const challenges = [
    {
      id: 1,
      title: "Profit Streak Challenge",
      description: "Make profitable trades for 7 consecutive days",
      progress: 3,
      target: 7,
      reward: "2,000 credits",
      badge: "🔥",
      daysLeft: 4
    },
    {
      id: 2,
      title: "Diversification Master",
      description: "Hold stocks from 5 different sectors",
      progress: 3,
      target: 5,
      reward: "1,500 credits",
      badge: "🌍",
      daysLeft: 10
    },
    {
      id: 3,
      title: "Risk Manager",
      description: "Keep portfolio risk under 15% for a month",
      progress: 12,
      target: 30,
      reward: "3,000 credits",
      badge: "🛡️",
      daysLeft: 18
    }
  ];

  const badges = [
    { name: "First Trade", description: "Complete your first trade", earned: true, icon: "🎯" },
    { name: "Profit Maker", description: "Make your first profitable trade", earned: true, icon: "💰" },
    { name: "Risk Manager", description: "Set stop loss on 10 trades", earned: true, icon: "🛡️" },
    { name: "Diversifier", description: "Hold 5+ different stocks", earned: false, icon: "🌈" },
    { name: "Market Timer", description: "Make profitable trades on 5 consecutive days", earned: false, icon: "⏰" },
    { name: "High Roller", description: "Make a trade worth ₹1 Lakh+", earned: true, icon: "🎲" },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-premium" />
                Top Performers (This Month)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboardData.map((trader) => (
                  <div
                    key={trader.rank}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                      trader.name === "You" 
                        ? "border-primary bg-primary/5 shadow-md" 
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={`w-8 h-8 rounded-full p-0 flex items-center justify-center ${
                            trader.rank <= 3 
                              ? "bg-premium text-premium-foreground" 
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {trader.rank}
                        </Badge>
                        <span className="text-lg">{trader.badge}</span>
                      </div>
                      
                      <div>
                        <p className={`font-semibold ${trader.name === "You" ? "text-primary" : "text-foreground"}`}>
                          {trader.name}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{trader.trades} trades</span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {trader.streak} day streak
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-success text-lg">{trader.returns}</p>
                      <p className="text-sm text-muted-foreground">{trader.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline">View Full Leaderboard</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-premium" />
                Active Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{challenge.badge}</span>
                        <div>
                          <h3 className="font-semibold text-foreground">{challenge.title}</h3>
                          <p className="text-sm text-muted-foreground">{challenge.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {challenge.daysLeft}d left
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{challenge.progress}/{challenge.target}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-premium" />
                        <span className="text-sm font-medium">Reward: {challenge.reward}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="w-5 h-5 text-premium" />
                Achievement Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border transition-all ${
                      badge.earned 
                        ? "border-success bg-success/5" 
                        : "border-border bg-muted/20 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{badge.icon}</span>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${badge.earned ? "text-success" : "text-muted-foreground"}`}>
                          {badge.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                      </div>
                      {badge.earned && (
                        <Badge className="bg-success text-success-foreground">
                          Earned
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-primary">Badge Progress</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  You've earned 4 out of 6 badges. Complete more challenges to unlock all achievements!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};