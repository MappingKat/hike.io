"use strict";

angular.module("hikeio").
	factory("mapTooltipFactory", ["$window", function($window) {

		var MapTooltip = function(marker) {
			this.hikeData = marker.hikeData;
			this.marker = marker;
			this.map = marker.getMap();
			this.setMap(this.map);
		};

		MapTooltip.prototype = new google.maps.OverlayView();

		MapTooltip.prototype.onAdd = function() {
			if (Modernizr.touch) {
				this.div = $(".touch-tooltip").clone();
			} else {
				this.div = $(".tooltip").clone();
			}
			this.getPanes().floatShadow.appendChild(this.div[0]);
		};

		MapTooltip.prototype.draw = function() {
			this.div.find(".name").text(this.hikeData.name);
			var buffer = 10;
			var width = this.div.outerWidth();
			var height = this.div.outerHeight();

			var overlayProjection = this.getProjection();
			var markerPosition = overlayProjection.fromLatLngToContainerPixel(this.marker.getPosition());

			// The default location of the tooltip is anchored to the bottom-right of the marker. If that
			// location would render the tooltip off the screen, relocate it.
			var containerOffset = $(this.map.getDiv()).offset();
			var tooltipOffset = {
				top: containerOffset.top + markerPosition.y + buffer,
				left: containerOffset.left + markerPosition.x + buffer
			};

			if (tooltipOffset.top + height + buffer > $($window.document).height()) {
				tooltipOffset.top = tooltipOffset.top - height - buffer * 2;
			}

			if (tooltipOffset.left + width + buffer > $($window.document).width()) {
				tooltipOffset.left = markerPosition.x - width - buffer;
			}
			if (Modernizr.touch) {
				this.div.attr("href", "/hikes/" + this.hikeData.string_id);
			}
			this.div.css("display", "block");
			this.div.offset(tooltipOffset);
			this.div.css("opacity", "1");
		};

		MapTooltip.prototype.onRemove = function() {
			this.div.remove();
			this.div = null;
		};

		MapTooltip.prototype.destroy = function() {
			this.setMap(null);
		};

		var mapTooltipService = {};
		mapTooltipService.create = function(marker) {
			return new MapTooltip(marker);
		};
		return mapTooltipService;
	}]);
