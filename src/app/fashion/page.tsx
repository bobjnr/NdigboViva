'use client'

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User, ArrowRight, Heart, ShoppingBag, Star, Eye } from "lucide-react";

const fashionCategories = ["All", "Traditional", "Modern", "Casual", "Formal", "Wedding", "Accessories", "Shoes"];

const fashionItems = [
  {
    id: 1,
    title: "Elegant Igbo Traditional Attire Collection",
    description: "Beautiful hand-woven traditional Igbo outfits perfect for cultural celebrations and special occasions.",
    content: "Full fashion content here...",
    designer: "Adaora Fashion House",
    publishedAt: "2024-03-12",
    readTime: "5 min read",
    category: "Traditional",
    image: "/Ndigbo Viva Logo.jpg",
    featured: true,
    trending: true,
    views: 3200,
    likes: 245,
    price: "₦45,000",
    inStock: true,
    rating: 4.8
  },
  {
    id: 2,
    title: "Contemporary Igbo-Inspired Business Suits",
    description: "Modern business attire with subtle Igbo cultural elements, perfect for professional settings.",
    content: "Full fashion content here...",
    designer: "Chinedu Couture",
    publishedAt: "2024-03-11",
    readTime: "4 min read",
    category: "Formal",
    image: "/Ndigbo Viva Logo.jpg",
    featured: false,
    trending: true,
    views: 2800,
    likes: 189,
    price: "₦65,000",
    inStock: true,
    rating: 4.6
  },
  {
    id: 3,
    title: "Casual Igbo Street Style Collection",
    description: "Comfortable and stylish everyday wear that incorporates Igbo cultural aesthetics in modern designs.",
    content: "Full fashion content here...",
    designer: "Ifeoma Styles",
    publishedAt: "2024-03-10",
    readTime: "3 min read",
    category: "Casual",
    image: "/Ndigbo Viva Logo.jpg",
    featured: false,
    trending: false,
    views: 1500,
    likes: 98,
    price: "₦25,000",
    inStock: true,
    rating: 4.4
  },
  {
    id: 4,
    title: "Luxury Igbo Wedding Attire",
    description: "Exquisite wedding outfits featuring traditional Igbo designs with contemporary luxury touches.",
    content: "Full fashion content here...",
    designer: "Ngozi Bridal",
    publishedAt: "2024-03-09",
    readTime: "6 min read",
    category: "Wedding",
    image: "/Ndigbo Viva Logo.jpg",
    featured: true,
    trending: true,
    views: 4200,
    likes: 312,
    price: "₦120,000",
    inStock: false,
    rating: 4.9
  },
  {
    id: 5,
    title: "Modern Igbo Accessories Collection",
    description: "Beautiful jewelry, bags, and accessories that celebrate Igbo culture with contemporary style.",
    content: "Full fashion content here...",
    designer: "Emeka Accessories",
    publishedAt: "2024-03-08",
    readTime: "4 min read",
    category: "Accessories",
    image: "/Ndigbo Viva Logo.jpg",
    featured: false,
    trending: false,
    views: 1800,
    likes: 156,
    price: "₦15,000",
    inStock: true,
    rating: 4.5
  },
  {
    id: 6,
    title: "Traditional Igbo Footwear",
    description: "Handcrafted traditional Igbo shoes and sandals made with authentic materials and techniques.",
    content: "Full fashion content here...",
    designer: "Chinwe Crafts",
    publishedAt: "2024-03-07",
    readTime: "3 min read",
    category: "Shoes",
    image: "/Ndigbo Viva Logo.jpg",
    featured: false,
    trending: true,
    views: 2100,
    likes: 178,
    price: "₦35,000",
    inStock: true,
    rating: 4.7
  },
  {
    id: 7,
    title: "Igbo-Inspired Modern Dresses",
    description: "Contemporary dress designs that incorporate traditional Igbo patterns and colors for modern women.",
    content: "Full fashion content here...",
    designer: "Uche Fashion",
    publishedAt: "2024-03-06",
    readTime: "5 min read",
    category: "Modern",
    image: "/Ndigbo Viva Logo.jpg",
    featured: false,
    trending: false,
    views: 1200,
    likes: 87,
    price: "₦40,000",
    inStock: true,
    rating: 4.3
  },
  {
    id: 8,
    title: "Cultural Festival Outfit Collection",
    description: "Vibrant and colorful outfits perfect for cultural festivals and celebrations throughout the year.",
    content: "Full fashion content here...",
    designer: "Adaora Cultural Wear",
    publishedAt: "2024-03-05",
    readTime: "4 min read",
    category: "Traditional",
    image: "/Ndigbo Viva Logo.jpg",
    featured: true,
    trending: true,
    views: 1900,
    likes: 134,
    price: "₦55,000",
    inStock: true,
    rating: 4.6
  }
];

export default function FashionPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [wishlist, setWishlist] = useState<number[]>([]);

  const filteredFashion = selectedCategory === "All" 
    ? fashionItems 
    : fashionItems.filter(item => item.category === selectedCategory);

  // Sort fashion items
  const sortedFashion = [...filteredFashion].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case "oldest":
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      case "popular":
        return b.views - a.views;
      case "trending":
        return b.likes - a.likes;
      case "price-low":
        return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''));
      case "price-high":
        return parseInt(b.price.replace(/[^\d]/g, '')) - parseInt(a.price.replace(/[^\d]/g, ''));
      default:
        return 0;
    }
  });

  const featuredFashion = fashionItems.filter(item => item.featured);
  const trendingFashion = fashionItems.filter(item => item.trending);

  const toggleWishlist = (itemId: number) => {
    setWishlist(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-black to-gray-900 text-white py-16">
        {/* Background Logo */}
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/Ndigbo Viva Logo.jpg"
            alt="Ndigbo Viva Logo Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-brand-gold">FASHION</span> <span className="text-brand-forest">&</span> <span className="text-brand-gold">STYLE</span>
            </h1>
            <p className="text-xl text-brand-gold font-semibold max-w-3xl mx-auto">
              Discover contemporary Igbo fashion that celebrates our culture while embracing modern trends
            </p>
          </div>
        </div>
      </section>

      {/* Featured Fashion */}
      <section className="py-16 bg-gray-50 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900  mb-4">
              Featured Collections
            </h2>
            <p className="text-lg text-gray-600 ">
              Our most popular and trending fashion pieces
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredFashion.map((item) => (
              <div key={item.id} className="bg-white  rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-64">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-brand-gold text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-brand-forest text-white px-3 py-1 rounded-full text-sm font-medium">
                      {item.category}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleWishlist(item.id)}
                    className="absolute bottom-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        wishlist.includes(item.id) ? 'text-red-500 fill-current' : 'text-gray-600'
                      }`} 
                    />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900  mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600  mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500  mb-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {item.designer}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {item.rating}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-brand-gold">
                        {item.price}
                      </span>
                      {!item.inStock && (
                        <span className="text-sm text-red-500 ml-2">Out of Stock</span>
                      )}
                    </div>
                    <button 
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        item.inStock 
                          ? 'bg-brand-forest hover:bg-brand-forest-dark text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!item.inStock}
                    >
                      <ShoppingBag className="w-4 h-4 inline mr-1" />
                      {item.inStock ? 'Add to Cart' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Fashion */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters and Sort */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {fashionCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-brand-gold text-white shadow-lg"
                        : "bg-white  text-gray-700  hover:bg-brand-gold hover:text-white hover:shadow-md border border-gray-200 "
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 ">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300  rounded-lg bg-white  text-gray-900  focus:ring-brand-gold focus:border-brand-gold"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="popular">Most Popular</option>
                  <option value="trending">Trending</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fashion Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sortedFashion.map((item) => (
              <div key={item.id} className="bg-white  rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-brand-forest text-white px-3 py-1 rounded-full text-sm font-medium">
                      {item.category}
                    </span>
                  </div>
                  {item.trending && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Trending
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => toggleWishlist(item.id)}
                    className="absolute bottom-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        wishlist.includes(item.id) ? 'text-red-500 fill-current' : 'text-gray-600'
                      }`} 
                    />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900  mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600  mb-3 line-clamp-2 text-sm">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500  mb-3">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {item.designer}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 mr-1 text-yellow-500" />
                      {item.rating}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-brand-gold">
                        {item.price}
                      </span>
                      {!item.inStock && (
                        <span className="text-xs text-red-500 ml-1">Out</span>
                      )}
                    </div>
                    <button 
                      className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                        item.inStock 
                          ? 'bg-brand-forest hover:bg-brand-forest-dark text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!item.inStock}
                    >
                      {item.inStock ? 'Add' : 'Sold'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Fashion Message */}
          {sortedFashion.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400  mb-4">
                <ShoppingBag className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900  mb-2">
                No fashion items found
              </h3>
              <p className="text-gray-600 ">
                No fashion items available in the {selectedCategory} category yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gray-50 ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900  mb-4">
            Stay Stylish
          </h2>
          <p className="text-lg text-gray-600  mb-8">
            Get the latest fashion trends and exclusive offers delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300  bg-white  text-gray-900  focus:ring-brand-gold focus:border-brand-gold"
            />
            <button className="bg-brand-gold hover:bg-brand-gold-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
