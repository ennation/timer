(function() {
  var Timer, minute, renderTimePart, sec5x, stylesheet,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  stylesheet = document.documentElement.style;

  minute = 60 * 1000; // 1 minute

  sec5x = 5 * 1000; // 5 seconds

  renderTimePart = function(x) {
    return x.toString().padStart(2, '0');
  };

  Timer = class Timer {
    constructor(dom) {
      this.dom = dom;
      this.duration = 5 * minute;
      this.started = null;
      this.elapsed = 0;
    }

    addDuration(delta) {
      this.duration += delta;
      if (this.duration > 90 * minute) {
        this.duration = 90 * minute;
      }
      if (this.duration < 0) {
        this.duration = 0;
      }
      return this.update();
    }

    remaining() {
      var left, now;
      left = this.duration;
      left -= this.elapsed;
      if (this.started) {
        now = new Date();
        left -= now - this.started;
      }
      return left;
    }

    update() {
      var left;
      //# Compute number of seconds left
      left = this.remaining();
      left /= 1000;
      //# Update display
      if (left < 0) {
        this.dom.classList.add('negative');
        left = -left;
      } else {
        this.dom.classList.remove('negative');
      }
      left = Math.ceil(left);
      this.dom.getElementById('minutes').textContent = renderTimePart(Math.floor(left / 60));
      return this.dom.getElementById('seconds').textContent = renderTimePart(modulo(left, 60));
    }

    toggle() {
      if (this.started != null) {
        return this.pause();
      } else {
        return this.start();
      }
    }

    start() {
      if (this.started != null) {
        return;
      }
      this.started = new Date();
      return this.schedule();
    }

    pause() {
      var now;
      if (this.started == null) {
        return;
      }
      if (this.timeout != null) {
        clearTimeout(this.timeout);
      }
      now = new Date();
      this.elapsed += now - this.started;
      this.started = null;
      return this.update();
    }

    reset() {
      this.pause();
      this.elapsed = 0;
      return this.update();
    }

    zero() {
      this.duration = 0;
      return this.update();
    }

    schedule() {
      var next;
      next = this.remaining();
      next -= Math.floor(next);
      return this.timeout = setTimeout(() => {
        this.update();
        return this.schedule();
      }, next);
    }

  };

  window.onload = function() {
    var button, handleKey, i, len, ref, results, timer;
    timer = new Timer(document.getElementById('timer'));
    timer.update();
    window.addEventListener('keypress', handleKey = function(e) {
      var backColor, colonColor1, colonColor2, foreColor;
      switch (e.key) {
        case '\\':
          // get current color values from stylesheet
          backColor = getComputedStyle(document.documentElement).getPropertyValue("--color-bg");
          foreColor = getComputedStyle(document.documentElement).getPropertyValue("--color-fg");
          colonColor1 = getComputedStyle(document.documentElement).getPropertyValue("--colon-color-1");
          colonColor2 = getComputedStyle(document.documentElement).getPropertyValue("--colon-color-2");
          // switch background and foreground color values in stylesheet
          stylesheet.setProperty("--color-bg", foreColor);
          stylesheet.setProperty("--color-fg", backColor);
          stylesheet.setProperty("--colon-color-1", colonColor2);
          return stylesheet.setProperty("--colon-color-2", colonColor1);
        case 'r':
        case 'R':
          return timer.reset();
        case '0':
          return timer.zero();
        case '+':
        case '=':
          return timer.addDuration(minute);
        case ']':
          return timer.addDuration(sec5x);
        case '-':
        case '_':
          return timer.addDuration(-minute);
        case '[':
          return timer.addDuration(-sec5x);
        case ' ':
        case 'p':
        case 'P':
          return timer.toggle();
      }
    });
    ref = document.getElementsByClassName('button');
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      button = ref[i];
      results.push(button.addEventListener('click', function(e) {
        return handleKey({
          key: e.currentTarget.getAttribute('data-key')
        });
      }));
    }
    return results;
  };

}).call(this);
