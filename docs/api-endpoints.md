FORMAT: 1A
HOST: https://api-ruminate.codingstudio.org

# Ruminate API (Version 1)

An API for handling the backend of the [Ruminate Mobile App](https://github.com/codemis/ruminate).  This API stores anf grant access to:

  * Consumers - The various people using the Ruminate App.
  * Ruminations - The Bible passages these Consumers are reflecting on.
  * Responses - The Consumer's answers to questions that challenge them to continue their Ruminations.

This API is a [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) based API that returns JSON responses.  **In order to use this API, you will need a Client ID.**  Please contact us at [johnathan[at]jpulos.com](#), if you are interested in using this API.

## Developed By

A team of awesome programmers during the [Code for the Kingdom](http://codeforthekingdom.com) in October 2015.

> "If you're changing the world, you're working on important things. You're excited to get up in the morning." - Larry Page

# Group Consumers

A single Consumer is an individual user of the Ruminate App.  When the Ruminate App is installed, it registers the Consumer with the API, and stores their API key in a safe place on the device.  It is important not to loose the Consumer's API key.  If you do,  you will need to register them again.

## Retrieve [GET /consumers]

Retrieve the Consumer's information based on the provided API key.

+ Request Retrieve Consumer Data (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

      {
      }

+ Response 200 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]
      location: /consumers

  + Body

    {
      "device": {
        "model": "Nexus 7",
        "platform": "Android",
        "version": "4.4",
        "uuid": "03bb8569-7fb9-4883-9779-56c6651d694c"
      },
      "push": {
        "interval": 20000,
        "token": "5e7a72d6-d076-11e5-ab30-625662870761",
        "receive": true,
        "timezone": "America/Los_Angeles"
      },
      "createdAt": "2016-02-14 20:25:25",
      "updatedAt": "2016-03-14 20:25:25"
    }

+ Response 400 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Bad Request. The consumer could not be found on the server."
    }

+ Response 400 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Bad Request. The data you provided is malformed or missing."
    }

<!-- include(includes/response_common_errors.md) -->

## Register [POST /consumers]

Register a new Consumer, and retrieve an API key.  **You will need a Client ID to register the Consumer.**

+ Request Create New Consumer (application/json)

  + Headers

      x-client-id: [Your Client ID]

  + Body

      {
        "device": {
          "model": "Nexus 7",
          "platform": "Android",
          "uuid": "03bb8569-7fb9-4883-9779-56c6651d694c",
          "version": "4.4"
        },
        "push": {
          "interval": 20000,
          "receive": true,
          "timezone": "America/Los_Angeles",
          "token": "5e7a72d6-d076-11e5-ab30-625662870761"
        }
      }

  + Schema

      <!-- include(includes/schemas/consumer.md) -->

+ Response 201 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]
      location: /consumers

  + Body

    {
      "device": {
        "model": "Nexus 7",
        "platform": "Android",
        "version": "4.4",
        "uuid": "03bb8569-7fb9-4883-9779-56c6651d694c"
      },
      "push": {
        "interval": 20000,
        "token": "5e7a72d6-d076-11e5-ab30-625662870761",
        "receive": true,
        "timezone": "America/Los_Angeles"
      },
      "createdAt": "2016-02-14 20:25:25",
      "updatedAt": ""
    }

+ Response 404 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Not Found. The client could not be found on the server."
    }

+ Response 400 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Bad Request. The data you provided is malformed or missing."
    }

+ Response 400 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Validation error: The [field] is missing in the consumer object."
    }

<!-- include(includes/response_common_errors.md) -->

## Update [PUT /consumers]

Update the information for the consumer that belongs to the given API key.

+ Request Update Consumer (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

      {
        "device": {
          "model": "Nexus 7",
          "platform": "Android",
          "uuid": "03bb8569-7fb9-4883-9779-56c6651d694c",
          "version": "4.4"
        },
        "push": {
          "interval": 20000,
          "receive": true,
          "timezone": "America/Los_Angeles",
          "token": "5e7a72d6-d076-11e5-ab30-625662870761"
        }
      }

  + Schema

      <!-- include(includes/schemas/consumer.md) -->

+ Response 200 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]
      location: /consumers

  + Body

    {
      "device": {
        "model": "Nexus 7",
        "platform": "Android",
        "version": "4.4",
        "uuid": "03bb8569-7fb9-4883-9779-56c6651d694c"
      },
      "push": {
        "interval": 20000,
        "token": "5e7a72d6-d076-11e5-ab30-625662870761",
        "receive": true,
        "timezone": "America/Los_Angeles"
      },
      "createdAt": "2016-02-14 20:25:25",
      "updatedAt": "2016-03-14 20:25:25"
    }

+ Response 404 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Not Found. The consumer could not be found on the server."
    }

+ Response 400 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Bad Request. The data you provided is malformed or missing."
    }

+ Response 400 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Validation error: The [field] is missing in the consumer object."
    }

<!-- include(includes/response_common_errors.md) -->

# Group Ruminations

A consumer's rumination on a passage of Scripture.

## Retrieve All [GET /consumers/ruminations]

Retrieve a list of all the Consumer's ruminations.

+ Request Retrieve All Ruminations (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]


  + Body

      {
        "sortOrder": {
          "ruminations": {
            "field": "createdAt",
            "direction": "desc"
          },
          "responses": {
            "field": "createdAt",
            "direction": "desc"
          }
        }
      }

  + Schema

      {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "The Rumination Options Object",
        "description": "An options object for setting sort order on the returned results.",
        "type": "object",
        "properties": {
          "sortOrder": {
            "title": "Sort Options",
            "description": "Options for sorting the needed data.",
            "type": "object",
            "properties": {
              "ruminations": {
                "title": "Sort Options for Ruminations",
                "description": "Define how you want the ruminations to be sorted.",
                "type": "object",
                "properties": {
                  "field": {
                    "title": "Field to Sort By",
                    "description": "The field to sort the data by.",
                    "type": "string",
                    "enum": ["passageVersion", "passageSnippet", "firstBook", "firstAbbreviation", "firstChapter", "firstVerse", "lastBook", "lastAbbreviation", "lastChapter", "lastVerse", "createdAt", "updatedAt"]
                  },
                  "direction": {
                    "title": "Sort Direction",
                    "description": "The direction to sort the data in.",
                    "type": "string",
                    "enum": ["asc", "desc"]
                  }
                }
              },
              "responses": {
                "title": "Sort Options for Responses",
                "description": "Define how you want the responses to be sorted.",
                "type": "object",
                "properties": {
                  "field": {
                    "title": "Field to Sort By",
                    "description": "The field to sort the data by.",
                    "type": "string",
                    "enum": ["createdAt", "updatedAt"]
                  },
                  "direction": {
                    "title": "Sort Direction",
                    "description": "The direction to sort the data in.",
                    "type": "string",
                    "enum": ["asc", "desc"]
                  }
                }
              }
            }
          }
        }
      }

+ Response 200 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    [
      {
        "id": 213,
        "passage": {
          "version": "NIV",
          "snippet": "Now these are the names of the children of Israel, which came into Egypt...",
          "first": {
            "book": "Exodus",
            "abbreviation": "Exod",
            "chapter": 1,
            "verse": 1
          },
          "last": {
            "book": "Exodus",
            "abbreviation": "Exod",
            "chapter": 1,
            "verse": 5
          }
        },
        "responses": [
          {
            "id": 32,
            "question": {
              "id": 21,
              "theme": "application",
              "content": "For whom was the passage written, and why?"
            },
            "answer": "It is written for the reader to understand how the Isrealites arrived in Egypt.",
            "createdAt": "2016-02-14 21:25:25",
            "updatedAt": "2016-03-14 22:25:25"
          }
        ],
        "createdAt": "2016-02-14 20:25:25",
        "updatedAt": "2016-03-14 20:25:25"
      },
      {
        "id": 212,
        "passage": {
          "version": "NIV",
          "snippet": "And the serpent said unto the woman, Ye shall not surely die...",
          "first": {
            "book": "Genesis",
            "abbreviation": "Gen",
            "chapter": 3,
            "verse": 4
          },
          "last": {
            "book": "Genesis",
            "abbreviation": "Gen",
            "chapter": 3,
            "verse": 17
          }
        },
        "responses": [],
        "createdAt": "2016-02-14 20:25:25",
        "updatedAt": "2016-03-14 20:25:25"
      }
    ]

+ Response 404 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Not Found. The consumer could not be found on the server."
    }

+ Response 404 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Not Found. The ruminations could not be found on the server."
    }

+ Response 400 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Bad Request. The field you provided is not allowed."
    }

+ Response 400 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Bad Request. The direction you provided is not allowed."
    }
<!-- include(includes/response_common_errors.md) -->

## Retrieve [GET /consumers/ruminations/(rumination_id)]

Retrieve a specific Consumer's rumination.

+ Parameters
    + rumination_id (number) - ID of the specific rumination to retrieve.

+ Request Retrieve A Rumination (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

  {
    "sortOrder": {
      "responses": {
        "field": "createdAt",
        "direction": "desc"
      }
    }
  }

  + Schema

      {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "The Rumination Options Object",
        "description": "An options object for setting sort order on the returned results.",
        "type": "object",
        "properties": {
          "sortOrder": {
            "title": "Sort Options",
            "description": "Options for sorting the needed data.",
            "type": "object",
            "properties": {
              "responses": {
                "title": "Sort Options for Responses",
                "description": "Define how you want the responses to be sorted.",
                "type": "object",
                "properties": {
                  "field": {
                    "title": "Field to Sort By",
                    "description": "The field to sort the data by.",
                    "type": "string",
                    "enum": ["createdAt", "updatedAt"]
                  },
                  "direction": {
                    "title": "Sort Direction",
                    "description": "The direction to sort the data in.",
                    "type": "string",
                    "enum": ["asc", "desc"]
                  }
                }
              }
            }
          }
        }
      }

+ Response 200 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]
      location: /consumers/ruminations/213

  + Body

      {
        "id": 213,
        "passage": {
          "version": "NIV",
          "snippet": "Now these are the names of the children of Israel, which came into Egypt...",
          "first": {
            "book": "Exodus",
            "abbreviation": "Exod",
            "chapter": 1,
            "verse": 1
          },
          "last": {
            "book": "Exodus",
            "abbreviation": "Exod",
            "chapter": 1,
            "verse": 5
          }
        },
        "responses": [
          {
            "id": 32,
            "question": {
              "id": 21,
              "theme": "application",
              "content": "For whom was the passage written, and why?"
            },
            "answer": "It is written for the reader to understand how the Isrealites arrived in Egypt.",
            "createdAt": "2016-02-14 21:25:25",
            "updatedAt": "2016-03-14 22:25:25"
          }
        ],
        "createdAt": "2016-02-14 20:25:25",
        "updatedAt": "2016-03-14 20:25:25"
      }

+ Response 404 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Not Found. The consumer could not be found on the server."
    }

+ Response 404 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Not Found. The rumination could not be found on the server."
    }

<!-- include(includes/response_common_errors.md) -->

## Create [POST /consumers/ruminations]

Create a new rumination for the Consumer.

+ Request Create A Rumination (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
      "passage": {
        "version": "NIV",
        "snippet": "When the righteous thrive, the people rejoice...",
        "first": {
          "book": "Proverbs",
          "abbreviation": "Prov",
          "chapter": 29,
          "verse": 2
        },
        "last": {
          "book": "Proverbs",
          "abbreviation": "Prov",
          "chapter": 29,
          "verse": 2
        }
      }
    }

  + Schema

      <!-- include(includes/schemas/rumination.md) -->

+ Response 201 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]
      location: /consumers/ruminations/216

  + Body

    {
      "id": 216,
      "passage": {
        "version": "NIV",
        "snippet": "When the righteous thrive, the people rejoice...",
        "first": {
          "book": "Proverbs",
          "abbreviation": "Prov",
          "chapter": 29,
          "verse": 2
        },
        "last": {
          "book": "Proverbs",
          "abbreviation": "Prov",
          "chapter": 29,
          "verse": 2
        }
      },
      "responses": [],
      "createdAt": "2016-02-14 20:25:25",
      "updatedAt": ""
    }

+ Response 404 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Not Found. The consumer could not be found on the server."
    }

<!-- include(includes/response_common_errors.md) -->

## Update [PUT /consumers/ruminations/(rumination_id)]

Update the specific Consumer's rumination.

+ Parameters
    + rumination_id (number) - ID of the specific rumination to update.

+ Request Retrieve A Rumination (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
      "passage": {
        "version": "KJV",
        "snippet": "When the righteous are in authority, the people rejoice...",
        "first": {
          "book": "Proverbs",
          "abbreviation": "Prov",
          "chapter": 29,
          "verse": 2
        },
        "last": {
          "book": "Proverbs",
          "abbreviation": "Prov",
          "chapter": 29,
          "verse": 4
        }
      }
    }

  + Schema

      <!-- include(includes/schemas/rumination.md) -->

+ Response 200 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]
      location: /consumers/ruminations/216

  + Body

    {
      "id": 216,
      "passage": {
        "version": "KJV",
        "snippet": "When the righteous are in authority, the people rejoice...",
        "first": {
          "book": "Proverbs",
          "abbreviation": "Prov",
          "chapter": 29,
          "verse": 2
        },
        "last": {
          "book": "Proverbs",
          "abbreviation": "Prov",
          "chapter": 29,
          "verse": 4
        }
      },
      "responses": [],
      "createdAt": "2016-02-14 20:25:25",
      "updatedAt": "2016-02-14 20:35:25"
    }

+ Response 404 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Not Found. The consumer could not be found on the server."
    }

+ Response 404 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Not Found. The rumination could not be found on the server."
    }

<!-- include(includes/response_common_errors.md) -->

## Delete [DELETE /consumers/ruminations/(rumination_id)]

Delete the specific Consumer's rumination.

+ Parameters
    + rumination_id (number) - ID of the specific rumination to delete.

+ Request Delete A Rumination (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
    }

+ Response 204 (application/json)


+ Response 404 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Not Found. The consumer could not be found on the server."
    }

+ Response 404 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Not Found. The rumination could not be found on the server."
    }


<!-- include(includes/response_common_errors.md) -->


# Group Responses

Each rumination has one or more responses to a series of questions asked through out the day.  A Cron job adds a question, and a blank response to a rumination at the Consumer's set push interval, and then pushes a notification to respond.  Since the creation of the responses is made by the Cron job, you only have access to update the response.

## Update [PUT /consumers/ruminations/(rumination_id)/responses/(response_id)]

Update the Consumer's response.

+ Parameters
    + rumination_id (number) - ID of the specific rumination the response belongs to.
    + response_id (number) - ID of the specific response to update.

+ Request Update a Response (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
      "answer": "The verse focuses on introducing the book to the reader, and explain the current state of Isreal."
    }

  + Schema

      {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "The Rumination Options Object",
        "description": "An options object for setting sort order on the returned results.",
        "type": "object",
        "properties": {
          "answer": {
            "title": "Response Answer",
            "description": "The consumers response to the question.",
            "type": "string"
          }
        },
        "required": ["answer"]
      }

+ Response 200 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]
      location: /consumers/ruminations/216

  + Body

    {
      "id": 32,
      "question": {
        "id": 21,
        "theme": "application",
        "content": "For whom was the passage written, and why?"
      },
      "answer": "The verse focuses on introducing the book to the reader, and explain the current state of Isreal.",
      "createdAt": "2016-02-14 21:25:25",
      "updatedAt": "2016-03-14 22:45:25"
    }

+ Response 404 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Not Found. The consumer could not be found on the server."
    }


+ Response 404 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Not Found. The rumination could not be found on the server."
    }

+ Response 404 (application/json)

  + Headers

      x-api-key: [The Consumer's API Key]

  + Body

    {
        "error": "Not Found. The response could not be found on the server."
    }

<!-- include(includes/response_common_errors.md) -->
