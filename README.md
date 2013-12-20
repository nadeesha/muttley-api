muttley-api
===========
This is the API for Muttley.

Muttley was an entrant to Pan Pearson Hackathon 2013 - November and grabbed the award for the best API mashup within Pearson eCollege - Sri Lanka. It implements a collaborative environment where people can get together and research content.

# Bells and Whistles
* Internal search engine implemented with ElasticSearch
* Collaborative features from Mozilla's TogetherJS

# Under the hood
* Two seperate NodeJS based servers to serve the API and the front end
* ElasticSearch for search and MongoDB as the transactional data store
* AngularJS based front-end
* Fully responsive goodness with Bootstrap/Angular-UI
* Support for AMPQ based events to play nice with websockets
