"use strict";

// https://spicyyoghurt.com/tutorials/html5-javascript-game-development/create-a-proper-game-loop-with-requestanimationframe

class Animator {
    //=========================================================
    //                      Constructor
    //=========================================================
    constructor(canvas) {
        this._canvas = canvas;
        this._context = null;
        this._sprites = [];
        this._countdown = null;
        this._running = false;
    }

    //=========================================================
    //                   Object attributes
    //=========================================================
    get canvas() {
        return this._canvas;
    }

    get ctx() {
        if (this._context == null) {
            this._context = this.canvas.getContext('2d');
        }

        return this._context;
    }

    //=========================================================
    //                      Collections
    //=========================================================
    add() {
        var self = this;

        Array.from(arguments).forEach(
            function(sprite) {
                for (var i=0; i < self._sprites.length; ++i) {
                    if (self._sprites[i].id == sprite.id) {
                        console.log(sprite.constructor.name + " == " + self._sprites[i].constructor.name);
                        return;
                    }
                }

                console.log("Adding " + sprite.constructor.name + " " + sprite.id);
                self._sprites.push(sprite);
                sprite.animator = self;
            }
        );
    }

    //=========================================================
    //                       Timers
    //=========================================================
    start(iterations) {
        this._countdown = iterations;
        this._running = true;
        this.update();
        console.log("Animation has started"); //DEBUG
    }

    stop() {
        this._running = false;
    }

    update() {
        if (this._countdown) {
            --this._countdown;
        }

        if (this._countdown == 0) {
            this._running = false;
        }

        if (! this._running) {
            console.log("Animation has stopped");
            return;
        }

        var ctx = this.ctx;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.beginPath();

        this._sprites.forEach(
            function(sprite) {
                sprite.update();
            }
        );

        ctx.closePath();

        var self = this;

        window.requestAnimationFrame(
            function() {
                self.update();
            },
        );
    }
}

class Sprite {
    static getNextId() {
        var newid = Sprite._id_source || 0;
        Sprite._id_source = newid + 1;
        return newid;
    }

    //=========================================================
    //                      Constructor
    //=========================================================
    constructor(x, y) {
        this._animator = null;
        this._id = this.constructor.getNextId();
        this._x = x || 0;
        this._y = y || 0;
        this._delta_x = 0;
        this._delta_y = 0;
    }

    //=========================================================
    //                   Object attributes
    //=========================================================
    get id() {
        return this._id;
    }

    get animator() {
        return this._animator;
    }

    set animator(animator) {
        this._animator = animator;
    }

    get ctx() {
        return this.animator.ctx;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get delta_x() {
        return this._delta_x || 0.0;
    }

    set delta_x(rate) {
        this._delta_x = rate || 0.0;
    }

    get delta_y() {
        return this._delta_y || 0.0;
    }

    set delta_y(rate) {
        this._delta_y = rate || 0.0;
    }

    //=========================================================
    //                      Animation
    //=========================================================
    update() {
        this._x += this._delta_x;
        this._y += this._delta_y;
        this.draw();
    }

    //=========================================================
    //                      Rendering
    //=========================================================
    draw() {
        this.ctx.fillStyle = "#454500";
        this.ctx.fillRect(100, 50, 200, 175);
    }
}

class Box extends Sprite {
    //=========================================================
    //                      Constructor
    //=========================================================
    constructor(x, y, width, height) {
        super(x, y);
        this._width = width || 20;
        this._height = height || 20;
    }

    //=========================================================
    //                   Object attributes
    //=========================================================
    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    //=========================================================
    //                      Rendering
    //=========================================================
    draw() {
//         console.log("DRAW " + this.constructor.name);
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Circle extends Sprite {
    //=========================================================
    //                      Constructor
    //=========================================================
    constructor(x, y, radius) {
        super(x, y);
        this._radius = radius || 20;
    }

    //=========================================================
    //                   Object attributes
    //=========================================================
    get radius() {
        return this._radius;
    }

    get diameter() {
        return this.radius * 2;
    }

    get width() {
        return this.diameter;
    }

    get height() {
        return this.diameter;
    }

    //=========================================================
    //                      Rendering
    //=========================================================
    draw() {
        var ctx = this.ctx;

        console.log("DRAW " + this.constructor.name);
        ctx.fillStyle = "aqua";
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

window.Sprites = {
    Animator: Animator,
    Circle: Circle,
    Box: Box,
};