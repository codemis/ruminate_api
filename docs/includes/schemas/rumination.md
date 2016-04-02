{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "The Rumination Object",
  "description": "An object containing information about the rumination.",
  "type": "object",
  "properties": {
    "passage": {
      "title": "The Scripture Passage",
      "description": "The passage the Consumer selected to reflect on.",
      "type": "object",
      "required": ["version", "snippet", "first", "last"],
      "properties": {
        "version": {
          "title": "The Scripture Version",
          "description": "The version of the Bible being used.",
          "type": "string"
        },
        "snippet": {
          "title": "A Snippet of the Passage",
          "description": "A truncated version of the passage.",
          "type": "string"
        },
        "first": {
          "title": "Starting Passage",
          "description": "The starting verse of the selected passage.",
          "type": "object",
          "required": ["book", "abbreviation", "chapter", "verse"],
          "properties": {
            "book": {
              "title": "The Book of the Bible",
              "description": "The book of the Bible selected.",
              "type": "string"
            },
            "abbreviation": {
              "title": "The Book of the Bible Abbreviation",
              "description": "The abbreviation of the book of the Bible selected.",
              "type": "string"
            },
            "chapter": {
              "title": "The Chapter of the Book",
              "description": "The selected chapter in the book.",
              "type": "integer"
            },
            "verse": {
              "title": "The Starting Verse",
              "description": "The selected starting verse in the chapter.",
              "type": "integer"
            }
          }
        },
        "last": {
          "title": "Ending Passage",
          "description": "The ending verse of the selected passage.",
          "type": "object",
          "required": ["book", "abbreviation", "chapter", "verse"],
          "properties": {
            "book": {
              "title": "The Book of the Bible",
              "description": "The book of the Bible selected.",
              "type": "string"
            },
            "abbreviation": {
              "title": "The Book of the Bible Abbreviation",
              "description": "The abbreviation of the book of the Bible selected.",
              "type": "string"
            },
            "chapter": {
              "title": "The Chapter of the Book",
              "description": "The selected chapter in the book.",
              "type": "integer"
            },
            "verse": {
              "title": "The Ending Verse",
              "description": "The selected ending verse in the chapter.",
              "type": "integer"
            }
          }
        }
      }
    }
  }
}
