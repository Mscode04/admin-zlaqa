import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Shield, 
  Activity, 
  Users, 
  ChevronRight, 
  Sparkles,
  Heart,
  Target,
  Mic,
  CheckCircle,
  ArrowRight,
  Star
} from "lucide-react";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <Helmet>
        <title>ZLAQA - Speech Assessment & Therapy Platform</title>
        <meta name="description" content="ZLAQA helps individuals understand and manage stuttering through scientifically-backed assessments and personalized therapy exercises." />
      </Helmet>

      <div className="min-h-screen bg-background overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-accent/5 to-transparent rounded-full" />
        </div>

        {/* Navigation */}
        <nav className="relative z-50 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-accent/20">
                  <span className="text-xl font-bold text-foreground">Z</span>
                </div>
                <span className="text-xl font-bold text-foreground tracking-tight">ZLAQA</span>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
                <Button className="bg-gradient-brand hover:opacity-90 text-foreground shadow-lg shadow-accent/20">
                  Start Assessment
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 pt-20 pb-32">
          <div className="container mx-auto px-6">
            <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Badge className="mb-6 bg-accent/10 text-accent border-accent/30 px-4 py-1.5 animate-fade-in">
                <Sparkles className="h-3 w-3 mr-2" />
                Clinically Validated Assessment
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
                Transform Your
                <span className="block text-accent">Speech Journey</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                ZLAQA uses scientifically-backed methods to assess stuttering patterns and 
                deliver personalized therapy exercises that help you communicate with confidence.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-gradient-brand hover:opacity-90 text-foreground h-14 px-8 text-lg shadow-xl shadow-accent/30 hover-scale">
                  <Mic className="h-5 w-5 mr-2" />
                  Take Free Assessment
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-border hover:bg-muted">
                  Learn More
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>5,000+ Assessments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>Clinical Grade</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>100% Private</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative z-10 py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Science-Backed Approach
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our assessment framework is built on decades of speech pathology research
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: Brain,
                  title: "Cognitive Analysis",
                  description: "Understand your stuttering patterns through comprehensive cognitive and behavioral assessments.",
                  color: "text-blue-500",
                  bg: "bg-blue-500/10"
                },
                {
                  icon: Heart,
                  title: "Emotional Support",
                  description: "Track emotional triggers and receive personalized coping strategies for anxiety management.",
                  color: "text-red-500",
                  bg: "bg-red-500/10"
                },
                {
                  icon: Target,
                  title: "Targeted Exercises",
                  description: "Get custom breathing and speech exercises based on your unique assessment results.",
                  color: "text-accent",
                  bg: "bg-accent/10"
                }
              ].map((feature, i) => (
                <div 
                  key={i}
                  className="group p-8 rounded-2xl bg-card border border-border shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`h-14 w-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="relative z-10 py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to understanding and improving your speech
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {[
                { step: "01", title: "Complete Assessment", desc: "Answer 12 science-backed questions about your speech patterns and experiences." },
                { step: "02", title: "Get Your Profile", desc: "Receive a detailed risk analysis with emotional, functional, and overall scores." },
                { step: "03", title: "Start Exercises", desc: "Follow personalized breathing and speech exercises tailored to your triggers." }
              ].map((item, i) => (
                <div 
                  key={i}
                  className="flex items-start gap-6 mb-8 last:mb-0"
                >
                  <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-foreground">{item.step}</span>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                  {i < 2 && (
                    <div className="hidden md:block absolute left-[calc(50%-32px)] mt-20 h-8 w-px bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="relative z-10 py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Trusted by Thousands
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { name: "Sarah M.", text: "The assessment helped me understand my triggers. The exercises actually work!", rating: 5 },
                { name: "James K.", text: "Finally a tool that takes stuttering seriously. Highly recommend.", rating: 5 },
                { name: "Priya R.", text: "The personalized approach made all the difference in my therapy journey.", rating: 5 }
              ].map((testimonial, i) => (
                <div key={i} className="p-6 rounded-xl bg-card border border-border">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 leading-relaxed">"{testimonial.text}"</p>
                  <p className="text-sm font-medium text-muted-foreground">{testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-r from-accent/20 to-accent/5 border border-accent/20">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Transform Your Speech?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Take our free assessment today and receive personalized insights and exercises.
              </p>
              <Button size="lg" className="bg-gradient-brand hover:opacity-90 text-foreground h-14 px-10 text-lg shadow-xl shadow-accent/30">
                Start Free Assessment
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-border py-12 bg-card/50">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                  <span className="text-sm font-bold text-foreground">Z</span>
                </div>
                <span className="font-semibold text-foreground">ZLAQA</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2025 ZLAQA. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
