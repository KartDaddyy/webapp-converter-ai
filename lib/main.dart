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

  static const List<Widget> _screens = <Widget>[ 
    OnboardingScreen(),
    HomeFeedScreen(),
    SearchDiscoveryScreen(),
    MessagingScreen(),
    NotificationsScreen(),
    SettingsScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('RiConnect'),),
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.star), label: 'Features'),
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

class OnboardingScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Onboarding'),),
      body: ListView(
        children: const <Widget>[
          Card(child: ListTile(title: Text('Welcome to RiConnect'),),),
          Card(child: ListTile(title: Text('Discover new connections'),),),
          Card(child: ListTile(title: Text('Seamless networking'),),),
        ],
      ),
    );
  }
}

class HomeFeedScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home Feed'),),
      body: ListView(
        children: const <Widget>[
          Card(child: ListTile(title: Text('Post 1: Connecting in your area'),),),
          Card(child: ListTile(title: Text('Post 2: New features added!'),),),
          Card(child: ListTile(title: Text('Post 3: Upcoming events'),),),
        ],
      ),
    );
  }
}

class SearchDiscoveryScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Search & Discovery'),),
      body: ListView(
        children: const <Widget>[
          Card(child: ListTile(title: Text('Search connections'),),),
          Card(child: ListTile(title: Text('Browse categories'),),),
          Card(child: ListTile(title: Text('Discover new profiles'),),),
        ],
      ),
    );
  }
}

class MessagingScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Messaging'),),
      body: ListView(
        children: const <Widget>[
          Card(child: ListTile(title: Text('Chat with John'),),),
          Card(child: ListTile(title: Text('Chat with Jane'),),),
          Card(child: ListTile(title: Text('Chat with Chris'),),),
        ],
      ),
    );
  }
}

class NotificationsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Notifications'),),
      body: ListView(
        children: const <Widget>[
          Card(child: ListTile(title: Text('New connection request from Alex'),),),
          Card(child: ListTile(title: Text('Reminder for event'),),),
          Card(child: ListTile(title: Text('Message from Sarah'),),),
        ],
      ),
    );
  }
}

class SettingsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings'),),
      body: ListView(
        children: const <Widget>[
          Card(child: ListTile(title: Text('Account Settings'),),),
          Card(child: ListTile(title: Text('Privacy Settings'),),),
          Card(child: ListTile(title: Text('Notification Preferences'),),),
        ],
      ),
    );
  }
}