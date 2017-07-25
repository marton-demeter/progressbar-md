### Description

A simple cli progressbar module for NodeJS.

Features:
  - Custom layout
  - Automatic resizing
  - Interpolation
  
### Installation

###### Local

```
  [sudo] npm install --save progressbar-md
```

###### Global

```
  [sudo] npm install --global progressbar-md
```

### Usage

```javascript
  const progressbar = require('progressbar-md');
  
  progressbar.update(10, {
    message: 'Processing...'
  });
```

### Customization


Tokens for formatting the layout:
  - ':pct' - Percentage, left padded to occupy a total of 4 spaces
  - ':bar' - Progressbar, default width 20, min-width 4
  - ':spc' - Space, optional to fill up the command line
  - ':str' - String, message to display
  
```javascript
  progressbar.format(':pct :bar:spc:str');
```

---

Set a message to be displayed for ALL updates.

```javascript
  progressbar.message('Processing...');
  
  progressbar.update(10);
```

---

Modify the width of the progressbar.

```javascript
  progressbar.width(25);
  progressbar.min_width(2);
```

---

Modify what the progressbar looks like.

```javascript
  progressbar.filled('#');
  progressbar.empty(' ');
  progressbar.boundary('[',']');
```

### Advanced Usage

It's possible to wrap the displayed message with a function by passing the function as an argument into update. Progressbar-md can also display a custom message (wrapped in a custom function) once the bar reaches 100%. The bar also extends EventEmitter and emits a 'complete' event when it completes.

```javascript
  const progressbar = require('progressbar-md');
  const log = require('logger-md');
  
  progressbar.on('complete', () => {
    progressbar.new(); // reset progress, reuse progressbar
  });
  
  progressbar.update(100, {
    message: 'Processing...',
    function: log.info.return,
    fmessage: 'Done',
    ffunction: log.success.return
  });
```


