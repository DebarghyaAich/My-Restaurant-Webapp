import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  Sparkles, 
  Award, 
  Heart, 
  UtensilsCrossed, 
  ChefHat, 
  Flame, 
  ShieldCheck, 
  Users, 
  ArrowRight,
  Clock
} from 'lucide-react';

const CHEFS = [
  {
    name: 'Chef Rajiv Mehrotra',
    role: 'Culinary Director & Indian Heritage Master',
    bio: 'Over 20 years perfecting slow-simmered dum gravies, royal Mughlai marinades, and charcoal tandoor artistry across New Delhi & London.',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80',
    specialty: 'Delhi Butter Chicken & Dum Biryani'
  },
  {
    name: 'Chef Lin Wei',
    role: 'Executive Chef of Chinese Gastronomy',
    bio: 'Trained in Chengdu and Hong Kong, Chef Wei brings fiery wok-tossed mastery, intricate handcrafted dim sums, and fragrant Szechuan broths.',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80',
    specialty: 'Kung Pao Chicken & Crystal Dim Sums'
  },
  {
    name: 'Chef Alessandro Rossi',
    role: 'Head Chef - Continental & Wood-Fired',
    bio: 'Born in Naples, Alessandro honors centennial dough fermentation secrets and hand-rolled pasta techniques for pure authentic Italian perfection.',
    image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?auto=format&fit=crop&w=600&q=80',
    specialty: 'Neapolitan Pizza & Truffle Arancini'
  }
];

const AboutUs = () => {
  const { isBeige } = useTheme();

  return (
    <div className={`min-h-screen py-12 transition-colors duration-300 ${
      isBeige ? 'text-stone-900' : 'text-orange-50'
    }`}>
      
      {/* 1. Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center space-y-4">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
          isBeige
            ? 'bg-amber-100/90 border-amber-300 text-amber-900'
            : 'bg-orange-950/70 border-orange-800/60 text-orange-400'
        }`}>
          <Sparkles className="w-3.5 h-3.5" />
          Our Culinary Odyssey
        </div>
        <h1 className={`text-4xl sm:text-6xl font-black tracking-tight ${
          isBeige ? 'text-stone-900' : 'text-white'
        }`}>
          A Symphony of Flavor, Fire & Passion
        </h1>
        <p className={`text-base max-w-2xl mx-auto leading-relaxed ${
          isBeige ? 'text-stone-600' : 'text-orange-200/70'
        }`}>
          Founded on the philosophy that dining is an art form, Dabba brings together centuries of global culinary heritage with modern kitchen mastery.
        </p>
      </section>

      {/* 2. Story Section with Image Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
              isBeige
                ? 'bg-amber-100/90 border-amber-300 text-amber-900'
                : 'bg-orange-950/70 border-orange-800/60 text-orange-400'
            }`}>
              The Dabba Story
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight leading-tight ${
              isBeige ? 'text-stone-900' : 'text-white'
            }`}>
              From a Single Wood-Fired Oven to an Award-Winning Restaurant
            </h2>
            <p className={`text-sm leading-relaxed ${isBeige ? 'text-stone-700' : 'text-orange-100/80'}`}>
              Dabba began with a modest mission: to celebrate regional culinary traditions with uncompromised integrity. We rejected processed powders, shortcuts, and artificial flavors in favor of whole spices ground fresh each dawn, wood-fired hearths, and farm-picked herbs.
            </p>
            <p className={`text-sm leading-relaxed ${isBeige ? 'text-stone-700' : 'text-orange-100/80'}`}>
              Today, our culinary team represents three world-class culinary styles: Indian Royal Mughlai, Imperial Chinese Wok Craft, and Artisanal Italian Continental classics.
            </p>

            <div className={`grid grid-cols-2 gap-4 pt-4 border-t ${
              isBeige ? 'border-amber-200' : 'border-orange-950'
            }`}>
              <div>
                <p className="text-3xl font-black text-orange-500">46+</p>
                <p className={`text-xs font-semibold ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>Artisanal Dishes</p>
              </div>
              <div>
                <p className="text-3xl font-black text-orange-500">35,000+</p>
                <p className={`text-xs font-semibold ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>Orders Served</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
                alt="Restaurant Interior"
                className={`w-full h-64 rounded-3xl object-cover shadow-lg border ${
                  isBeige ? 'border-amber-200/80' : 'border-orange-950'
                }`}
              />
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
                alt="Dining Room"
                className={`w-full h-48 rounded-3xl object-cover shadow-lg border ${
                  isBeige ? 'border-amber-200/80' : 'border-orange-950'
                }`}
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80"
                alt="Open Kitchen Hearth"
                className={`w-full h-48 rounded-3xl object-cover shadow-lg border ${
                  isBeige ? 'border-amber-200/80' : 'border-orange-950'
                }`}
              />
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
                alt="Gourmet Plating"
                className={`w-full h-64 rounded-3xl object-cover shadow-lg border ${
                  isBeige ? 'border-amber-200/80' : 'border-orange-950'
                }`}
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Meet the Master Chefs */}
      <section className={`border-y py-20 mb-20 backdrop-blur-md ${
        isBeige
          ? 'bg-amber-100/40 border-amber-200'
          : 'bg-[#180705]/70 border-orange-950'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
              isBeige
                ? 'bg-amber-200/60 border-amber-300 text-amber-900'
                : 'bg-orange-950/70 border-orange-800/60 text-orange-400'
            }`}>
              Culinary Maestros
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${
              isBeige ? 'text-stone-900' : 'text-white'
            }`}>
              Meet Our Executive Chefs
            </h2>
            <p className={`text-sm ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
              Masters of their respective culinary disciplines, bringing decades of passion to every plate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CHEFS.map((chef) => (
              <div key={chef.name} className={`rounded-3xl border overflow-hidden group shadow-xl transition-all hover:scale-[1.02] ${
                isBeige
                  ? 'bg-white/95 border-amber-200 shadow-amber-900/5'
                  : 'bg-[#120504]/90 border-orange-950 shadow-black/40'
              }`}>
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-500">
                    {chef.role}
                  </span>
                  <h3 className={`text-xl font-bold ${isBeige ? 'text-stone-900' : 'text-white'}`}>{chef.name}</h3>
                  <p className={`text-xs leading-relaxed ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>{chef.bio}</p>
                  <div className={`pt-3 border-t text-xs ${
                    isBeige ? 'border-amber-100 text-stone-700' : 'border-orange-950 text-orange-200/80'
                  }`}>
                    <strong className="text-orange-500">Signature:</strong> {chef.specialty}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Our Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
            isBeige
              ? 'bg-amber-100/90 border-amber-300 text-amber-900'
              : 'bg-orange-950/70 border-orange-800/60 text-orange-400'
          }`}>
            The Dabba Standard
          </span>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${
            isBeige ? 'text-stone-900' : 'text-white'
          }`}>
            Our Guiding Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`p-8 rounded-3xl border shadow-xl space-y-4 backdrop-blur-md ${
            isBeige
              ? 'bg-white/90 border-amber-200 shadow-amber-900/5'
              : 'bg-[#180705]/80 border-orange-950/80 shadow-black/40'
          }`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border ${
              isBeige
                ? 'bg-amber-100 text-orange-600 border-amber-300'
                : 'bg-orange-950/70 text-orange-400 border-orange-800/60'
            }`}>
              <Flame className="w-6 h-6" />
            </div>
            <h3 className={`font-extrabold text-base ${isBeige ? 'text-stone-900' : 'text-white'}`}>Slow Cooking & Pure Heat</h3>
            <p className={`text-xs leading-relaxed ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
              We never rush culinary chemistry. Whether it's our 6-hour braised lamb shank, slow dum biryani, or wok seasoning, patience creates unforgettable depths.
            </p>
          </div>

          <div className={`p-8 rounded-3xl border shadow-xl space-y-4 backdrop-blur-md ${
            isBeige
              ? 'bg-white/90 border-amber-200 shadow-amber-900/5'
              : 'bg-[#180705]/80 border-orange-950/80 shadow-black/40'
          }`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border ${
              isBeige
                ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                : 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60'
            }`}>
              <Heart className="w-6 h-6" />
            </div>
            <h3 className={`font-extrabold text-base ${isBeige ? 'text-stone-900' : 'text-white'}`}>Honest Farm Partnerships</h3>
            <p className={`text-xs leading-relaxed ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
              We honor the earth by sourcing raw organic ingredients from verified local agricultural partners who practice ethical, chemical-free farming.
            </p>
          </div>

          <div className={`p-8 rounded-3xl border shadow-xl space-y-4 backdrop-blur-md ${
            isBeige
              ? 'bg-white/90 border-amber-200 shadow-amber-900/5'
              : 'bg-[#180705]/80 border-orange-950/80 shadow-black/40'
          }`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border ${
              isBeige
                ? 'bg-purple-100 text-purple-700 border-purple-300'
                : 'bg-purple-950/70 text-purple-400 border-purple-800/60'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className={`font-extrabold text-base ${isBeige ? 'text-stone-900' : 'text-white'}`}>Hospitality from the Heart</h3>
            <p className={`text-xs leading-relaxed ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
              Every customer is treated like royalty. From our dining room ambiance to our temperature-locked online delivery packaging, satisfaction is guaranteed.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`rounded-3xl p-10 sm:p-14 text-center space-y-6 border shadow-2xl ${
          isBeige
            ? 'bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 border-amber-300 shadow-amber-900/10'
            : 'bg-[#140403] border-orange-950 shadow-black/60'
        }`}>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${
            isBeige ? 'text-stone-900' : 'text-white'
          }`}>
            Ready to Taste the Craftsmanship?
          </h2>
          <p className={`text-sm max-w-lg mx-auto ${
            isBeige ? 'text-stone-600' : 'text-orange-200/70'
          }`}>
            Order your meal online for 30-minute hot doorstep delivery or book a table to dine with us in person.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/menu"
              className="px-8 py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-orange-600/30 transition-all hover:scale-105"
            >
              Explore Our Full Menu
            </Link>
            <Link
              to="/contact"
              className={`px-6 py-3.5 font-bold text-xs uppercase tracking-wider rounded-2xl border transition-all ${
                isBeige
                  ? 'bg-white text-stone-800 border-amber-300 hover:bg-amber-50'
                  : 'bg-orange-950/60 text-orange-200 border-orange-800/80 hover:bg-orange-900/60'
              }`}
            >
              Contact Us & Book Table
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
