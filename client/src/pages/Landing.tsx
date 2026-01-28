import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, ShieldCheck, TrendingUp, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20 z-10" />
          {/* Farm landscape background */}
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=2000"
            alt="Farm landscape"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight text-foreground mb-6">
              Share Resources.
              <br />
              <span className="text-primary">Grow Together.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
              Connect with local producers to share equipment, storage, and
              logistics. Optimize your operations and reduce waste with
              FarmShare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth/register">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 rounded-xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1"
                >
                  Start Browsing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white dark:bg-card border-y border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Why choose FarmShare?
            </h2>
            <p className="text-muted-foreground text-lg">
              We're building a sustainable ecosystem for modern agriculture.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Leaf,
                title: "Sustainable Growth",
                desc: "Reduce environmental impact by maximizing the utilization of existing resources.",
              },
              {
                icon: ShieldCheck,
                title: "Verified Partners",
                desc: "Every business is verified to ensure safe and reliable equipment sharing.",
              },
              {
                icon: TrendingUp,
                title: "Cost Efficiency",
                desc: "Access premium equipment without the heavy capital investment.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
              F
            </div>
            <span className="text-xl font-bold font-display">FarmShare</span>
          </div>
          <p className="text-background/60 text-sm">
            © 2024 FarmShare Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
