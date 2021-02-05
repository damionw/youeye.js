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
    get block_width() {
        return 10;
    }

    get block_height() {
        return 10;
    }

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
        var self = this;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.beginPath();

        this._sprites.forEach(
            function(sprite) {
                sprite.update();
            }
        );

        ctx.closePath();

        this.detect_collisions();

        window.requestAnimationFrame(
            function() {
                self.update();
            },
        );
    }

    //=========================================================
    //                    Collision Detection
    //=========================================================
    get collision_pairs() {
        function* fetchCollisionPairs(sprites) {
            var sprites = Array.from(sprites);
            var length = sprites.length;

            for (var start=0; start < length - 1; ++start) {
                for (var i=start + 1; i < length; ++i) {
                    yield [sprites[start], sprites[i]];
                }
            }
        }

        return Array.from(fetchCollisionPairs(this._sprites));
    }

    detect_collisions() {
        var pairs = this.collision_pairs;

        for (var i=0; i < pairs.length; ++i) {
            var sprite1 = pairs[i][0];
            var sprite2 = pairs[i][1];

            var regions1 = sprite1.collision_blocks;
            var regions2 = sprite2.collision_blocks;
            var collision = false;

            for (var x=0; x < regions1.length && ! collision; ++x) {
                var rect1 = regions1[x];

                for (var y=0; y < regions2.length && ! collision; ++y) {
                    var rect2 = regions2[y];

                    if (this.overlappingRegions(rect1, rect2)) {
                        collision=true
                    }
                }
            }

            if (collision) {
                sprite1.collisionWith(sprite2);
                sprite2.collisionWith(sprite1);
            }
        }
    }

    overlappingRegions(rect1, rect2) {
        var isin = false;

        for (var i=0; i < rect1.length && ! isin; ++i) {
            var x = rect1[i][0];
            var y = rect1[i][1];

            isin = (
                (x >= rect2[0][0] && y >= rect2[0][1]) &&
                (x <= rect2[1][0] && y >= rect2[1][1]) &&
                (x >= rect2[2][0] && y <= rect2[2][1]) &&
                (x <= rect2[3][0] && y <= rect2[3][1])
            );
        }

        return isin;
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
    get collision_blocks() {
        return [];
    }

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
    //                 Collision Detection
    //=========================================================
    get collision_blocks() {
        // FIXME: This is really just for Box
        var blockdef = this.animator.detection_block;
        var x_size = this.animator.block_width || 10;
        var y_size = this.animator.block_height || 10;
        var x = this.x;
        var y = this.y;
        var width = this.width;
        var height = this.height;
        var results = [];

        for (var j=0; j < height; j += y_size) {
            for (var i=0; i < width; i += x_size) {
                var coords = [
                    [i + x, j + y],
                    [i + x + x_size, j + y],
                    [i + x + x_size, j + y + y_size],
                    [i + x + x_size, j + y + y_size]
                ];

                results.push(coords);
            }
        }

        return results;
    }

    collisionWith(sprite) {
        var dx = this.delta_x;
        var dy = this.delta_y;
        this.delta_x = dy;
        this.delta_y = dx;
        this.update();
        console.log("COLLISION: " + this.constructor.name + " " + this.id + " with " + sprite.id + " at " + this.x + "," + this.y);
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