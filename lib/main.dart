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
  int _selectedIndex = 0;

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('RiConnect')), 
      body: _getSelectedScreen(),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.chat), label: 'Chat'),
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.notifications), label: 'Notifications'),
        ],
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }

  Widget _getSelectedScreen() {
    switch (_selectedIndex) {
      case 0:
        return HomeScreen();
      case 1:
        return ChatScreen();
      case 2:
        return DashboardScreen();
      case 3:
        return NotificationsScreen();
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
          Card(child: ListTile(title: Text('Enhance your collaboration!'))),
        ],
      ),
    );
  }
}

class ChatScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Chat')), 
      body: ListView(
        children: <Widget>[
          Card(child: ListTile(title: Text('Chat with team members'))),
          Card(child: ListTile(title: Text('Latest messages will appear here'))),
        ],
      ),
    );
  }
}

class DashboardScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Project Dashboard')), 
      body: ListView(
        children: <Widget>[
          Card(child: ListTile(title: Text('Projects Overview'))),
          Card(child: ListTile(title: Text('Team Contributions'))),
        ],
      ),
    );
  }
}

class NotificationsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Notifications')), 
      body: ListView(
        children: <Widget>[
          Card(child: ListTile(title: Text('New update available!'))),
          Card(child: ListTile(title: Text('You have a new message'))),
        ],
      ),
    );
  }
}