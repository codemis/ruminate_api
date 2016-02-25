+ Response 400 (application/json)

  + Headers

      X-API-Key: [The Consumer's API Key]

  + Body

    {
        "error": "Not Found. The client could not be found on the server."
    }

+ Response 404 (application/json)

  + Headers

      X-API-Key: [The Consumer's API Key]

  + Body

    {
        "error": "Bad Request. The request could not be understood by the server due to malformed syntax."
    }

+ Response 500 (application/json)

  + Headers

      X-API-Key: [The Consumer's API Key]

  + Body

    {
        "error": "Internal Server Error. The server encountered an unexpected condition."
    }
