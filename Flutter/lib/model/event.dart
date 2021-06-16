import 'package:json_annotation/json_annotation.dart';
import 'package:flutter/foundation.dart';

//Model for events and mapping for converting From Json
class Event {
  final num eventId;
  final String name;
  final String eventStart;
  final String eventEnd;
  final String city;
  final String eventCode;
  final String actualEventStart;
  final bool isLive;

  Event(
      {@required this.eventId,
      @required this.name,
      @required this.eventStart,
      @required this.eventEnd,
      @required this.city,
      @required this.eventCode,
      @required this.actualEventStart,
      @required this.isLive
  });

  factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
      eventId: json['eventId'] as num,
      name: json['name'] as String,
      eventStart: json['eventStart'] as String,
      eventEnd: json['eventEnd'] as String,
      city: json['city'] as String,
      eventCode: json['eventCode'] as String,
      actualEventStart: json['actualEventStart'] as String,
      isLive: json['isLive'] as bool
    );
  }
}
