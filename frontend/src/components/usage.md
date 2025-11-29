// ===== USAGE EXAMPLES =====

// Example 1: Using StatsCard
/*
import { TrendingUp } from 'lucide-react';
<StatsCard 
  icon={TrendingUp} 
  value="$25M+" 
  label="Lost to voice fraud annually"
  trend={12}
  trendUp={false}
/>
*/

// Example 2: Using FeatureCard
/*
import { Zap } from 'lucide-react';
<FeatureCard
  icon={Zap}
  title="Lightning Fast"
  description="Get results in under 3 seconds"
  link="/analyze"
  delay={0.1}
/>
*/

// Example 3: Using TeamMemberCard
/*
<TeamMemberCard
  avatar="👨‍💻"
  name="John Doe"
  role="ML Engineer"
  github="https://github.com/johndoe"
  linkedin="https://linkedin.com/in/johndoe"
/>
*/

// Example 4: Using TechStackBadge
/*
<TechStackBadge
  icon="⚛️"
  name="React"
  category="Frontend"
/>
*/

// Example 5: Using AlertBox
/*
<AlertBox
  variant="warning"
  title="Medium Confidence Detection"
  description="Some suspicious patterns detected. Additional verification recommended."
  actionLabel="Learn More"
  onAction={() => console.log('Action clicked')}
/>
*/

// Example 6: Using PatternTag
/*
<PatternTag
  name="Spectral Anomaly"
  description="Unusual frequency patterns detected in audio"
/>
*/

// Example 7: Using EmptyState
/*
import { FileAudio } from 'lucide-react';
<EmptyState
  icon={FileAudio}
  heading="No Analysis History Yet"
  description="Upload and analyze your first audio file to get started"
  ctaLabel="Analyze Your First Audio"
  ctaLink="/analyze"
/>
*/

// Example 8: Using Toast
/*
import { toast, ToastContainer } from './components/Toast';

// In your App.jsx, add:
<ToastContainer />

// Then use anywhere:
toast.success('Analysis completed successfully!');
toast.error('Failed to upload file');
toast.warning('File size exceeds limit');
toast.info('Processing your audio...');
*/

// Example 9: Using LoadingSpinner variants
/*
// Overlay (full screen)
<LoadingSpinner variant="overlay" label="Analyzing audio" />

// Card (component level)
<LoadingSpinner variant="card" label="Loading results" />

// Inline (button/text)
<LoadingSpinner variant="inline" label="Saving" />
*/

// Example 10: Using ConfidenceGauge sizes
/*
// Small (for cards)
<ConfidenceGauge confidence={0.87} size="small" />

// Medium (default)
<ConfidenceGauge confidence={0.87} size="medium" />

// Large (for result page)
<ConfidenceGauge confidence={0.87} size="large" />
*/