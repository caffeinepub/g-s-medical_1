import { useEffect, useState } from 'react';
import { useGetActiveSellers } from '../hooks/useQueries';
import Navigation from '../components/Navigation';
import SellersSection from '../components/SellersSection';
import AnimatedSection from '../components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Phone, MessageCircle, Mail, MapPin, Award, Shield, Heart,
  Star, ChevronDown, Pill, Users, TrendingUp, CheckCircle,
  Clock, Truck, HeartPulse
} from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

function HeroSection() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-banner.dim_1920x600.png"
          alt="G&S Medical Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-emerald-800/80 to-emerald-900/90" />
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl" />
      </div>

      {/* Medical cross decorations */}
      <div className="absolute top-1/4 right-1/4 opacity-5">
        <div className="w-32 h-32 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-32 bg-white rounded-sm" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-8 bg-white rounded-sm" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Logo */}
        <div className="animate-fade-in mb-6">
          <div className="inline-block relative">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden border-4 border-gold-400 shadow-gold-hover animate-float">
              <img
                src="/assets/generated/gs-medical-logo.dim_512x512.png"
                alt="G&S Medical Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center shadow-gold">
              <CheckCircle size={16} className="text-emerald-900" />
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="animate-fade-up mb-4" style={{ animationDelay: '0.1s' }}>
          <Badge className="bg-gold-400/20 text-gold-300 border border-gold-400/30 px-4 py-1.5 text-sm font-medium">
            🌿 Trusted Healthcare Partner Since Day One
          </Badge>
        </div>

        {/* Title */}
        <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            G&S{' '}
            <span className="text-gradient-gold">MEDICAL</span>
          </h1>
          <p className="text-xl md:text-2xl text-emerald-200 font-light mb-2">
            Your Health, Our Priority
          </p>
          <p className="text-base md:text-lg text-emerald-300/80 max-w-2xl mx-auto leading-relaxed">
            Delivering quality medicines, trusted healthcare solutions, and exceptional service to every doorstep across India.
          </p>
        </div>

        {/* Stats */}
        <div className="animate-fade-up grid grid-cols-3 gap-4 max-w-lg mx-auto my-8" style={{ animationDelay: '0.3s' }}>
          {[
            { value: '100%', label: 'Genuine Medicines' },
            { value: '24/7', label: 'Customer Support' },
            { value: '∞', label: 'Trust & Care' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gold-300">{stat.value}</div>
              <div className="text-xs text-emerald-300 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="animate-fade-up flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: '0.4s' }}>
          <Button
            onClick={() => scrollToSection('medicines')}
            size="lg"
            className="btn-gold px-8 py-3 text-base rounded-full shadow-gold-hover"
          >
            <Pill size={18} className="mr-2" />
            Browse Medicines
          </Button>
          <a
            href="https://wa.me/919766343454"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 px-8 py-3 text-base rounded-full w-full sm:w-auto"
            >
              <SiWhatsapp size={18} className="mr-2 text-green-400" />
              WhatsApp Us
            </Button>
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in mt-16" style={{ animationDelay: '0.8s' }}>
          <button
            onClick={() => scrollToSection('about')}
            className="text-emerald-300 hover:text-white transition-colors animate-bounce"
          >
            <ChevronDown size={32} />
          </button>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const features = [
    { icon: Shield, title: 'Certified & Licensed', desc: 'All medicines sourced from licensed manufacturers with proper certifications.' },
    { icon: Heart, title: 'Patient-First Approach', desc: 'Every decision we make is guided by the well-being of our customers.' },
    { icon: Truck, title: 'Fast Delivery', desc: 'Quick and reliable delivery ensuring medicines reach you on time.' },
    { icon: Award, title: 'Quality Assured', desc: '100% genuine medicines with proper storage and handling protocols.' },
    { icon: Clock, title: 'Always Available', desc: 'Round-the-clock customer support for all your healthcare needs.' },
    { icon: HeartPulse, title: 'Healthcare Excellence', desc: 'Committed to raising the standard of healthcare accessibility in India.' },
  ];

  return (
    <section id="about" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <AnimatedSection animation="slide-left">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <HeartPulse size={14} />
              About G&S MEDICAL
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-emerald-900 mb-6 leading-tight">
              A Legacy of Trust in{' '}
              <span className="text-gradient-green">Healthcare</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-emerald-800">G&S MEDICAL</strong> is more than just a medical store — it's a commitment to your health and well-being. Founded with a vision to make quality healthcare accessible to everyone, we have grown into a trusted name in the medical industry.
              </p>
              <p>
                Our store offers an extensive range of genuine medicines, healthcare products, and medical supplies. We work directly with licensed manufacturers and distributors to ensure every product meets the highest quality standards.
              </p>
              <p>
                At G&S MEDICAL, we believe that <em>every person deserves access to quality healthcare</em>. Our dedicated team works tirelessly to provide not just medicines, but complete healthcare solutions with compassion and professionalism.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {['Licensed Pharmacy', 'Genuine Products', 'Expert Guidance', 'Affordable Prices'].map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium border border-emerald-200">
                  <CheckCircle size={13} />
                  {tag}
                </span>
              ))}
            </div>
          </AnimatedSection>

          {/* Right features grid */}
          <AnimatedSection animation="slide-right">
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-xl border border-emerald-100 hover:shadow-card transition-all duration-300 hover:-translate-y-0.5"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                    <feature.icon size={20} className="text-emerald-700" />
                  </div>
                  <h3 className="font-semibold text-emerald-900 text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function MedicinesSection() {
  const [medicineIds, setMedicineIds] = useState<string[]>([]);
  const { actor } = { actor: null } as any; // Will be populated via direct fetch

  // Sample medicine categories for display when no medicines are loaded
  const categories = [
    { name: 'Prescription Medicines', icon: '💊', count: 'Wide Range' },
    { name: 'OTC Medicines', icon: '🏥', count: 'Available' },
    { name: 'Vitamins & Supplements', icon: '🌿', count: 'Premium' },
    { name: 'Ayurvedic Products', icon: '🌱', count: 'Natural' },
    { name: 'Medical Equipment', icon: '🩺', count: 'Certified' },
    { name: 'Baby Care', icon: '👶', count: 'Safe' },
    { name: 'Skin Care', icon: '✨', count: 'Dermatologist' },
    { name: 'Surgical Items', icon: '🔬', count: 'Sterile' },
  ];

  return (
    <section id="medicines" className="section-padding bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Pill size={14} />
            Our Products
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-emerald-900 mb-4">
            Quality Medicines & Healthcare Products
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We stock a comprehensive range of genuine medicines and healthcare products to meet all your medical needs.
          </p>
        </AnimatedSection>

        {/* Categories grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {categories.map((cat, index) => (
            <AnimatedSection key={cat.name} animation="fade-up" delay={index * 60}>
              <div className="bg-white rounded-2xl p-5 text-center border border-emerald-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-emerald-900 text-sm mb-1 leading-tight">{cat.name}</h3>
                <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 bg-emerald-50">
                  {cat.count}
                </Badge>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection animation="fade-up" className="text-center">
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-400/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">
                Can't Find What You Need?
              </h3>
              <p className="text-emerald-200 mb-6 max-w-xl mx-auto">
                Our team can help you source any medicine or healthcare product. Contact us and we'll assist you promptly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="tel:+919766343454">
                  <Button className="btn-gold rounded-full px-6 w-full sm:w-auto">
                    <Phone size={16} className="mr-2" />
                    Call Customer Care
                  </Button>
                </a>
                <a href="https://wa.me/919766343454" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-6 w-full sm:w-auto">
                    <SiWhatsapp size={16} className="mr-2 text-green-400" />
                    WhatsApp Us
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function TeamSection() {
  const teamMembers = [
    {
      name: 'GAURAV SASVADE',
      title: 'Founder & CEO',
      image: '/assets/generated/ceo-avatar.dim_400x400.png',
      phone: '+91 9270556455',
      whatsapp: '+91 9270556455',
      bio: `Mr. Gaurav Sasvade is the visionary Founder and Chief Executive Officer of G&S MEDICAL. With an unwavering passion for making quality healthcare accessible to every individual, he established G&S MEDICAL with a mission to bridge the gap between patients and genuine medicines.

His entrepreneurial spirit, combined with deep knowledge of the pharmaceutical industry, has transformed G&S MEDICAL into a trusted healthcare brand. Under his dynamic leadership, the company has built strong relationships with licensed manufacturers, ensuring that every product meets the highest quality standards.

Mr. Sasvade's commitment to customer satisfaction and ethical business practices has earned G&S MEDICAL the trust of thousands of customers. He believes that healthcare is a fundamental right, and his tireless efforts reflect this conviction every single day.`,
      achievements: ['Visionary Leadership', 'Healthcare Innovation', 'Customer Champion', 'Quality Advocate'],
      color: 'from-emerald-600 to-emerald-800',
    },
    {
      name: 'SHUSHANT WAGHMARE',
      title: 'Co-Founder & Director',
      image: '/assets/generated/cofounder-avatar.dim_400x400.png',
      phone: '+91 9156896495',
      whatsapp: '+91 9156896495',
      bio: `Mr. Shushant Waghmare is the Co-Founder and Director of G&S MEDICAL, bringing exceptional strategic vision and operational expertise to the organization. His profound understanding of business operations and supply chain management has been the backbone of G&S MEDICAL's growth and success.

As Director, Mr. Waghmare oversees the company's strategic initiatives, seller network expansion, and operational excellence. His meticulous approach to quality control and his ability to build lasting partnerships have significantly strengthened G&S MEDICAL's position in the market.

Mr. Waghmare's dedication to building a robust and transparent medical distribution network has helped countless sellers and customers alike. His leadership philosophy centers on integrity, innovation, and an unwavering commitment to the health and well-being of the communities G&S MEDICAL serves.`,
      achievements: ['Strategic Vision', 'Operations Expert', 'Network Builder', 'Integrity Leader'],
      color: 'from-gold-600 to-gold-700',
    },
  ];

  return (
    <section id="team" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Users size={14} />
            Our Leadership
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-emerald-900 mb-4">
            The Visionaries Behind G&S MEDICAL
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Meet the passionate leaders who built G&S MEDICAL with a dream of making quality healthcare accessible to all.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <AnimatedSection
              key={member.name}
              animation={index === 0 ? 'slide-left' : 'slide-right'}
              delay={index * 150}
            >
              <div className="bg-white rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-emerald-100">
                {/* Header */}
                <div className={`bg-gradient-to-r ${member.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white/50 shadow-lg flex-shrink-0">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold">{member.name}</h3>
                      <p className="text-white/80 text-sm font-medium">{member.title}</p>
                      <div className="flex gap-2 mt-2">
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-full text-xs transition-colors"
                        >
                          <Phone size={11} />
                          {member.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="p-6">
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line mb-4">
                    {member.bio}
                  </p>

                  {/* Achievements */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {member.achievements.map((achievement) => (
                      <span
                        key={achievement}
                        className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium border border-emerald-200"
                      >
                        <Star size={10} className="text-gold-500" />
                        {achievement}
                      </span>
                    ))}
                  </div>

                  {/* Contact buttons */}
                  <div className="flex gap-3 pt-4 border-t border-emerald-50">
                    <a
                      href={`tel:${member.phone}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2.5 rounded-xl text-sm font-medium transition-colors border border-emerald-200"
                    >
                      <Phone size={14} />
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${member.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 py-2.5 rounded-xl text-sm font-medium transition-colors border border-green-200"
                    >
                      <SiWhatsapp size={14} />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  const reasons = [
    { icon: '🏆', title: 'Industry Leaders', desc: 'Recognized as a trusted name in the medical distribution industry.' },
    { icon: '💯', title: '100% Authentic', desc: 'Every medicine is sourced directly from licensed manufacturers.' },
    { icon: '🚀', title: 'Fast Service', desc: 'Quick order processing and reliable delivery to your doorstep.' },
    { icon: '💰', title: 'Best Prices', desc: 'Competitive pricing without compromising on quality.' },
    { icon: '🤝', title: 'Trusted Network', desc: 'A growing network of verified sellers and distributors.' },
    { icon: '📞', title: '24/7 Support', desc: 'Our customer care team is always ready to assist you.' },
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-emerald-900 to-emerald-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full" />
        <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 border border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 text-gold-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-white/20">
            <TrendingUp size={14} />
            Why Choose Us
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Why G&S MEDICAL is{' '}
            <span className="text-gradient-gold">Your Best Choice</span>
          </h2>
          <p className="text-emerald-200 max-w-2xl mx-auto text-lg">
            We don't just sell medicines — we deliver trust, quality, and care with every order.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <AnimatedSection key={reason.title} animation="fade-up" delay={index * 80}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 text-center">
                <div className="text-4xl mb-3">{reason.icon}</div>
                <h3 className="font-semibold text-white mb-2">{reason.title}</h3>
                <p className="text-emerald-200 text-sm leading-relaxed">{reason.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const contacts = [
    {
      category: 'Customer Care',
      icon: HeartPulse,
      color: 'bg-emerald-600',
      phone: '+91 9766343454',
      whatsapp: '+91 9766343454',
      description: 'For orders, queries, and general assistance',
    },
    {
      category: 'CEO - Gaurav Sasvade',
      icon: Award,
      color: 'bg-gold-500',
      phone: '+91 9270556455',
      whatsapp: '+91 9270556455',
      description: 'For business partnerships and escalations',
    },
    {
      category: 'Co-Founder - Shushant Waghmare',
      icon: Users,
      color: 'bg-emerald-700',
      phone: '+91 9156896495',
      whatsapp: '+91 9156896495',
      description: 'For seller registration and operations',
    },
  ];

  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Phone size={14} />
            Get In Touch
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-emerald-900 mb-4">
            We're Here to Help You
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Reach out to us through any of the channels below. Our team is always ready to assist you.
          </p>
        </AnimatedSection>

        {/* Contact cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {contacts.map((contact, index) => (
            <AnimatedSection key={contact.category} animation="fade-up" delay={index * 100}>
              <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 p-6 border border-emerald-100">
                <div className={`w-12 h-12 ${contact.color} rounded-xl flex items-center justify-center mb-4 shadow-emerald`}>
                  <contact.icon size={22} className="text-white" />
                </div>
                <h3 className="font-semibold text-emerald-900 mb-1">{contact.category}</h3>
                <p className="text-xs text-muted-foreground mb-4">{contact.description}</p>

                <div className="space-y-2">
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-900 transition-colors group"
                  >
                    <div className="w-7 h-7 bg-emerald-50 rounded-full flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                      <Phone size={13} className="text-emerald-600" />
                    </div>
                    <span className="font-medium">{contact.phone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-green-700 hover:text-green-900 transition-colors group"
                  >
                    <div className="w-7 h-7 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors">
                      <SiWhatsapp size={13} className="text-green-600" />
                    </div>
                    <span className="font-medium">WhatsApp</span>
                  </a>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Email & additional info */}
        <AnimatedSection animation="fade-up">
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-3xl p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full -translate-y-1/2" />
              <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gold-400 rounded-full translate-y-1/2" />
            </div>
            <div className="relative z-10">
              <Mail size={32} className="mx-auto mb-3 text-gold-300" />
              <h3 className="font-display text-xl font-bold mb-2">Email Us</h3>
              <a
                href="mailto:gauravsaswade@gsgroupswebstore.in"
                className="text-emerald-200 hover:text-white transition-colors text-lg font-medium"
              >
                gauravsaswade@gsgroupswebstore.in
              </a>
              <p className="text-emerald-300 text-sm mt-2">
                We respond to all emails within 24 hours
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'gs-medical');

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-medical text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/generated/gs-medical-logo.dim_512x512.png"
                alt="G&S Medical Logo"
                className="w-12 h-12 rounded-full border-2 border-gold-400"
              />
              <div>
                <h3 className="font-display text-xl font-bold text-white">G&S MEDICAL</h3>
                <p className="text-emerald-300 text-xs">Your Health, Our Priority</p>
              </div>
            </div>
            <p className="text-emerald-300 text-sm leading-relaxed mb-4 max-w-sm">
              G&S MEDICAL is your trusted partner for quality medicines and healthcare products. We are committed to making healthcare accessible, affordable, and reliable for everyone.
            </p>
            <div className="flex items-center gap-2 text-sm text-emerald-300">
              <Mail size={14} />
              <a href="mailto:gauravsaswade@gsgroupswebstore.in" className="hover:text-white transition-colors">
                gauravsaswade@gsgroupswebstore.in
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', id: 'hero' },
                { label: 'About Us', id: 'about' },
                { label: 'Medicines', id: 'medicines' },
                { label: 'Our Sellers', id: 'sellers' },
                { label: 'Our Team', id: 'team' },
                { label: 'Contact', id: 'contact' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-emerald-300 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                  >
                    → {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <p className="text-emerald-400 text-xs mb-1">Customer Care</p>
                <a href="tel:+919766343454" className="text-emerald-200 hover:text-white text-sm transition-colors flex items-center gap-1.5">
                  <Phone size={12} />
                  +91 9766343454
                </a>
              </li>
              <li>
                <p className="text-emerald-400 text-xs mb-1">CEO</p>
                <a href="tel:+919270556455" className="text-emerald-200 hover:text-white text-sm transition-colors flex items-center gap-1.5">
                  <Phone size={12} />
                  +91 9270556455
                </a>
              </li>
              <li>
                <p className="text-emerald-400 text-xs mb-1">Co-Founder</p>
                <a href="tel:+919156896495" className="text-emerald-200 hover:text-white text-sm transition-colors flex items-center gap-1.5">
                  <Phone size={12} />
                  +91 9156896495
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-emerald-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-emerald-400">
          <p>© {currentYear} G&S MEDICAL. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with{' '}
            <Heart size={14} className="text-red-400 fill-red-400 mx-0.5" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:text-gold-300 transition-colors font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <MedicinesSection />
      <SellersSection />
      <TeamSection />
      <WhyChooseSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
