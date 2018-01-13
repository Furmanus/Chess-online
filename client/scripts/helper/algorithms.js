/**@author Lukasz Lach*/

const Utility = {

    /**
     * Method which executes provided callback function on every point of bresenham line between points (x1, y1) and (x2, y2).
     * @param {number}      x1          Horizontal(row) coordinate of starting point.
     * @param {number}      y1          Vertical(column) coordinate of starting point.
     * @param {number}      x2          Horizontal(row) coordinate of target point.
     * @param {number}      y2          Vertical(column) coordinate of target point.
     * @param {number}      delay       Delay in executing each step of algorithms, in miliseconds.
     * @param {function}    callback    Callback function to execute on every point of bresenham line.
     */
    bresenham: function(x1, y1, x2, y2, delay, callback){

        x1 = Math.floor(x1);
        y1 = Math.floor(y1);
        x2 = Math.floor(x2);
        y2 = Math.floor(y2);

        let deltaX = Math.abs(x2 - x1);
        let deltaY = Math.abs(y2 - y1);

        let sx = (x1 < x2) ? 1 : -1;
        let sy = (y1 < y2) ? 1 : -1;

        let err = deltaX - deltaY;

        let e2 = 2 * err;

        callback(x1, y1);

        if (x1 === x2 && y1 === y2) {

            return;
        }

        if (e2 > -deltaY) {

            err -= deltaY;
            x1 += sx;
        }

        if (e2 < deltaX) {

            err += deltaX;
            y1 += sy;
        }

        window.setTimeout(() => {this.bresenham(x1, y1, x2, y2, delay, callback)}, delay);
    }
};

export default Utility;