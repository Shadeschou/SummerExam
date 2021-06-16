import 'package:flutter/material.dart';
import 'package:oxbridge/model/event.dart';
import 'package:oxbridge/Service/http_service.dart';
//Stateless widget that makes a list with events using futures.
class EventList extends StatelessWidget{
  
  final HttpService httpService = HttpService();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
    
      appBar: AppBar(
        title: Text("Events")
        ),
      
      body: FutureBuilder(
        future: httpService.getEvents(),
        builder: (BuildContext context, AsyncSnapshot<List<Event>> snapshot) {
          if (snapshot.hasData) {
            List<Event> events = snapshot.data;
            return ListView(
              children: events
                  .map(
                    (Event event) => ListTile(
                      title: Text(event.name),
                      tileColor: Colors.lightBlue.shade50,
                      subtitle: Text('city:' + event.city.toString() + ' Start date: ' + DateTime.parse(event.eventStart).toIso8601String().substring(0,10) + ' Event ID: ' + event.eventId.toString())
                    ),
                  )
                  .toList(),
            );
          } else {
            return Center(child: CircularProgressIndicator());
          }
        },
      ),
    );

  }
}


