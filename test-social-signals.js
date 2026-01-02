/**
 * Quick Test Script for Social Signals
 * 
 * Run this in browser console while logged in to add Social Signals to your profile
 * This allows you to see the features in action without code changes
 */

// Test function to add Social Signals to current user
async function addSocialSignalsTestData() {
  try {
    // Get auth token from Clerk
    const token = await window.Clerk.session.getToken();
    const userId = window.Clerk.user.id;
    
    console.log('🔐 Authenticated as:', userId);
    console.log('📤 Adding Social Signals test data...');
    
    // Test data with all Social Signals
    const testData = {
      interaction_style_badges: ['early-bird', 'quick-replier', 'night-owl'],
      message_comfort_level: 'selective',
      request_openness: 'connections_only',
      energy_mode: 'focus',
      energy_mode_expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
    };
    
    const response = await fetch('http://localhost:4000/api/user/update', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Social Signals added successfully!');
      console.log('📊 Updated user:', result.user);
      console.log('🔄 Refreshing page to see changes...');
      
      // Refresh after 1 second
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      console.error('❌ Error:', result.message);
    }
  } catch (error) {
    console.error('❌ Error adding Social Signals:', error);
    console.log('💡 Make sure:');
    console.log('   1. You are logged in');
    console.log('   2. Server is running on port 4000');
    console.log('   3. You are on http://localhost:5173');
  }
}

// Test different scenarios
const testScenarios = {
  // All signals visible
  full: {
    interaction_style_badges: ['early-bird', 'quick-replier', 'night-owl'],
    message_comfort_level: 'selective',
    request_openness: 'connections_only',
    energy_mode: 'focus',
    energy_mode_expires_at: new Date(Date.now() + 3600000).toISOString()
  },
  
  // High energy mode
  energetic: {
    energy_mode: 'high',
    message_comfort_level: 'open',
    interaction_style_badges: ['energetic', 'always-available']
  },
  
  // Away mode
  away: {
    energy_mode: 'away',
    request_openness: 'closed',
    message_comfort_level: 'closed'
  },
  
  // Focus mode
  focus: {
    energy_mode: 'focus',
    energy_mode_expires_at: new Date(Date.now() + 7200000).toISOString(),
    message_comfort_level: 'selective',
    interaction_style_badges: ['deep-work', 'focused']
  },
  
  // Reset to defaults (no signals visible)
  reset: {
    interaction_style_badges: [],
    message_comfort_level: 'open',
    request_openness: 'open',
    energy_mode: 'normal',
    energy_mode_expires_at: null
  }
};

// Helper to apply a scenario
async function applyScenario(scenarioName) {
  if (!testScenarios[scenarioName]) {
    console.error('❌ Unknown scenario. Available:', Object.keys(testScenarios));
    return;
  }
  
  try {
    const token = await window.Clerk.session.getToken();
    const response = await fetch('http://localhost:4000/api/user/update', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testScenarios[scenarioName])
    });
    
    const result = await response.json();
    if (result.success) {
      console.log(`✅ Applied scenario: ${scenarioName}`);
      window.location.reload();
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Make functions available globally
window.addSocialSignalsTestData = addSocialSignalsTestData;
window.applyScenario = applyScenario;
window.testScenarios = testScenarios;

console.log('🎯 Social Signals Test Script Loaded!');
console.log('');
console.log('📝 Usage:');
console.log('  addSocialSignalsTestData()  - Add all Social Signals to your profile');
console.log('  applyScenario("full")      - Apply full test scenario');
console.log('  applyScenario("energetic") - Apply energetic scenario');
console.log('  applyScenario("away")      - Apply away scenario');
console.log('  applyScenario("focus")     - Apply focus scenario');
console.log('  applyScenario("reset")     - Reset to defaults');
console.log('');
console.log('🚀 Run: addSocialSignalsTestData() to get started!');


