import 'dart:convert';

//model for user that handles To Json
class User {
  String firstName;
  String lastName;
  String email;
  String password;

  User();

  String toJson() {
    Map<String, dynamic> userMap = {
      'firstname': this.firstName,
      'lastname': this.lastName,
      'emailUsername': this.email,
      'password': this.password

    };
    return jsonEncode(userMap);
  }
}
