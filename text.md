add gsap typewriter animation to the randomly generated/selected text, such as ${gender}, ${ethnicity}, ${schoolType}, selectedExtracurriculars...

I already included gsap in my html, cdn imported.

Here is an example of using gsap to make a typewriter animation:

```html
<p class="line-1 anim-typewriter">Animation typewriter style using GSAP</p>
```

```css
/* Google Fonts */
@import url(https://fonts.googleapis.com/css?family=Anonymous+Pro);

/* Global */
html{
  min-height: 100%;
  overflow: hidden;
}

body{
  height: calc(100vh - 8em);
  padding: 4em;
  color: rgba(255,255,255,.75);
  font-family: 'Anonymous Pro', monospace;  
  background-color: rgb(25,25,25);
  /*font-size:28.8px;*/
}

.line-1{
    position: relative;
    top: 50%;  
    width: 20.18em;
    margin: 0 auto;
    border-right: 2px solid rgba(255,255,255,.75);
    font-size: 180%;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    -webkit-box-sizing:content-box;
    box-sizing:content-box;
}

/* Animation */
.anim-typewriter{
  width:0;
  /*animation: typewriter 4s steps(44) 1s 1 normal both,
             blinkTextCursor 500ms steps(44) infinite normal;*/
}

/*@keyframes typewriter{
  from{width: 0;}
  to{width: 24em;}
}

@keyframes blinkTextCursor{
  from{border-right-color: rgba(255,255,255,.75);}
  to{border-right-color: transparent;}
}*/
```

```javascript
var tl = new TimelineMax({
  paused:true
});
// letter animation
tl.fromTo(".anim-typewriter", 8, {
  width: "0",
}, {
  width: "20.18em", /* same as CSS .line-1 width */
  ease:  SteppedEase.config(37)
}, 0);
// text cursor animation
tl.fromTo(".anim-typewriter", 0.5, {
  "border-right-color": "rgba(255,255,255,0.75)"
}, {
  "border-right-color": "rgba(255,255,255,0)",
  repeat: -1,
  ease:  SteppedEase.config(37)
}, 0);

tl.play();
```

I want the same animation, but not the same style as I already styled everything in css. You can utilize this example I made previously.