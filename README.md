# minimaLINK

minimaLINK is a URL shortening service that takes long URLs and creates much shorter, manageable URLs. 
This project is built using Node.js for the backend and PostgreSQL for the database, and features a simple yet elegant frontend with dark theme design.


## Features

- URL shortening
- URL redirection
- Base62 conversion for shortened URLs
- unique ID for each url
- postgreSQL as database to store URLs
- Dark theme frontend
- Copy to clipboard directly

## Demo

You can check out the live demo [here](https://minimalink.netlify.app) (replace with actual live URL if deployed).

## Upcoming Features:

- Expiry of shortened URLs
- Load balancer when receiving incoming requests from clients. 
- Implement cache to avoid reading databases everytime. 
- Implement rate limiter.
- 302 redirect with analytics. 