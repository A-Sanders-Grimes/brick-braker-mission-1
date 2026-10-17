# DOM Brick Breaker

Mission M1 · El Despertar del DOM — Web Development I.

## How to Play
Open `index.html` in your browser (or use Live Server). Use your keyboard's left and right arrows (or the A and D keys) to move the paddle and break all the bricks with the ball.

## AI Usage
I used Gemini CLI in VS Code as a pair programming assistant step by step.
Example of a real prompt used: "Propose 4 or 5 small steps to build a Brick Breaker game using DOM node manipulation with pure JavaScript; do not write complex code yet."
I verified each change by testing the ball movement and collision mechanics with `getBoundingClientRect` directly in the browser before accepting the next phase.
I wrote entirely by hand: the keyboard event listener logic (`keydown` / `keyup`) and the CSS layout structure.

## Autopsy
1. I used `document.createElement` to dynamically generate the brick grid from JavaScript rather than hardcoding them in the HTML. This allows scalable row/column adjustments and demonstrates core DOM node manipulation skills.
2. I used `getBoundingClientRect()` to calculate collision boxes between the ball and DOM elements instead of manual fixed coordinate math. I discarded fixed coordinate math because it becomes fragile if the interface layout shifts or resizes.
