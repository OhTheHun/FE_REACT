import HeroSection from '../components/landing/HeroSection'
import FeatureGrid from '../components/landing/FeatureGrid'
import ThemeShowcase from '../components/landing/ThemeShowcase'
import { features } from '../utils/constants'

function LandingPage() {
  return (
    <div className="space-y-16 pb-16">
      <HeroSection />
      <FeatureGrid />
      <ThemeShowcase />
    </div>
  )
}

export default LandingPage
