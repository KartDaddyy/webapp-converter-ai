import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, FlatList } from 'react-native';

const HomeScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Welcome to RiConnect</Text>
    <Text style={styles.content}>Your AI-powered tool for efficient solutions.</Text>
  </View>
);

const FeaturesScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Features</Text>
    <Text style={styles.content}>1. AI Integration
2. User-friendly Interface
3. Real-time Analytics
4. Scalable Solutions</Text>
  </View>
);

const PricingScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Pricing</Text>
    <Text style={styles.content}>Our pricing plans are tailored to fit your needs:
- Basic: $10/month
- Pro: $20/month
- Enterprise: Contact us for pricing</Text>
  </View>
);

const AboutScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>About Us</Text>
    <Text style={styles.content}>We are dedicated to providing AI-driven solutions that enhance productivity and efficiency.</Text>
  </View>
);

const ContactScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Contact Us</Text>
    <Text style={styles.content}>Email: support@riconnect.com
Phone: +1 (555) 123-4567</Text>
  </View>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('Home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen />;
      case 'Features':
        return <FeaturesScreen />;
      case 'Pricing':
        return <PricingScreen />;
      case 'About':
        return <AboutScreen />;
      case 'Contact':
        return <ContactScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      <ScrollView style={styles.scrollView}>
        {renderScreen()}
      </ScrollView>
      <View style={styles.tabBar}>
        {['Home', 'Features', 'Pricing', 'About', 'Contact'].map((tab) => (
          <TouchableOpacity key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flexGrow: 1,
  },
  screen: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  content: {
    fontSize: 16,
    color: '#374151',
    marginTop: 8,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1E3A8A',
    padding: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: '#FFFFFF',
  },
  activeTabText: {
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
});

export default App;