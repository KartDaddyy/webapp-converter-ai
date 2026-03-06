import 'package:flutter/material.dart';

void main() { runApp(const MyApp()); }

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RiConnect',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Color(0xFF1E3A8A)),
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

  final List<Widget> _screens = [
    const HomeScreen(),
    const FeaturesScreen(),
    const PricingScreen(),
    const AboutUsScreen(),
    const ContactScreen(),
  ];

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
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.featured_play_list), label: 'Features'),
          BottomNavigationBarItem(icon: Icon(Icons.monetization_on), label: 'Pricing'),
          BottomNavigationBarItem(icon: Icon(Icons.info), label: 'About Us'),
          BottomNavigationBarItem(icon: Icon(Icons.contact_mail), label: 'Contact'),
        ],
        currentIndex: _selectedIndex,
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
      appBar: AppBar(
        title: const Text('Home'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(8.0),
        children: <Widget>[
          Card(
            child: ListTile(
              title: const Text('Welcome to RiConnect'),
              subtitle: const Text('Your professional networking starts here!'),
            ),
          ),
          // Additional placeholders for Home screen
          Card(
            child: ListTile(
              title: const Text('Recent Connections'),
              subtitle: const Text('You have 5 new connections!'),
            ),
          ),
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
      appBar: AppBar(
        title: const Text('Features'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(8.0),
        children: <Widget>[
          Card(
            child: ListTile(
              title: const Text('Feature 1'),
              subtitle: const Text('Description of Feature 1.'),
            ),
          ),
          Card(
            child: ListTile(
              title: const Text('Feature 2'),
              subtitle: const Text('Description of Feature 2.'),
            ),
          ),
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
      appBar: AppBar(
        title: const Text('Pricing'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(8.0),
        children: <Widget>[
          Card(
            child: ListTile(
              title: const Text('Basic Plan'),
              subtitle: const Text('Monthly fee: $10'),
            ),
          ),
          Card(
            child: ListTile(
              title: const Text('Pro Plan'),
              subtitle: const Text('Monthly fee: $30'),
            ),
          ),
        ],
      ),
    );
  }
}

class AboutUsScreen extends StatelessWidget {
  const AboutUsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('About Us'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(8.0),
        children: <Widget>[
          Card(
            child: ListTile(
              title: const Text('Our Mission'),
              subtitle: const Text('To connect professionals worldwide.'),
            ),
          ),
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
      appBar: AppBar(
        title: const Text('Contact'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(8.0),
        children: <Widget>[
          Card(
            child: ListTile(
              title: const Text('Get in Touch'),
              subtitle: const Text('Email: contact@riconnect.com'),
            ),
          ),
        ],
      ),
    );
  }
}