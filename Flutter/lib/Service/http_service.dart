import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart';
import 'package:oxbridge/model/event.dart';


class HttpService {
  final String eventsURL = "http://10.0.2.2:3000/events";

  Future<List<Event>> getEvents() async {
    Response res = await get(eventsURL);

    if (res.statusCode == 201) {
      List<dynamic> body = jsonDecode(res.body);

      List<Event> products = body
        .map(
          (dynamic item) => Event.fromJson(item),
        )
        .toList();

      return products;
    } else {
      throw "Unable to retrieve products.";
    }
  }

}