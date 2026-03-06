import 'package:flutter/material.dart';

void main() { runApp(const MyApp()); }

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RiConnect',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1E3A8A)),
        useMaterial3: true,
      ),
      home: const MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('RiConnect'),
      ),
      body: _selectedIndex == 0 ? const HomeScreen() :
            _selectedIndex == 1 ? const FeaturesScreen() :
            _selectedIndex == 2 ? const PricingScreen() :
            const SupportScreen(),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.star), label: 'Features'),
          BottomNavigationBarItem(icon: Icon(Icons.attach_money), label: 'Pricing'),
          BottomNavigationBarItem(icon: Icon(Icons.support), label: 'Support'),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: const Color(0xFF3B82F6),
        onTap: _onItemTapped,
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home')), 
      body: ListView(
        children: <Widget>[ 
          Card(child: ListTile(title: const Text('Welcome to RiConnect!'))),
          Card(child: ListTile(title: const Text('AI Tools Overview'))),
        ],
      ),
    );
  }
}

class FeaturesScreen extends StatelessWidget {
  const FeaturesScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Features')), 
      body: ListView(
        children: <Widget>[ 
          Card(child: ListTile(title: const Text('Feature 1: AI Insights'))),
          Card(child: ListTile(title: const Text('Feature 2: Application Management'))),
        ],
      ),
    );
  }
}

class PricingScreen extends StatelessWidget {
  const PricingScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pricing')), 
      body: ListView(
        children: <Widget>[ 
          Card(child: ListTile(title: const Text('Basic Plan - \$10/month'))),
          Card(child: ListTile(title: const Text('Pro Plan - \$30/month'))),
        ],
      ),
    );
  }
}

class SupportScreen extends StatelessWidget {
  const SupportScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Support')), 
      body: ListView(
        children: <Widget>[ 
          Card(child: ListTile(title: const Text('Getting Help'))),
          Card(child: ListTile(title: const Text('FAQ'))),
        ],
      ),
    );
  }
}

class ContactScreen extends StatelessWidget {
  const ContactScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Contact')), 
      body: ListView(
        children: <Widget>[ 
          Card(child: ListTile(title: const Text('Contact Us'))),
        ],
      ),
    );
  }
}