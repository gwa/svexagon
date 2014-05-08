window.gwa = window.gwa || {};

/**
 * @class NPolygon
 * @namespace  gwa
 */
(function( ns ) {

	/**
	 * @method NPolygon
	 * @constructor
	 * @param  {Number} nsides
	 * @param  {Number} cx
	 * @param  {Number} cy
	 * @param  {Number} radius
	 * @param  {Number} rotation
	 */
	ns.NPolygon = function( nsides, cx, cy, radius, rotation ) {

		// declare private variables
		var
		/**
		 * @property {Object} _interface
		 * @private
		 */
		_interface = {},

		_points,

		_width,

		_height;

		function _getPoints() {
			if (typeof _points === 'undefined') {
				var
					i,
					px,
					py,
					points = [],
					theta = typeof rotation !== 'undefined' ? rotation * Math.PI / 180 : 0;

				for (i = 0; i < nsides; i++) {
					_calculatePoint(points, i, nsides, theta, radius, cx, cy, 0.1 );
				}
				_points = points;
				_width = _getWidth(points);
				_height = _getHeight(points);
			}
			return _points;
		}

		function _calculatePoint( points, side, nsides, theta, radius, cx, cy, rounding )
		{
			var prev, prevp, currentp, next, nextp, diffx, diffy;

			prev = side > 0 ? side - 1 : nsides - 1;
			prevp = {
				x: radius * Math.cos(2 * Math.PI * prev / nsides + theta) + cx,
				y: radius * Math.sin(2 * Math.PI * prev / nsides + theta) + cy
			};
			current = {
				x: radius * Math.cos(2 * Math.PI * side / nsides + theta) + cx,
				y: radius * Math.sin(2 * Math.PI * side / nsides + theta) + cy
			};
			next = side == nsides - 1 ? 0 : side + 1;
			nextp = {
				x: radius * Math.cos(2 * Math.PI * next / nsides + theta) + cx,
				y: radius * Math.sin(2 * Math.PI * next / nsides + theta) + cy
			};

			diffx = prevp.x - current.x;
			diffy = prevp.y - current.y;

			var cmd = side == 0 ? 'M' : 'L';

			points.push(
				cmd +
				Math.round(current.x + (diffx * rounding)) +
				' ' +
				Math.round(current.y + (diffy * rounding))
			);

			diffx = nextp.x - current.x;
			diffy = nextp.y - current.y;

			points.push(
				'Q' +
				Math.round(current.x) +
				' ' +
				Math.round(current.y) +
				' ' +
				Math.round(current.x + (diffx * rounding)) +
				' ' +
				Math.round(current.y + (diffy * rounding))
			);
		}

		function _getWidth( points ) {
			return _getDiff(points, 0);
		}

		function _getHeight( points ) {
			return _getDiff(points, 1);
		}

		function _getDiff( arr, index ) {
			var a, min = arr[0][index], max = arr[0][index];
			for (a in arr) {
				min = Math.min(arr[a][index], min);
				max = Math.max(arr[a][index], max);
			}
			return max - min;
		}

		_interface.getSVGPath = function () {
			return _getPoints().join(' ') + ' Z';
		};

		_interface.getSVGPolygonPoints = function () {
			var a, p = [], points = _getPoints();
			for (a in points) {
				p.push(points[a][0] + ',' + points[a][1]);
			}
			return points.join(' ');
		};

		_interface.getWidth = function () {
			return _width;
		};

		_interface.getHeight = function () {
			return _height;
		};

		return _interface;

	};

}(window.gwa = window.gwa || {}));
