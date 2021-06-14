import 'package:flutter/material.dart';
import 'UI/home.dart';


void main() {
  runApp(new MaterialApp(
    title: "Oxbridge",
    debugShowCheckedModeBanner: false,
    home: Scaffold(
        appBar: PreferredSize(
      preferredSize: Size.fromHeight(700),
      child: Container(
        padding: EdgeInsets.all(15.0),
        decoration: BoxDecoration(
          image: DecorationImage(
              image: AssetImage("images/oxbridge.jpg"), fit: BoxFit.cover),
        ),child: Home(),
  )
  )
  )
  )
  );
}
