XML2Js Converter
================

Request a XML file then traverse it recursively to build an Object.

How to use
----------
	
	The XML2Object request a XML file which is the only argument it receives.
	On it's 'complete' event, it pass an obejct containing the text, xml and xmlObj of the response from the request made.
	
	Response object structure:
	{ xmlObj, text, xml }
	
	new XML2Object("map.xml").addEvent('complete', function(result) {
		
		console.log("Our beloved resulting object got from the xml is:");
		console.log(result.xmlObj);
		
		console.log("The response plain text is:");
		console.log(result.text);
		
		console.log("The xml response is:");
		console.log(result.xml);
		
	});
	
	If you need to convert several files, you can use it's getRequest method, which is the one that makes the request.

Resulting Object Structure
--------------------------

It follows the W3C guidelines at http://www.w3schools.com/dom/dom_nodetree.asp
to convert the xml documents.

As an example, a XML file with this content:

	<Map container="map_canvas"
		lat="10.98"
		lng="-74.79"
		zoom="10"
		streetViewControl="false"
		>
		<Marker
			title="Marker 1"
			lat="7.6" lng="-74"
			content="Marker 1 content"       
		>Marker 1 node Value</Marker>
		<Marker
			title="Marker 2"
			lat="7.2" lng="-74"
			content="Marker 2 content"
		/>
	</Map>

Will result in an Object this way:

	Object: {
		attributes: {
			container: "map_canvas",
			lat: "10.98",
			lng: "-74.79",
			streetViewControl: "false",
			zoom: "10"
		},
		name: "Map",
		value: "",
		childNodes: {
			Array[
			0: {
				attributes: {
					title: "Marker 1",
					content: "Marker 1 content",
					lat: "7.6",
					lng: "-74"
				},
				name: "Marker",
			   value: "Marker 1 node Value",
				childNodes: Array[]
			},
			1: {
				attributes: {
					title: "Marker 2",
					content: "Marker 2 content",
					lat: "7.2",
					lng: "-74"
				},
				name: "Marker",
				value: "",
				childNodes: Array[]
			}]
		}
	}

Notice that Marker 1 has content and Marker 2 doesn't, still, the latter will have a value of "".

Since it traverse the XML DOM node tree recursively, it doesn't matter how deep and complex your structure is.

As an example, this class is very usefull with another script which extends Google Maps Api classes, so a really fast setup can be done since a map, markers and else, can be written in a XML file, then converted to Object, and build the map in a more automatic way.
