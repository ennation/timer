# Timer

*Fork of [edemaine's Timer](https://github.com/edemaine/timer) with bell sound removed and additional features added:*

- 5-second duration adjustments
- Toggleable light and dark modes via the backslash key
- Other miscellaneous personal tweaks

This is a simple web app for counting down a desired number of minutes,
such as time-limited presentations (e.g., final projects in a class).
Main features:

- Large highly visible (and responsive) countdown timer showing remaining minutes and seconds. 
- After the timer expires, the display turns red, counts up from zero, and a warning displays.
- Controllable by keyboard interface (see below).

## Usage

Control the timer using the following keyboard commands:

- `-`/`+`: Adjust the time on the timer in 1-minute increments.
- `[`/`]`: Adjust the time on the timer in 5-second increments.
- Spacebar (or `p`): Start/pause/resume the timer.
- `r`: Reset the timer: stop timer and return to original duration set.
- `\\`: Toggle the timer interface between light and dark mode.

## Installation

To install this web app in your own web space, clone this repository and run `npm install`
(to compile into HTML, CSS, and JavaScript). Then open `index.html`.

## License

This software is licensed under an <a href="LICENSE">MIT license</a>.
