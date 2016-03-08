Ruminate API
============

This [NodeJS](https://nodejs.org) based API uses the [Restify Library](http://restify.com/) to provide an endpoint for managing the daily reflections of all [Ruminate Android & iOS Apps](https://github.com/codemis/ruminate).

Development
-----------

This repository is following the branching technique described in [this blog post](http://nvie.com/posts/a-successful-git-branching-model/), and the semantic version set out on the [Semantic Versioning Website](http://semver.org/).

To run the server, pass in the appropriate environment (testing, development, production) in your call.

`NODE_ENV=production node app.js`

Postgres
--------

* Start the server with: `postgres -D /usr/local/var/postgres`
* Log into cli: `psql`

Notes
-----

Code structured inspired by [generator-restify](https://github.com/chris-l/generator-restify).

Issues
------

Questions or problems? Please post them on the [issue tracker](https://github.com/codemis/ruminate_api/issues). You can contribute changes by forking the project and submitting a pull request.
