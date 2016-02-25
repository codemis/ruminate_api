{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "The Consumer Object",
    "description": "The consumer who will be consuming this API from their mobile device.",
    "type": "object",
    "properties": {
      "device": {
        "title": "The Consumer's Device Data",
        "description": "Information about the consumer's device.",
        "type": "object",
        "properties": {
          "model": {
            "title": "The Device's Model",
            "description": "The model of the consumer's mobile device.",
            "type": "string"
          },
          "platform": {
            "title": "The Device's Platform",
            "description": "The platform of the consumer's mobile device.",
            "type": "string"
          },
          "uuid": {
            "title": "The Device's Unique Identifier",
            "description": "The unique identifier for the consumer's mobile device.",
            "type": "string"
          },
          "version": {
            "title": "The Device's Operating System",
            "description": "The version of the operating system for the consumer's mobile device.",
            "type": "string"
          }
        },
        "required": ["uuid"]
      },
      "push": {
        "title": "The Consumer's Push Notification Settings",
        "description": "Push notification settings for the given consumer.",
        "type": "object",
        "properties": {
          "interval": {
            "title": "The Time Between Each Push Notification",
            "description": "The number of seconds between each push notification and reflection question.",
            "type": "integer"
          },
          "receive": {
            "title": "Do They Want to Receive Push Notification?",
            "description": "Indicates whether they want to receive push notifications.",
            "type": "boolean"
          },
          "timezone": {
            "title": "Current Timezone",
            "description": "The current timezone the device is located in.",
            "type": "string"
          },
          "token": {
            "title": "Push Notification Token",
            "description": "The Consumer's push notification token retrieved after asking for permission to push notify.",
            "type": "string"
          },
        },
        "required": ["interval", "receive", "timezone", "token"]
      }
    }
}
