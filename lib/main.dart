import 'package:flutter/material.dart';

void main() { runApp(const MyApp()); }

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RiConnect',
      theme: ThemeData(colorScheme: ColorScheme.fromSeed(seedColor: Color(0xFF1E3A8A)), useMaterial3: true),
      home: MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
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
      body: _getScreenWidget(_selectedIndex),
      bottomNavigationBar: BottomNavigationBar(
        items: <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.featured_play_list), label: 'Features'),
          BottomNavigationBarItem(icon: Icon(Icons.attach_money), label: 'Pricing'),
          BottomNavigationBarItem(icon: Icon(Icons.info), label: 'About'),
          BottomNavigationBarItem(icon: Icon(Icons.contact_mail), label: 'Contact'),
        ],
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }

  Widget _getScreenWidget(int index) {
    switch (index) {
      case 0:
        return HomeScreen();
      case 1:
        return FeaturesScreen();
      case 2:
        return PricingScreen();
      case 3:
        return AboutScreen();
      case 4:
        return ContactScreen();
      default:
        return HomeScreen();
    }
  }
}

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Home')), 
      body: ListView(
        children: <Widget>[ 
          Card(child: ListTile(title: Text('Welcome to RiConnect!'))),
          Card(child: ListTile(title: Text('Discover features to help you connect.'))),
        ],
      ),
    );
  }
}

class FeaturesScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Features')), 
      body: ListView(
        children: <Widget>[ 
          Card(child: ListTile(title: Text('Feature 1: Easy Networking'))),
          Card(child: ListTile(title: Text('Feature 2: Event Planning'))),
        ],
      ),
    );
  }
}

class PricingScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Pricing')), 
      body: ListView(
        children: <Widget>[ 
          Card(child: ListTile(title: Text('Basic Plan: \$10/month'))),
          Card(child: ListTile(title: Text('Pro Plan: \$30/month'))),
        ],
      ),
    );
  }
}

class AboutScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('About')), 
      body: ListView(
        children: <Widget>[ 
          Card(child: ListTile(title: Text('RiConnect is a networking platform.'))),
        ],
      ),
    );
  }
}

class ContactScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Contact')), 
      body: ListView(
        children: <Widget>[ 
          Card(child: ListTile(title: Text('Contact us at support@riconnect.com'))),
        ],
      ),
    );
  }
}