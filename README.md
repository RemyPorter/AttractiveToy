Inspired by [this video](https://www.youtube.com/watch?v=kbKtFN71Lfs), I whipped up my own little web toy to let you play with the same thing. Though this one is five dimensional! (That's not as exciting as it sounds, it just uses color, too).

To use the toy, go [here](https://remyporter.github.io/AttractiveToy/), then: 

* `click+drag`: You can move the attractor points by moving your mouse close to them, and clicking and dragging when they appear red.
* `click`: You can add new attractor points by clicking anywhere else on the canvas.
* ` `: You can randomly change the color of the last attractor you added or grabbed with the spacebar.
* `r`: You can remove the last attractor you touched with the "r" key.
* `+`: you can increase the "lerp" step with "+"
* `-`: you can decrease the "lerp" step with "-"
* `p`: you can hide the "pings" for the attractors with this key, useful if you want to save your image.
* `c`: you can clear/reset the drawing with "c".

**Saving**: right click on the canvas and let your browser do the work.

So yes, from those controls, you know this doesn't work great on mobile devices. Sorry.

Uses [Sylvester](http://sylvester.jcoglan.com/) for the 5D vector math.