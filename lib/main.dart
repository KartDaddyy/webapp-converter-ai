import 'package:flutter/material.dart';

void main() { runApp(const MyApp()); }

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RiConnect',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Color(0xFF4CAF50)),
        useMaterial3: true,
      ),
      home: MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;
  final List<Widget> _screens = [
    HomeScreen(),
    FeaturesScreen(),
    PricingScreen(),
    AboutScreen(),
    ContactScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('RiConnect')), 
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[ 
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.featured_play_list), label: 'Features'),
          BottomNavigationBarItem(icon: Icon(Icons.price_change), label: 'Pricing'),
          BottomNavigationBarItem(icon: Icon(Icons.info), label: 'About'),
          BottomNavigationBarItem(icon: Icon(Icons.contact_mail), label: 'Contact'),
        ],
        currentIndex: _currentIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home')), 
      body: ListView(
        children: <Widget>[ 
          Card(child: ListTile(title: Text('Welcome to RiConnect!'))),
          Card(child: ListTile(title: Text('Reconnect with your contacts.'))),
        ],
      ),
    );
  }
}

class FeaturesScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Features')), 
      body: ListView(
        children: <Widget>[ 
          Card(child: ListTile(title: Text('Feature 1: Manage relationships easily.'))),
          Card(child: ListTile(title: Text('Feature 2: Track interactions with contacts.'))),
        ],
      ),
    );
  }
}

class PricingScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pricing')), 
      body: Column(
        children: <Widget>[ 
          Card(child: ListTile(title: Text('Free Plan: Basic features.'))),
          Card(child: ListTile(title: Text('Premium Plan: Advanced features.'))),
        ],
      ),
    );
  }
}

class AboutScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('About')), 
      body: Column(
        children: <Widget>[ 
          Card(child: ListTile(title: Text('About RiConnect: A platform to reconnect.'))),
        ],
      ),
    );
  }
}

class ContactScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Contact')), 
      body: Column(
        children: <Widget>[ 
          Card(child: ListTile(title: Text('Contact us at: support@riconnect.com'))),
        ],
      ),
    );
  }
}