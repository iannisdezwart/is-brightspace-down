# IsBrightspaceDown

The Delft University of Technical Difficulties' brightspace WebApp is known for its bad uptime and constant malfunctioning.
That's is why I made the IsBrightspaceDown WebApp.
It does exactly what it describes, and doesn't malfunction every minute.
This WebApp exposes a public REST API that can be used to determine downtime and historical statistics.


## Installation

First install the node modules by doing

```sh
$ npm i
```

Then compile the website with

```sh
$ node compiler
```

Start the API with

```sh
$ node api
```

And use your favourite webroot server to host the front-end.
The public directory is the generated `./root` directory.


## API documentation

The API is hosted at https://isbrightspacedownapi.iannis.io.

`/check` returns `'up'` or `'down'` if brightspace is currently up or down.

`/` is an alias for the `/check` endpoint.

`/last-minute` returns a comma-seperated list of 60 booleans. Each entry in the list represents if brightspace was down or up at that second. The last boolean is the newest value. 1 = down, 0 = up.

`/last-hour` does the same as the previous, but returns a list of 3600 booleans.


## Final words

Now it's your turn: use the API to create something cool! Add an icon to your status bar showing whether brightspace is down or not, code a raspberry PI to flash an LED if brightspace is down or go into an entirely different direction! It would be cool to see someone hacking into the TU Delft servers linking the API to the fire alarm too ;-). Options are endless!