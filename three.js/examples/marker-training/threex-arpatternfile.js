var THREEx = THREEx || {}

THREEx.ArPatternFile = {}

THREEx.ArPatternFile.toCanvas = function(patternFileString, onComplete){
	console.assert(false, 'not yet implemented')
}

//////////////////////////////////////////////////////////////////////////////
//		function to encode image
//////////////////////////////////////////////////////////////////////////////

THREEx.ArPatternFile.encodeImageURL = function(imageURL, onComplete){
	var image = new Image;
	image.onload = function(){
		var patternFileString = THREEx.ArPatternFile.encodeImage(image)
		onComplete(patternFileString)
	}
	image.src = imageURL;
}

THREEx.ArPatternFile.encodeImage = function(image){
	// copy image on canvas
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d')
	canvas.width = 16;
	canvas.height = 16;

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.translate(canvas.width / 2, canvas.height / 2);
	context.drawImage(image, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

	// get imageData
	var imageData = context.getImageData(0, 0, canvas.width, canvas.height)
	var rotationIndex, channelIndex, x, y;

	// pre generate arrays
	var patternFileArray = new Array(4)
	for(rotationIndex=0; rotationIndex < 4; rotationIndex++){
		patternFileArray[rotationIndex] = new Array(3) // 3 channels
		for(channelIndex=0; channelIndex < 3; channelIndex++){
			patternFileArray[rotationIndex][channelIndex] = new Array(imageData.height)
			for(y = 0; y < imageData.height; y++){
				patternFileArray[rotationIndex][channelIndex][y] = new Array(imageData.width)
			}
		}
	}

	// NOTE bgr order and not rgb!!! so from 2 to 0
	for(var channelOffset = 2; channelOffset >= 0; channelOffset--){
		channelIndex = 2-channelOffset

		for(y = 0; y < imageData.height; y++){
			for(x = 0; x < imageData.width; x++){
				var offset = (y * imageData.width * 4) + (x * 4) + channelOffset
				var value = String(imageData.data[offset]).padStart(3)

				// 0
				patternFileArray[0][channelIndex][y][x] = value
				// -90
				patternFileArray[1][channelIndex][imageData.width - 1 - x][y] = value
				// -180
				patternFileArray[2][channelIndex][imageData.width - 1 - y][imageData.width - 1 - x] = value
				// -270
				patternFileArray[3][channelIndex][x][imageData.width - 1 - y] = value
			}
		}
	}

	return patternFileArray.map(function(r){
		return r.map(function(c){
			return c.map(function(l){
				return l.join(' ')
			}).join('\n') // line end
		}).join('\n') // channel end
	}).join('\n\n') // rotation block end
}

//////////////////////////////////////////////////////////////////////////////
//		trigger download
//////////////////////////////////////////////////////////////////////////////

THREEx.ArPatternFile.triggerDownload =  function(patternFileString, fileName = 'pattern-marker.patt'){
	// tech from https://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
	var domElement = window.document.createElement('a');
	domElement.href = window.URL.createObjectURL(new Blob([patternFileString], {type: 'text/plain'}));
	domElement.download = fileName;
	document.body.appendChild(domElement)
	domElement.click();
	document.body.removeChild(domElement)
}

THREEx.ArPatternFile.buildFullMarker =  function(innerImageURL, pattRatio, size, color, onComplete){
	var whiteMargin = 0.1
	var blackMargin = (1 - 2 * whiteMargin) * ((1-pattRatio)/2)
	// var blackMargin = 0.2

	var innerMargin = whiteMargin + blackMargin

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d')
	canvas.width = canvas.height = size

	context.fillStyle = 'white';
	context.fillRect(0,0,canvas.width, canvas.height)

	// copy image on canvas
	context.fillStyle = color;
	context.fillRect(
		whiteMargin * canvas.width,
		whiteMargin * canvas.height,
		canvas.width * (1-2*whiteMargin),
		canvas.height * (1-2*whiteMargin)
	);

	// clear the area for innerImage (in case of transparent image)
	context.fillStyle = 'white';
	context.fillRect(
		innerMargin * canvas.width,
		innerMargin * canvas.height,
		canvas.width * (1-2*innerMargin),
		canvas.height * (1-2*innerMargin)
	);


	// display innerImage in the middle
	var innerImage = document.createElement('img')
	innerImage.addEventListener('load', function(){
		// draw innerImage
		context.drawImage(innerImage,
			innerMargin * canvas.width,
			innerMargin * canvas.height,
			canvas.width * (1-2*innerMargin),
			canvas.height * (1-2*innerMargin)
		);

		var imageUrl = canvas.toDataURL()
		onComplete(imageUrl)
	})
	innerImage.src = innerImageURL
}
