/**
 * About Page Module Type Definitions for BuyBright Admin.
 * Granular section-wise data models for Hero & Metrics, Who We Are,
 * Mission & Vision, Milestones Journey, Trust Pillars, and CTA Banner.
 */

export interface AboutMetricItem {
  id: string;
  number: string;
  label: string;
  description: string;
  icon: string;
  accentColor: string;
}

export interface AboutHeroSection {
  badgeText: string;
  title: string;
  highlightText?: string;
  leadText: string;
  primaryBtnText: string;
  primaryBtnUrl: string;
  secondaryBtnText: string;
  secondaryBtnUrl: string;
  metrics: AboutMetricItem[];
}

export interface AboutHighlightItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface AboutWhoWeAreSection {
  eyebrow: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  mainImage: string;
  experienceBadgeNum: string;
  experienceBadgeText: string;
  secondaryImage: string;
  highlights: AboutHighlightItem[];
}

export interface AboutMissionVisionSection {
  eyebrow: string;
  title: string;
  subtitle: string;
  missionStatement: string;
  missionPoints: string[];
  visionStatement: string;
  visionPoints: string[];
}

export interface AboutMilestoneItem {
  id: string;
  year: string;
  tag: string;
  title: string;
  description: string;
  icon: string;
  accentColor: string;
}

export interface AboutJourneySection {
  eyebrow: string;
  title: string;
  subtitle: string;
  milestones: AboutMilestoneItem[];
}

export interface AboutPillarItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  themeColor: string;
}

export interface AboutPillarsSection {
  eyebrow: string;
  title: string;
  subtitle: string;
  pillars: AboutPillarItem[];
  // CTA Banner
  ctaTag: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaBtnText: string;
  ctaBtnUrl: string;
  ctaPhone: string;
}

export interface AboutPageData {
  hero: AboutHeroSection;
  whoWeAre: AboutWhoWeAreSection;
  missionVision: AboutMissionVisionSection;
  journey: AboutJourneySection;
  pillars: AboutPillarsSection;
  lastUpdated?: string;
}
