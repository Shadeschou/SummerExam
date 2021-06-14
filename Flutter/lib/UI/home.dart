import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:oxbridge/UI/eventlist.dart';
import 'package:oxbridge/model/user.dart';

class Home extends StatelessWidget {
  get ltr => null;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: PreferredSize(
      preferredSize: Size.fromHeight(700),
      child: Container(
        padding: EdgeInsets.all(15.0),
        decoration: BoxDecoration(
          image: DecorationImage(
              image: AssetImage("images/oxbridge.jpg"), fit: BoxFit.cover),
        ),
        child: ListView(children: <Widget>[
          BackGroundImageTestWidget(),
          SignUpText(),
          NextPageButton(),
        ]),
      ),
    ));
  }
}

class BackGroundImageTestWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    AssetImage backgroundAsset = AssetImage("images/logoTrans.png");
    Image image = Image(
      image: backgroundAsset,
    );
    return image;
  }
}

class SignUpButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var button = Container(
      child: ElevatedButton(
        onPressed: () {
          order(context);
        },
        child: Text("Sign up!"),
        style: ElevatedButton.styleFrom(
          primary: Colors.lightGreen,
          elevation: 5.0,
        ),
      ),
    );
    return button;
  }


  void order(BuildContext context) {
    var alert = AlertDialog(
        title: Text("Signed up!"), content: Text("Thanks for registering"));

    showDialog(context: context, builder: (BuildContext context) => alert);
  }
}
  

class SignUpText extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => _SignUpTextState();
}

class _SignUpTextState extends State<SignUpText> {
  var user = User();
  var _globalKey = GlobalKey<FormState>();
  var txt = TextEditingController();
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white70,
      padding: EdgeInsets.all(15.0),
      child: Column(
        children: <Widget>[
         Form(
              key: _globalKey,
              child: Column(children: [
                TextFormField(
                  decoration: InputDecoration(hintText: 'First Name'),
                  validator: (value) {
                    if (value.isEmpty) {
                      return 'First Name is Required';
                    }
                  },
                  onSaved: (value) {
                    user.firstName = value;
                  },
                ),
                TextFormField(
                  decoration: InputDecoration(hintText: 'Last Name'),
                  validator: (value) {
                    if (value.isEmpty) {
                      return 'Last Name is Required';
                    }
                  },
                  onSaved: (value) {
                    user.lastName = value;
                  },
                ),

                TextFormField(
                    decoration: InputDecoration(hintText: 'Email'),
                    keyboardType: TextInputType.emailAddress,
                    validator: (value) {
                      if (value.isEmpty) {
                        return 'email is required';
                      }
                    },
                    onSaved: (value) {
                      user.email = value;
                    }),
                    TextFormField(
                    decoration: InputDecoration(hintText: 'Password'),
                    keyboardType: TextInputType.text,
                    validator: (value) {
                      if (value.isEmpty) {
                        return 'email is required';
                      }
                    },
                    onSaved: (value) {
                      user.password = value;
                    }),
              ]),
            ),
            ElevatedButton(onPressed: () async {
              print("object");
                if (_globalKey.currentState.validate()) {
                  _globalKey.currentState.save();

                  var httpClient = HttpClient();
                  var request =
                  await httpClient.post('10.0.2.2', 3000, '/users/register');
                  request.headers.contentType = ContentType.json;
                  request.write(user.toJson());
                  var response = await request.close();
                  var stringBuffer = StringBuffer();
                  response.transform(utf8.decoder).listen((chunk) {
                    stringBuffer.write(chunk);});
                  showDialog(
                      context: context,
                      builder: (_) {
                        return AlertDialog(
                            title: Text('Message'),
                            content: Text(
                                '${user.toJson()}'),
                            actions: [
                             TextButton(
                                child: Text('OK'),
                                onPressed: () {
                                  Navigator.pop(context);
                                },
                              )
                            ]);
                      });
                }
              },
              child: Text('SUBMIT')
            )],
      ),
    );
  }
}

class NextPageButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var button = Container(
      child: ElevatedButton(
        onPressed: () {
         Navigator.push(
    context,
    MaterialPageRoute(builder: (context) => EventList()));
        },
        child: Text("See events"),
        style: ElevatedButton.styleFrom(
          primary: Colors.lightGreen,
          elevation: 5.0,
        ),
      ),
    );
    return button;
  }
}

