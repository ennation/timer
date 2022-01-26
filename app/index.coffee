stylesheet = document.documentElement.style

minute = 60 * 1000  # 1 minute
sec5x = 5 * 1000  # 5 seconds

renderTimePart = (x) -> x.toString().padStart 2, '0'

class Timer
  constructor: (@dom) ->
    @duration = 5 * minute
    @started = null
    @elapsed = 0
  addDuration: (delta) ->
    @duration += delta
    if @duration > 90 * minute
      @duration = 90 * minute
    if @duration < 0
      @duration = 0
    @update()

  remaining: ->
    left = @duration
    left -= @elapsed
    if @started
      now = new Date
      left -= now - @started
    left
  update: ->
    ## Compute number of seconds left
    left = @remaining()
    left /= 1000

    ## Update display
    if left < 0
      @dom.classList.add 'negative'
      left = -left
    else
      @dom.classList.remove 'negative'
    left = Math.ceil left
    @dom.getElementById 'minutes'
    .textContent = renderTimePart left // 60
    @dom.getElementById 'seconds'
    .textContent = renderTimePart left %% 60

  toggle: ->
    if @started?
      @pause()
    else
      @start()
  start: ->
    return if @started?
    @started = new Date
    @schedule()
  pause: ->
    return unless @started?
    clearTimeout @timeout if @timeout?
    now = new Date
    @elapsed += now - @started
    @started = null
    @update()
  reset: ->
    @pause()
    @elapsed = 0
    @update()
  zero: ->
    @duration = 0;
    @update()

  schedule: ->
    next = @remaining()
    next -= Math.floor next
    @timeout = setTimeout =>
      @update()
      @schedule()
    , next

window.onload = ->
  timer = new Timer document.getElementById 'timer'
  timer.update()

  window.addEventListener 'keypress', handleKey = (e) ->
    switch e.key
      when '\\'
        # get current color values from stylesheet
        backColor = getComputedStyle(document.documentElement).getPropertyValue("--color-bg")
        foreColor = getComputedStyle(document.documentElement).getPropertyValue("--color-fg")
        colonColor1 = getComputedStyle(document.documentElement).getPropertyValue("--colon-color-1")
        colonColor2 = getComputedStyle(document.documentElement).getPropertyValue("--colon-color-2")
        # switch background and foreground color values in stylesheet
        stylesheet.setProperty("--color-bg", foreColor)
        stylesheet.setProperty("--color-fg", backColor)
        stylesheet.setProperty("--colon-color-1", colonColor2)
        stylesheet.setProperty("--colon-color-2", colonColor1)
      when 'r', 'R'
        timer.reset()
      when '0'
        timer.zero()
      when '+', '='
        timer.addDuration minute
      when ']'
        timer.addDuration sec5x
      when '-', '_'
        timer.addDuration -minute
      when '['
        timer.addDuration -sec5x
      when ' ', 'p', 'P'
        timer.toggle()

  for button in document.getElementsByClassName 'button'
    button.addEventListener 'click', (e) ->
      handleKey key: e.currentTarget.getAttribute 'data-key'
