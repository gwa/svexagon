window.gwa = window.gwa || {};

/**
 * @class Svexagon
 * @namespace  gwa
 * @constructor
 * @param  {jQuery} jq
 */
(function( ns, $ ) {

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
			var img = new Image();
			img.onload = function() {
				_handleLoaded(img.src, img.width, img.height);
			}
			img.src = jq.attr('src');
		}

		function _handleLoaded( src, w, h ) {
			_svg = _createSVG();
			_jq.replaceWith(_svg);

			var defs = _createDefs(_svg);

			var poly = _createHexagonPolygon(800);

			var mask = _createMask(defs);
			var s = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			s.setAttribute('d', poly.getSVGPath());
			s.setAttribute('style', 'stroke:none; fill: #ffffff;');
			mask.appendChild(s);
			var d = s.getBBox();
			s.setAttribute('transform', 'translate(' + d.width / 2 + ' ' + d.height / 2 + ')');

			var image = _createSVGImage(d.width, d.height, w, h, src, mask);
			_svg.appendChild(image);

			// set view box for responsive
			_svg.setAttribute('viewBox', '0 0 ' + d.width + ' ' + d.height);

		}

		function _createSVG( w, h ) {
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
				hyp = (1 / Math.sin(60 * Math.PI / 180)) * opp;

			return new gwa.NPolygon(NUM_SIDES, 0, 0, hyp, 30);
		}

		function _createMask( defs ) {
			var m = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
			m.setAttribute('x', 0);
			m.setAttribute('y', 0);
			m.setAttribute('id', 'mymask');
			defs.appendChild(m);
			return m;
		}

		_init();

		return _interface;

	};

}(window.gwa = window.gwa || {}, typeof(jQuery)=='function' ? jQuery : null));
