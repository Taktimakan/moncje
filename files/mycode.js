var map = L.map('map').setView([45.5451, -73.7150], 11);

var cloudmade = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



		// control that shows state info on hover
		var info = L.control();

		info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};

		info.update = function (props) {
			this._div.innerHTML = '<h4> CJE</h4>' +  (props ?
				'<p>'  + props.NOM_CJE + '- Total Population:' + props.POP_TOTALE + '<br />' +'Y16_35ANS: '+ props.Y16_35ANS +'<br />'      +"HOMMES: "+props.HOMMES +'<br />'+  "FEMMES: "+props.FEMMES +'<br />'+ "Y16_19ANS: "+props.Y16_19ANS +'<br />'+ "Y20_24ANS: "+props.Y20_24ANS +'<br />'+ "Y25_29ANS: "+props.Y25_29ANS +'<br />'+ "Y30_34ANS: "+props.Y30_34ANS +'<br />'+ "Y35ANS: "+props.Y35ANS+'<br />'+ "Address: "+ '<br />'+'<br />'+ "Website: "+ '<br />'+'</p>': 'Hover over a CJE');   
		};

		info.addTo(map);


		// get color depending on population density value
		function getColor(d) {
			return d > 140000 ? '#800026' :
			       d > 120000  ? '#BD0026' :
			       d > 100000  ? '#E31A1C' :
			       d > 80000  ? '#FC4E2A' :
			       d > 60000   ? '#FD8D3C' :
			       d > 40000   ? '#FEB24C' :
			       d > 20000   ? '#FED916' :
				   d > 10000   ? '#FEB14C' :
			       d > 0   ? '#FED976' :
			                '#FFEDA0';
		}

		function style(feature) {
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.6,
				fillColor: getColor(feature.properties.POP_TOTALE)
			};
		}

		function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 5,
				color: '#666',
				dashArray: '',
				fillOpacity: 0.6
			});

			if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
			}

			info.update(layer.feature.properties);
		}

		var geojson;

		function resetHighlight(e) {
			geojson.resetStyle(e.target);
			info.update();
		}

		function zoomToFeature(e) {
			map.fitBounds(e.target.getBounds());
		}

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}

		geojson = L.geoJson(cmaData, {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(map);

		map.attributionControl.addAttribution('Montreal_CJE   Ablajan &copy; <a href="http://infogeocom.com/">Carrefour Jeunesse-Emploi de CDN </a>');


		var legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'info legend'),
				grades = [0,10000, 20000, 40000, 60000, 80000, 100000, 120000, 140000],
				labels = [],
				from, to;

			for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + getColor(from + 1)  + '"></i> ' +
					from + (to ? '&ndash;' + to : '+')+'');
			}

			div.innerHTML = labels.join('<br>');
			return div;
		};

		legend.addTo(map);

