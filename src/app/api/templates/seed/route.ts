import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const starterTemplates = [
  // ===== RIDGE-STYLE: Minimalist, Product-Focused, Comparison-Heavy =====
  {
    name: 'Ridge Style - Minimalist Product',
    type: 'LANDING_PAGE',
    category: 'accessories',
    description: 'Inspired by Ridge Wallet. Minimalist, product-focused design with strong comparison messaging and video hero. Perfect for premium everyday carry products.',
    thumbnail: '/templates/thumbs/ridge-style.png',
    sections: [
      {
        id: 'announcement',
        component: 'AnnouncementBar',
        order: 1,
        defaultContent: {
          announcements: [
            { text: 'Free Shipping on Orders $75+', linkText: 'Shop Now', link: '#' },
            { text: 'Lifetime Warranty on All Products', linkText: 'Learn More', link: '#' },
          ],
          backgroundColor: '#000',
          textColor: '#fff',
        },
      },
      {
        id: 'hero',
        component: 'VideoHero',
        order: 2,
        defaultContent: {
          headline: 'The Last Wallet You\'ll Ever Buy',
          subheadline: 'Slim. Durable. RFID-blocking. Designed for the modern minimalist.',
          badge: 'BESTSELLER',
          ctaText: 'Shop Wallets',
          secondaryCtaText: 'Watch Video',
          alignment: 'center',
          overlayOpacity: 0.5,
        },
      },
      {
        id: 'trust',
        component: 'TrustBadges',
        order: 3,
        defaultContent: {
          badges: [
            { icon: 'shipping', title: 'Free Shipping', description: 'On orders $75+' },
            { icon: 'warranty', title: 'Lifetime Warranty', description: 'We stand behind it' },
            { icon: 'returns', title: '99-Day Returns', description: 'No questions asked' },
            { icon: 'secure', title: 'RFID Blocking', description: 'Built-in protection' },
          ],
          style: 'inline',
        },
      },
      {
        id: 'comparison',
        component: 'ComparisonTable',
        order: 4,
        defaultContent: {
          title: 'Built Different',
          subtitle: 'See how we stack up against traditional wallets',
          ourBrand: 'Ridge',
          theirBrand: 'Traditional Wallet',
          features: [
            { name: 'RFID Blocking', ours: true, theirs: false, highlight: true },
            { name: 'Slim Profile', ours: '0.25"', theirs: '1.0"' },
            { name: 'Holds 12+ Cards', ours: true, theirs: true },
            { name: 'Cash Strap Included', ours: true, theirs: false },
            { name: 'Lifetime Warranty', ours: true, theirs: false, highlight: true },
            { name: 'Aerospace-Grade Materials', ours: true, theirs: false },
          ],
          ctaText: 'Make the Switch',
        },
      },
      {
        id: 'products',
        component: 'ProductCarousel',
        order: 5,
        defaultContent: {
          title: 'Our Bestsellers',
          subtitle: 'Over 2 million wallets sold worldwide',
          products: [],
          showRating: true,
          showColors: true,
        },
      },
      {
        id: 'social-proof',
        component: 'SocialProof',
        order: 6,
        defaultContent: {
          stats: [
            { value: '2M+', label: 'Wallets Sold' },
            { value: '4.9', label: 'Star Rating' },
            { value: '50K+', label: '5-Star Reviews' },
          ],
          testimonial: {
            quote: 'I\'ve tried dozens of wallets. This is the only one that fits my front pocket without the bulk.',
            author: 'Jason K.',
            role: 'Verified Buyer',
          },
        },
      },
      {
        id: 'ugc',
        component: 'UGCGallery',
        order: 7,
        defaultContent: {
          title: 'Carry Confidence',
          subtitle: 'Join 2 million+ who made the switch',
          items: [],
          columns: 4,
          instagramHandle: 'ridge',
        },
      },
      {
        id: 'cta',
        component: 'FinalCTA',
        order: 8,
        defaultContent: {
          headline: 'Ready to Upgrade?',
          subheadline: 'Join over 2 million happy customers. Free shipping & lifetime warranty.',
          ctaText: 'Shop Now',
        },
      },
    ],
  },

  // ===== GYMSHARK-STYLE: Bold, Category-Driven, Carousel-Heavy =====
  {
    name: 'Gymshark Style - Athletic Brand',
    type: 'LANDING_PAGE',
    category: 'fitness',
    description: 'Inspired by Gymshark. Bold, energetic design with product carousels, category navigation, and community focus. Perfect for athletic and lifestyle apparel.',
    thumbnail: '/templates/thumbs/gymshark-style.png',
    sections: [
      {
        id: 'announcement',
        component: 'AnnouncementBar',
        order: 1,
        defaultContent: {
          announcements: [
            { text: 'New Arrivals Just Dropped', linkText: 'Shop Now', link: '#' },
            { text: 'Students Get 10% Off', linkText: 'Verify Now', link: '#' },
            { text: 'Free Shipping Over $75', linkText: 'Shop', link: '#' },
          ],
          backgroundColor: '#000',
          textColor: '#fff',
          rotateInterval: 4000,
        },
      },
      {
        id: 'hero',
        component: 'VideoHero',
        order: 2,
        defaultContent: {
          headline: 'TRAIN LIKE A CHAMPION',
          subheadline: 'Performance apparel engineered for those who push limits.',
          badge: 'NEW COLLECTION',
          ctaText: 'Shop Men\'s',
          secondaryCtaText: 'Shop Women\'s',
          alignment: 'center',
          minHeight: '100vh',
        },
      },
      {
        id: 'products-mens',
        component: 'ProductCarousel',
        order: 3,
        defaultContent: {
          title: 'Men\'s Bestsellers',
          subtitle: 'Our most-loved performance pieces',
          products: [],
          showRating: true,
          showColors: true,
        },
      },
      {
        id: 'products-womens',
        component: 'ProductCarousel',
        order: 4,
        defaultContent: {
          title: 'Women\'s Bestsellers',
          subtitle: 'Designed for every workout',
          products: [],
          showRating: true,
          showColors: true,
        },
      },
      {
        id: 'trust',
        component: 'TrustBadges',
        order: 5,
        defaultContent: {
          badges: [
            { icon: 'quality', title: 'Premium Quality', description: 'Built to perform' },
            { icon: 'shipping', title: 'Fast Shipping', description: '2-day delivery' },
            { icon: 'returns', title: 'Easy Returns', description: '30-day returns' },
            { icon: 'support', title: '24/7 Support', description: 'Always here' },
          ],
          style: 'grid',
        },
      },
      {
        id: 'social-proof',
        component: 'SocialProof',
        order: 6,
        defaultContent: {
          stats: [
            { value: '6M+', label: 'Community Members' },
            { value: '190+', label: 'Countries' },
            { value: '4.8★', label: 'Average Rating' },
          ],
          testimonial: {
            quote: 'The quality and fit is unmatched. I won\'t train in anything else.',
            author: 'Sarah M.',
            role: 'Verified Athlete',
          },
        },
      },
      {
        id: 'ugc',
        component: 'UGCGallery',
        order: 7,
        defaultContent: {
          title: 'The Fam',
          subtitle: 'Real athletes. Real results. Tag us to be featured.',
          items: [],
          columns: 6,
          instagramHandle: 'gymshark',
        },
      },
      {
        id: 'cta',
        component: 'FinalCTA',
        order: 8,
        defaultContent: {
          headline: 'Join the Movement',
          subheadline: 'Sign up for early access, exclusive drops, and athlete content.',
          ctaText: 'Shop Now',
        },
      },
    ],
  },

  // ===== JONES ROAD-STYLE: Editorial, Founder Story, Press-Heavy =====
  {
    name: 'Jones Road Style - Beauty Brand',
    type: 'LANDING_PAGE',
    category: 'beauty',
    description: 'Inspired by Jones Road Beauty. Clean, editorial design with founder story, press quotes, and educational content. Perfect for clean beauty and skincare brands.',
    thumbnail: '/templates/thumbs/jonesroad-style.png',
    sections: [
      {
        id: 'announcement',
        component: 'AnnouncementBar',
        order: 1,
        defaultContent: {
          announcements: [
            { text: 'Free Shipping on Orders $50+', linkText: 'Shop Now', link: '#' },
          ],
          backgroundColor: '#f5f0eb',
          textColor: '#2d2d2d',
        },
      },
      {
        id: 'hero',
        component: 'Hero',
        order: 2,
        defaultContent: {
          headline: 'Beauty That Lets You Be You',
          subheadline: 'Clean, high-performance makeup and skincare from Bobbi Brown.',
          badge: 'CLEAN BEAUTY',
          ctaText: 'Shop Bestsellers',
        },
      },
      {
        id: 'press',
        component: 'PressLogos',
        order: 3,
        defaultContent: {
          title: 'As Featured In',
          logos: [
            { name: 'Vogue', quote: '"A game-changer for natural beauty"' },
            { name: 'Allure', quote: '"Editor\'s Choice 2024"' },
            { name: 'WSJ', quote: '"The future of clean beauty"' },
            { name: 'Forbes', quote: '"Disrupting the industry"' },
            { name: 'Elle', quote: '"Must-have for your routine"' },
          ],
          showQuotes: true,
          style: 'cards',
        },
      },
      {
        id: 'products',
        component: 'ProductCarousel',
        order: 4,
        defaultContent: {
          title: 'Editor\'s Picks',
          subtitle: 'Our most-loved products',
          products: [],
          showRating: true,
        },
      },
      {
        id: 'founder',
        component: 'FounderStory',
        order: 5,
        defaultContent: {
          quote: 'I created Jones Road because I believe makeup should enhance your natural beauty, not mask it. Clean ingredients, real results.',
          founderName: 'Bobbi Brown',
          founderTitle: 'Founder & CEO',
          layout: 'split',
          story: 'After decades in the beauty industry, I knew there had to be a better way. Jones Road is my answer—makeup that works with your skin, not against it.',
        },
      },
      {
        id: 'benefits',
        component: 'Benefits',
        order: 6,
        defaultContent: {
          title: 'The Clean Beauty Promise',
          benefits: [
            { icon: 'leaf', title: 'Clean Ingredients', description: 'No parabens, sulfates, or synthetic fragrances' },
            { icon: 'science', title: 'Clinically Tested', description: 'Dermatologist approved and tested' },
            { icon: 'heart', title: 'Cruelty-Free', description: 'Never tested on animals' },
          ],
        },
      },
      {
        id: 'social-proof',
        component: 'SocialProof',
        order: 7,
        defaultContent: {
          stats: [
            { value: '500K+', label: 'Happy Customers' },
            { value: '4.9', label: 'Star Rating' },
            { value: '100%', label: 'Clean Ingredients' },
          ],
          testimonial: {
            quote: 'Finally, makeup that makes my skin look better, not worse. I\'m obsessed with The Miracle Balm.',
            author: 'Jessica T.',
            role: 'Verified Buyer',
          },
        },
      },
      {
        id: 'ugc',
        component: 'UGCGallery',
        order: 8,
        defaultContent: {
          title: 'Get the Look',
          subtitle: 'Real customers, real beauty',
          items: [],
          columns: 4,
          instagramHandle: 'jonesroadbeauty',
        },
      },
      {
        id: 'cta',
        component: 'FinalCTA',
        order: 9,
        defaultContent: {
          headline: 'Ready to Make the Switch?',
          subheadline: 'Join hundreds of thousands who\'ve discovered clean beauty that actually works.',
          ctaText: 'Shop Now',
        },
      },
    ],
  },

  // ===== HEXCLAD-STYLE: Demo-Focused, Before/After, Chef Endorsements =====
  {
    name: 'Hexclad Style - Premium Cookware',
    type: 'LANDING_PAGE',
    category: 'home',
    description: 'Inspired by Hexclad. Demo-focused design with before/after comparisons, chef endorsements, and product benefits. Perfect for kitchen and home products.',
    thumbnail: '/templates/thumbs/hexclad-style.png',
    sections: [
      {
        id: 'announcement',
        component: 'AnnouncementBar',
        order: 1,
        defaultContent: {
          announcements: [
            { text: 'Up to 40% Off - Limited Time', linkText: 'Shop Sale', link: '#' },
          ],
          backgroundColor: '#1a1a1a',
          textColor: '#fff',
          showCountdown: true,
          countdownEnd: '2024-12-31T23:59:59',
        },
      },
      {
        id: 'hero',
        component: 'VideoHero',
        order: 2,
        defaultContent: {
          headline: 'The Last Pan You\'ll Ever Need',
          subheadline: 'Hybrid technology. Tri-ply steel. Lifetime warranty. As seen on MasterChef.',
          badge: 'AS SEEN ON TV',
          ctaText: 'Shop Pans',
          secondaryCtaText: 'See It In Action',
          alignment: 'center',
        },
      },
      {
        id: 'press',
        component: 'PressLogos',
        order: 3,
        defaultContent: {
          title: 'Featured On',
          logos: [
            { name: 'MasterChef', quote: '"The official pan of MasterChef"' },
            { name: 'Today Show', quote: '"A kitchen must-have"' },
            { name: 'Food Network', quote: '"Chef-approved performance"' },
            { name: 'NY Times', quote: '"The pan that does it all"' },
          ],
          style: 'minimal',
        },
      },
      {
        id: 'before-after',
        component: 'BeforeAfter',
        order: 4,
        defaultContent: {
          title: 'See the Difference',
          subtitle: 'Non-stick meets stainless steel performance',
          beforeImage: '/images/before-pan.jpg',
          afterImage: '/images/after-pan.jpg',
          beforeLabel: 'Traditional Pan',
          afterLabel: 'Hexclad Pan',
        },
      },
      {
        id: 'comparison',
        component: 'ComparisonTable',
        order: 5,
        defaultContent: {
          title: 'Why Chefs Choose Hexclad',
          ourBrand: 'Hexclad',
          theirBrand: 'Other Brands',
          features: [
            { name: 'Metal Utensil Safe', ours: true, theirs: false, highlight: true },
            { name: 'Oven Safe to 500°F', ours: true, theirs: false },
            { name: 'Dishwasher Safe', ours: true, theirs: false },
            { name: 'Non-Stick + Sear Capability', ours: true, theirs: false, highlight: true },
            { name: 'Lifetime Warranty', ours: true, theirs: false },
            { name: 'Tri-Ply Construction', ours: true, theirs: false },
          ],
        },
      },
      {
        id: 'founder',
        component: 'FounderStory',
        order: 6,
        defaultContent: {
          quote: 'I use Hexclad in my restaurants and at home. It\'s the only pan that can sear like stainless and release like non-stick.',
          founderName: 'Gordon Ramsay',
          founderTitle: 'Celebrity Chef & Partner',
          layout: 'centered',
        },
      },
      {
        id: 'products',
        component: 'ProductCarousel',
        order: 7,
        defaultContent: {
          title: 'Shop Bestsellers',
          subtitle: 'Professional-grade cookware for home chefs',
          products: [],
          showRating: true,
        },
      },
      {
        id: 'trust',
        component: 'TrustBadges',
        order: 8,
        defaultContent: {
          badges: [
            { icon: 'warranty', title: 'Lifetime Warranty', description: 'We guarantee it forever' },
            { icon: 'shipping', title: 'Free Shipping', description: 'On orders $99+' },
            { icon: 'returns', title: '60-Day Returns', description: 'Try it risk-free' },
            { icon: 'award', title: 'Award Winning', description: '10+ industry awards' },
          ],
          style: 'grid',
        },
      },
      {
        id: 'social-proof',
        component: 'SocialProof',
        order: 9,
        defaultContent: {
          stats: [
            { value: '1M+', label: 'Home Chefs' },
            { value: '4.8', label: 'Star Rating' },
            { value: '50K+', label: '5-Star Reviews' },
          ],
          testimonial: {
            quote: 'I finally understand the hype. Eggs slide right off, but I can still get a perfect sear on my steaks.',
            author: 'Michael P.',
            role: 'Home Chef',
          },
        },
      },
      {
        id: 'cta',
        component: 'FinalCTA',
        order: 10,
        defaultContent: {
          headline: 'Ready to Cook Like a Pro?',
          subheadline: 'Join over 1 million home chefs. Lifetime warranty included.',
          ctaText: 'Shop Now',
        },
      },
    ],
  },

  // ===== OLIPOP-STYLE: Fun, Colorful, Health-Focused =====
  {
    name: 'OLIPOP Style - Healthy Beverage',
    type: 'LANDING_PAGE',
    category: 'food',
    description: 'Inspired by OLIPOP. Fun, colorful design with health benefits, flavor showcase, and science-backed messaging. Perfect for better-for-you food and beverage brands.',
    thumbnail: '/templates/thumbs/olipop-style.png',
    sections: [
      {
        id: 'announcement',
        component: 'AnnouncementBar',
        order: 1,
        defaultContent: {
          announcements: [
            { text: 'Try Our New Flavor: Grape Vanilla', linkText: 'Shop Now', link: '#' },
          ],
          backgroundColor: '#6B4FA2',
          textColor: '#fff',
        },
      },
      {
        id: 'hero',
        component: 'Hero',
        order: 2,
        defaultContent: {
          headline: 'Soda\'s Getting a Makeover',
          subheadline: 'A new kind of soda with prebiotics, plant fiber, and only 2-5g of sugar. Your gut will thank you.',
          badge: 'BETTER FOR YOU',
          ctaText: 'Shop Flavors',
        },
      },
      {
        id: 'trust',
        component: 'TrustBadges',
        order: 3,
        defaultContent: {
          badges: [
            { icon: 'quality', title: '2-5g Sugar', description: 'Per can' },
            { icon: 'eco', title: '9g Fiber', description: 'Prebiotics' },
            { icon: 'quality', title: '35-45 Cal', description: 'Per serving' },
            { icon: 'award', title: '#1 Soda', description: 'On Amazon' },
          ],
          style: 'minimal',
        },
      },
      {
        id: 'products',
        component: 'ProductCarousel',
        order: 4,
        defaultContent: {
          title: 'Find Your Flavor',
          subtitle: '12 delicious flavors to choose from',
          products: [],
          showRating: true,
        },
      },
      {
        id: 'benefits',
        component: 'Benefits',
        order: 5,
        defaultContent: {
          title: 'Better Ingredients. Better Soda.',
          benefits: [
            { icon: 'science', title: 'Prebiotics', description: 'Support digestive health with every sip' },
            { icon: 'leaf', title: 'Plant Fiber', description: '9g of fiber from botanical ingredients' },
            { icon: 'heart', title: 'Low Sugar', description: 'Only 2-5g of sugar per can' },
          ],
        },
      },
      {
        id: 'press',
        component: 'PressLogos',
        order: 6,
        defaultContent: {
          title: 'The Buzz',
          logos: [
            { name: 'Forbes', quote: '"The soda revolution"' },
            { name: 'Well+Good', quote: '"A gut-healthy game changer"' },
            { name: 'Bon Appétit', quote: '"Finally, a soda you can feel good about"' },
          ],
          style: 'cards',
          showQuotes: true,
        },
      },
      {
        id: 'social-proof',
        component: 'SocialProof',
        order: 7,
        defaultContent: {
          stats: [
            { value: '100M+', label: 'Cans Sold' },
            { value: '4.5', label: 'Star Rating' },
            { value: '20K+', label: 'Retail Locations' },
          ],
          testimonial: {
            quote: 'I haven\'t touched regular soda since I discovered OLIPOP. The Vintage Cola is my obsession.',
            author: 'Emma L.',
            role: 'Verified Buyer',
          },
        },
      },
      {
        id: 'ugc',
        component: 'UGCGallery',
        order: 8,
        defaultContent: {
          title: '#OLIPOP',
          subtitle: 'Join the gut-healthy soda movement',
          items: [],
          columns: 4,
          instagramHandle: 'drinkolipop',
        },
      },
      {
        id: 'cta',
        component: 'FinalCTA',
        order: 9,
        defaultContent: {
          headline: 'Ready to Feel Good About Soda Again?',
          subheadline: 'Try our best-selling variety pack. Free shipping on your first order.',
          ctaText: 'Shop Now',
        },
      },
    ],
  },

  // ===== ALLBIRDS-STYLE: Sustainable, Story-Driven, Materials-Focused =====
  {
    name: 'Allbirds Style - Sustainable Fashion',
    type: 'LANDING_PAGE',
    category: 'fashion',
    description: 'Inspired by Allbirds. Sustainability-focused with material stories, carbon footprint messaging, and comfort benefits. Perfect for eco-conscious fashion brands.',
    thumbnail: '/templates/thumbs/allbirds-style.png',
    sections: [
      {
        id: 'announcement',
        component: 'AnnouncementBar',
        order: 1,
        defaultContent: {
          announcements: [
            { text: 'Free Shipping & Free Returns', linkText: 'Shop Now', link: '#' },
          ],
          backgroundColor: '#f5f5f5',
          textColor: '#333',
        },
      },
      {
        id: 'hero',
        component: 'Hero',
        order: 2,
        defaultContent: {
          headline: 'The World\'s Most Comfortable Shoes',
          subheadline: 'Made from natural materials. Designed for everyday comfort. Better for the planet.',
          badge: 'CARBON NEUTRAL',
          ctaText: 'Shop Shoes',
        },
      },
      {
        id: 'trust',
        component: 'TrustBadges',
        order: 3,
        defaultContent: {
          badges: [
            { icon: 'eco', title: 'Carbon Neutral', description: 'Certified B Corp' },
            { icon: 'returns', title: 'Free Returns', description: '30 days, no questions' },
            { icon: 'quality', title: 'Natural Materials', description: 'Wool, tree, sugar' },
            { icon: 'shipping', title: 'Free Shipping', description: 'On all orders' },
          ],
          style: 'minimal',
        },
      },
      {
        id: 'products',
        component: 'ProductCarousel',
        order: 4,
        defaultContent: {
          title: 'Bestsellers',
          subtitle: 'Our most-loved styles',
          products: [],
          showRating: true,
          showColors: true,
        },
      },
      {
        id: 'benefits',
        component: 'Benefits',
        order: 5,
        defaultContent: {
          title: 'Better Materials. Better Shoes.',
          benefits: [
            { icon: 'leaf', title: 'Merino Wool', description: 'Soft, breathable, temperature-regulating' },
            { icon: 'eco', title: 'Eucalyptus Tree', description: 'Silky smooth and sustainable' },
            { icon: 'heart', title: 'Sugarcane Soles', description: 'Bouncy, carbon-negative foam' },
          ],
        },
      },
      {
        id: 'founder',
        component: 'FounderStory',
        order: 6,
        defaultContent: {
          quote: 'We believe in making better things in a better way. Nature provides the best materials—we just need to use them.',
          founderName: 'Tim Brown',
          founderTitle: 'Co-Founder',
          layout: 'centered',
        },
      },
      {
        id: 'social-proof',
        component: 'SocialProof',
        order: 7,
        defaultContent: {
          stats: [
            { value: '4M+', label: 'Happy Feet' },
            { value: '4.5', label: 'Star Rating' },
            { value: '7.6kg', label: 'Avg CO₂e/Pair' },
          ],
          testimonial: {
            quote: 'I wear these every single day. Most comfortable shoes I\'ve ever owned, and I feel good about the materials.',
            author: 'David R.',
            role: 'Verified Buyer',
          },
        },
      },
      {
        id: 'cta',
        component: 'FinalCTA',
        order: 8,
        defaultContent: {
          headline: 'Find Your Perfect Pair',
          subheadline: 'Free shipping. Free returns. 30-day trial.',
          ctaText: 'Shop Now',
        },
      },
    ],
  },
];

// POST /api/templates/seed - Seed starter templates
export async function POST() {
  try {
    // Delete existing templates and reseed
    await db.template.deleteMany();

    // Create all templates
    const results = await Promise.all(
      starterTemplates.map((template) =>
        db.template.create({
          data: {
            name: template.name,
            type: template.type,
            category: template.category,
            description: template.description,
            thumbnail: template.thumbnail,
            sections: JSON.stringify(template.sections),
            isPublic: true,
          },
        })
      )
    );

    return NextResponse.json(
      { message: 'Templates seeded successfully', count: results.length, templates: results },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error seeding templates:', error);
    return NextResponse.json(
      { error: 'Failed to seed templates' },
      { status: 500 }
    );
  }
}
