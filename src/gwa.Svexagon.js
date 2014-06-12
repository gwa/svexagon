window.gwa = window.gwa || {};

/**
 * Wraps the image passed in an SVG polygon.
 * The resulting SVG has the current display width of the image
 * as the height of the resulting polygon.
 *
 * @class Svexagon
 * @namespace  gwa
 */
(function( ns, $ ) {

	/**
	 * [Svexagon description]
	 * @method Svexagon
	 * @constructor
	 * @param  {jQuery} jq
	 */
	ns.Svexagon = function( jq ) {

		var NUM_SIDES = 6;

		// declare private variables
		var
		/**
		 * @property {Object} _interface
		 * @private
		 */
		_interface = {},

		/**
		 * @property {jQuery} _jq
		 * @private
		 */
		_jq = jq,

		/**
		 * @property {Element} _svg
		 * @private
		 */
		_svg;

		function _init() {
			// get actual dimensions of image
			var img = new Image();
			img.onload = function() {
				_handleLoaded(img.src, img.width, img.height);
			}
			img.src = _jq.attr('src');
			_jq.css('visibility', 'hidden');
		}

		function _handleLoaded( src, w, h ) {
			// create svg and replace image
			_svg = _createSVG();
			_jq.replaceWith(_svg);

			// create:
			// - a defs element (holds the mask)
			// - a mask element
			// - a polygon for the mask shape
			// - a path to contain the polygon
			var defs = _createDefs(_svg),
				mask = _createMask(defs),
				poly = _createHexagonPolygon(800),
				path = document.createElementNS('http://www.w3.org/2000/svg', 'path'),
				dimensions,
				image;

			// add polygon to path's `d` attribute
			path.setAttribute('d', poly.getSVGPath());
			path.setAttribute('style', 'stroke:none; fill: #ffffff;');

			// add path directly to svg to get dimensions (Firefox)
			_svg.appendChild(path);
			dimensions = path.getBBox();

			// move path to mask element now we have the dimensions
			mask.appendChild(path);
			// move path to center of SVG
			// (polygon is centered on 0,0)
			path.setAttribute('transform', 'translate(' + dimensions.width / 2 + ' ' + dimensions.height / 2 + ')');

			// add the image the SVG, using the mask we created
			image = _createSVGImage(dimensions.width, dimensions.height, w, h, src, mask);
			_svg.appendChild(image);

			// set the SVG view box to the image dimensions
			_svg.setAttribute('viewBox', '0 0 ' + dimensions.width + ' ' + dimensions.height);
		}

		function _createSVG() {
			var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			return s;
		}

		function _createSVGImage( w, h, iw, ih, src, mask ) {
			var i = document.createElementNS('http://www.w3.org/2000/svg', 'image'),
				d = _calculateImageDimensions(w, h, iw, ih);
			i.setAttribute('x', d[0]);
			i.setAttribute('y', d[1]);
			i.setAttribute('width', d[2]);
			i.setAttribute('height', d[3]);
			i.setAttribute('id', 'theID');
			i.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', src);
			if (typeof mask !== 'undefined') {
				i.setAttribute('style', 'mask: url(#' + mask.getAttribute('id') + ');');
			}
			return i;
		}

		function _calculateImageDimensions( cw, ch, iw, ih ) {
			var containerratio = cw / ch,
				imageratio = iw / ih;
			if (containerratio > imageratio) {
				// container is wider than image
				return [
					0,
					-((cw / imageratio) - ch) / 2,
					cw,
					cw / imageratio
				];
			} else if (containerratio < imageratio) {
				// image is wider than container
				return [
					-((ch * imageratio) - cw) / 2,
					0,
					ch * imageratio,
					ch
				];
			} else {
				// image is wider than container
				return [
					0,
					0,
					cw,
					ch
				];
			}
		}

		function _createDefs( svg ) {
			var d = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
			svg.appendChild(d);
			return d;
		}

		function _createHexagonPolygon( w ) {
			var opp = w / 2;
				hyp = (1 / Math.sin(60 * Math.PI / 180)) * opp,
				rot = 30;

			return new gwa.NPolygon(NUM_SIDES, 0, 0, hyp, rot);
		}

		function _createMask( defs ) {
			var m = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
			m.setAttribute('x', 0);
			m.setAttribute('y', 0);
			m.setAttribute('id', 'svm_' + Math.round(Math.random() * 100000));
			defs.appendChild(m);
			return m;
		}

		_init();

		return _interface;

	};

}(window.gwa = window.gwa || {}, typeof(jQuery)=='function' ? jQuery : null));
