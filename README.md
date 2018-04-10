# Promise performance profiling

A simple tool for profiling the performance of Promises in the browser.
Useful for debugging what takes so long between the user presses a certain button and
and action following a complex async/await flow.


This won't work with native/untranspiled async functions, only with babel generated code. Use with Chrome.

<img src="/screenshot.png" alt="Screenshot of the profiling"/>


# Usage

The package changes the global object, so all you have to do is import it

```
import 'promise-performance';
```

Then, to see profile information, call `window.getPromiseProfiles()` in your devTools, and reset the timers by calling
`window.resetPromiseProfiles()`.

Happy profiling.