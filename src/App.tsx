import { Hero } from './components/Hero'
import { RSVP } from './components/RSVP'
import { GiftRegistry } from './components/GiftRegistry'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Hero />
      <RSVP />
      <GiftRegistry />
      <Footer />
    </div>
  )
}

export default App
