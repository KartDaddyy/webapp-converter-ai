import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  print("Handling a background message: ${message.messageId}");
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  runApp(const MyApp());
}

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

  @override
  void initState() {
    super.initState();
    _requestPermission();
    _getToken();
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      RemoteNotification? notification = message.notification;
      AndroidNotification? android = message.notification?.android;

      if (notification != null && android != null) {
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: Text(notification.title ?? ''),
            content: Text(notification.body ?? ''),
          ),
        );
      }
    });
  }

  void _requestPermission() async {
    await FirebaseMessaging.instance.requestPermission();
  }

  void _getToken() async {
    String? token = await FirebaseMessaging.instance.getToken();
    print("FCM Token: \$token");
  }

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
      body: _getScreen(_selectedIndex),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.star), label: 'Features'),
          BottomNavigationBarItem(icon: Icon(Icons.attach_money), label: 'Pricing'),
          BottomNavigationBarItem(icon: Icon(Icons.info), label: 'About'),
          BottomNavigationBarItem(icon: Icon(Icons.contact_mail), label: 'Contact'),
        ],
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }

  Widget _getScreen(int index) {
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
          Card(child: ListTile(title: Text('Reconnect with your network!'))),
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
          Card(child: ListTile(title: Text('Feature 1: Manage Contacts'))),
          Card(child: ListTile(title: Text('Feature 2: Schedule Reminders'))),
          Card(child: ListTile(title: Text('Feature 3: Networking Events'))),
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
          Card(child: ListTile(title: Text('Free Tier'))),
          Card(child: ListTile(title: Text('Pro Tier'))),
          Card(child: ListTile(title: Text('Enterprise Tier'))),
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
          Card(child: ListTile(title: Text('About RiConnect'))),
          Card(child: ListTile(title: Text('Mission and Vision'))),
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
          Card(child: ListTile(title: Text('Contact Us'))),
          Card(child: ListTile(title: Text('Support'))),
        ],
      ),
    );
  }
}