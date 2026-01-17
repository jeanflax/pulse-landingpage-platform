import { LandingPageData } from '@/types/landing';

export const sampleLandingPageData: LandingPageData = {
  hero: {
    headline: "The Everyday Bag That Does It All",
    subheadline: "Crafted from premium materials, designed for the modern professional. Carry everything you need in style.",
    ctaText: "Shop Now",
    ctaLink: "#shop",
    secondaryCtaText: "Learn More",
    secondaryCtaLink: "#features",
    productImage: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    productImageAlt: "Premium everyday bag",
    badge: "New Collection",
  },
  benefits: {
    sectionTitle: "Why Choose Our Bag",
    sectionSubtitle: "Every detail has been carefully considered to deliver the best experience.",
    benefits: [
      {
        icon: "shield",
        title: "Premium Materials",
        description: "Made from water-resistant, full-grain leather that ages beautifully and lasts for years.",
      },
      {
        icon: "lightning",
        title: "Thoughtful Design",
        description: "15+ pockets and compartments keep everything organized and easily accessible.",
      },
      {
        icon: "heart",
        title: "Comfort First",
        description: "Ergonomic straps distribute weight evenly for all-day comfort.",
      },
    ],
  },
  socialProof: {
    sectionTitle: "Loved by Thousands",
    sectionSubtitle: "See what our customers have to say about their experience.",
    stats: [
      { value: "50K+", label: "Happy Customers" },
      { value: "4.9", label: "Average Rating" },
      { value: "99%", label: "Recommend" },
      { value: "2yr", label: "Warranty" },
    ],
    testimonials: [
      {
        quote: "This bag has completely transformed my daily commute. The organization is incredible and it looks stunning.",
        author: "Sarah Mitchell",
        title: "Marketing Director",
        rating: 5,
      },
      {
        quote: "I've tried dozens of bags over the years. This is hands down the best investment I've made for my everyday carry.",
        author: "James Chen",
        title: "Software Engineer",
        rating: 5,
      },
      {
        quote: "The quality is unmatched. Six months in and it still looks brand new. Worth every penny.",
        author: "Emma Rodriguez",
        title: "Photographer",
        rating: 5,
      },
    ],
  },
  productShowcase: {
    sectionTitle: "See It In Detail",
    sectionSubtitle: "Explore every feature designed to make your life easier.",
    description: "Our signature everyday bag combines timeless design with modern functionality. Crafted from premium full-grain leather, it features a spacious main compartment, dedicated laptop sleeve, and multiple organizer pockets.",
    features: [
      "Fits laptops up to 15 inches",
      "Water-resistant exterior",
      "YKK zippers throughout",
      "Hidden anti-theft pocket",
      "Luggage pass-through strap",
      "Lifetime warranty included",
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
        alt: "Bag front view",
      },
      {
        src: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
        alt: "Bag side view",
      },
      {
        src: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80",
        alt: "Bag interior",
      },
      {
        src: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=800&q=80",
        alt: "Bag detail",
      },
    ],
    price: "$189",
    comparePrice: "$249",
  },
  cta: {
    headline: "Ready to Upgrade Your Everyday Carry?",
    subheadline: "Join over 50,000 happy customers. Free shipping on all orders over $100.",
    ctaText: "Get Yours Today",
    ctaLink: "#shop",
    secondaryText: "Use code WELCOME15 for 15% off your first order",
  },
};
