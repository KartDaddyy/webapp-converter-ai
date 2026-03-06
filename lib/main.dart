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

  final List<Widget> _screens = [
    HomeScreen(),
    FeaturesScreen(),
    PricingScreen(),
    AboutScreen(),
    ContactScreen(),
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
        title: Text('RiConnect'),
      ),
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.featured_play_list), label: 'Features'),
          BottomNavigationBarItem(icon: Icon(Icons.attach_money), label: 'Pricing'),
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
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home'),
      ),
      body: ListView(
        children: <Widget>[
          Card(child: ListTile(title: Text('Welcome to RiConnect!'))),
          Card(child: ListTile(title: Text('Manage your contacts with ease!'))),
        ],
      ),
    );
  }
}

class FeaturesScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Features'),
      ),
      body: ListView(
        children: <Widget>[
          Card(child: ListTile(title: Text('Reconnect easily with contacts'))),
          Card(child: ListTile(title: Text('Track your relationships effectively'))),
          Card(child: ListTile(title: Text('Organize communications'))),
        ],
      ),
    );
  }
}

class PricingScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Pricing'),
      ),
      body: ListView(
        children: <Widget>[
          Card(child: ListTile(title: Text('Free Plan - Basic Features'))),
          Card(child: ListTile(title: Text('Pro Plan - Advanced Features for \$10/month'))),
          Card(child: ListTile(title: Text('Business Plan - Custom Features for \$30/month'))),
        ],
      ),
    );
  }
}

class AboutScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('About Us'),
      ),
      body: ListView(
        children: <Widget>[
          Card(child: ListTile(title: Text('Learn about RiConnect'))),
          Card(child: ListTile(title: Text('Our mission and vision'))),
        ],
      ),
    );
  }
}

class ContactScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Contact'),
      ),
      body: ListView(
        children: <Widget>[
          Card(child: ListTile(title: Text('Get in touch with us'))),
          Card(child: ListTile(title: Text('Email: support@riconnect.com'))),
        ],
      ),
    );
  }
}