// fakesome {{ VERSION }} by Adrian Sieber (adriansieber.com)

// TODO: Convert to npm-module and use browserify
// TODO: Enhance fakesome with custom methods
// TODO: unique function


!function (window, document) {

	var tld = ['com', 'de', 'org', 'net'],
		syllables = [
			[
				'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
				'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'z', 'do'
			],
			['nu', 'ri', 'mi'],
			['an', 'el', 'us', 'mas']
		],
		lorem = "lorem ipsum dolor sit amet consetetur sadipscing elitr sed diam nonumy eirmod tempor" +
			"invidunt ut labore et dolore magna aliquyam erat sed diam voluptua at vero eos et accusam et" +
			"justo duo dolores et ea rebum stet clita kasd gubergren no sea takimata sanctus est lorem ipsum" +
			"dolor sit amet lorem ipsum dolor sit amet consetetur sadipscing elitr sed diam nonumy eirmod" +
			"tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua at vero eos et accusam" +
			"et justo duo dolores et ea rebum stet clita kasd gubergren no sea takimata sanctus est lorem ipsum" +
			"dolor sit amet",
		fn = {},
		fakesome


	function randomInt(min, max) {

		// (2^53/2) - 1
		if (min === undefined || min === null) min = -4503599627370495
		if (max === undefined || max === null) max = 4503599627370495

		min = Number(min)
		max = Number(max)

		if (typeof(min) !== "number")
			throw new TypeError("Min must be a number.")
		if (typeof(max) !== "number")
			throw new TypeError("Max must be a number.")

		if (!isInt(min))
			throw new TypeError("Min must be an Integer. Not " + min)

		if (!isInt(max))
			throw new TypeError("Max must be an Integer. Not " + max)

		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	function randomFloat(min, max, decimalPlaces) {

		if (min === undefined || min === null) min = -1e12
		if (max === undefined || max === null) max = 1e12


		if (decimalPlaces)
			return (Math.random() * (max - min) + min).toFixed(decimalPlaces)

		else
			return Math.random() * (max - min) + min
	}

	function isInt(number) {
		return Number(number) % 1 === 0
	}

	function decimalPlaces(number) {

		// http://stackoverflow.com/questions/9539513/is-there-a-reliable-way-in-javascript-to-obtain-the-number-of-decimal-places-of

		var s = "" + (+number),
			match = /(?:\.(\d+))?(?:[eE]([+\-]?\d+))?$/.exec(s)

		if (!match) return 0

		return Math.max(0, (match[1] == '0' ? 0 : (match[1] || '').length) - (match[2] || 0))
	}

	function randomColor(type, min, max) {

		var string = '',
			value

		min = Color(min) || Color('rgba(0,0,0,0)')
		max = Color(max) || Color('rgba(255,255,255,1)')
		type = type || 'rgb'
		value = Color()
			.rgb([
				randomInt(min.red(), max.red()),
				randomInt(min.green(), max.green()),
				randomInt(min.blue(), max.blue())
			])
			.alpha(randomFloat(min.alpha(), max.alpha()))


		if (type == 'rgb' || type == 'rgba')
			string = value.rgbaString()

		else
			throw new TypeError(type + 'is not allowed as a type value.')


		return string
	}

	function mergeObjects(obj1, obj2) {

		for (var key in obj2)
			if (obj2.hasOwnProperty(key))
				obj1[key] = (obj1[key] !== undefined) ? obj1[key] : obj2[key]

		return obj1
	}

	function shuffle(array) {

		var i, j, temp

		for (i = array.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1))

			temp = array[i]
			array[i] = array[j]
			array[j] = temp
		}

		return array
	}

	function typeCheck(value, expectedType) {

		if (value !== undefined) {

			var actualType = Array.isArray(value) ? 'array' : typeof value

			if (actualType != expectedType)
				throw new TypeError('The argument must be of type ' + expectedType + ' and not ' + actualType)
		}
	}

	function capitalize(text) {
		return text.charAt(0).toUpperCase() + text.substr(1)
	}

	function randomElement(array) {
		return array[Math.floor(Math.random() * array.length)]
	}

	function findFirst(array, test) {

		var result = null

		array.some(function (element, index) {

			var testResult = test(element)

			if (testResult)
				result = element

			return testResult
		})

		return result
	}


	fn = {

		boolean: function (chanceOfTrue) {

			chanceOfTrue = chanceOfTrue || 0.5

			if (typeof(chanceOfTrue) !== "number")
				throw new TypeError("ChanceOfTrue must be a number and not a " + typeof(chanceOfTrue))

			if (chanceOfTrue >= 0 && chanceOfTrue <= 1)
				return Boolean(Math.random() < chanceOfTrue)
			else
				throw new RangeError("Must be a number between 0 and 1")
		},

		character: function (min, max) {

			min = min || 32
			max = max || 1114112

			return String.fromCharCode(randomInt(max, min))
		},

		/*
		 config: function (object) {

		 var defaultValues = {
		 outputFormat: "JSON"
		 }

		 },
		 */

		//color: randomColor,

		data: function (schema) {

			for (var key in schema) {
				if (schema.hasOwnProperty(key)) {

					// If method exists evaluate
					if (fakesome[String(schema[key]).match(/^\w+/)[0]]) {
						try {
							schema[key] = eval('fakesome.' + schema[key])
						}
						catch (e) {
						}
					}
				}
			}

			return schema
		},

		/*
		 date: function (startDate, endDate) {

		 },
		 */

		float: function (minValue, maxValue, filter) {

			var randInt

			if (filter) {

				if (typeof(filter) != 'function')
					throw new TypeError('Filter must be a function.')

				do {
					randInt = randomFloat(minValue, maxValue)

				} while (!filter(randInt))

				return randInt
			}

			return randomFloat(minValue, maxValue)
		},

		img: function (conf) {

			var canvas = document.createElement('canvas'),
				ctx = canvas.getContext('2d'),
				defaults = {
					tag: false,
					width: 100,
					height: 100,
					elements: 100,
					bgColor: 'white',
					elementSize: 50,
					minColor: 'rgba(0,0,0,0)',
					maxColor: 'rgba(255,255,255,1)'
				},
				imgData,
				data,
				key,
				a,
				i


			conf = conf || {}

			conf = mergeObjects(conf, defaults)

			canvas.width = conf.width
			canvas.height = conf.height

			ctx.fillStyle = conf.bgColor
			ctx.fillRect(0, 0, conf.width, conf.width)

			for (a = 0; a < conf.elements; a++) {

				ctx.fillStyle = randomColor('rgba', conf.minColor, conf.maxColor)
				ctx.fillRect(
					randomInt(-conf.elementSize, conf.width),
					randomInt(-conf.elementSize, conf.height),
					randomInt(0, conf.elementSize),
					randomInt(0, conf.elementSize)
				)
			}

			function grayscale(imageData) {

				var d = imageData.data, r, g, b, v

				for (i = 0; i < d.length; i += 4) {

					r = d[i]
					g = d[i + 1]
					b = d[i + 2]

					d[i] = d[i + 1] = d[i + 2] = (0.2126 * r) + (0.7152 * g) + (0.0722 * b)
				}

				return imageData
			}

			function blackWhite(imageData) {

				var d = imageData.data,
					threshold = 0.7,
					max = 0,
					min = 255,
					values = [],
					r, g, b, v

				for (i = 0; i < d.length; i += 4) {

					v = (0.2126 * d[i]) + (0.7152 * d[i + 1]) + (0.0722 * d[i + 2])

					if (v > max) max = v
					if (v < min) min = v

					values[i] = v
				}

				threshold = ((min + max) / 2)

				for (i = 0; i < d.length; i += 4) {

					d[i] = d[i + 1] = d[i + 2] = (values[i] >= threshold) ? 255 : 0
				}

				return imageData
			}

			function setText() {

				var textString,
					fontSize,
					textWidth,
					textHeight,
					x,
					y

				textString = (conf.text === true) ? conf.width + '×' + conf.height : conf.text

				fontSize = Math.min((conf.width / textString.length), conf.height * 0.8),

					// TODO: Check background color (histogram) and choose text color accordingly
					ctx.fillStyle = 'rgba(0,0,0,0.7'
				ctx.font = 'bold ' + fontSize + "px Arial"

				textWidth = ctx.measureText(textString).width

				x = (conf.width - textWidth) / 2
				y = conf.height / 2

				ctx.textBaseline = "middle"
				ctx.fillText(textString, x, y)
			}


			imgData = ctx.getImageData(0, 0, conf.width, conf.height);

			if (conf.filter) {

				if (conf.filter === 'grayscale')
					ctx.putImageData(grayscale(imgData), 0, 0)

				else if (conf.filter === 'bw')
					ctx.putImageData(blackWhite(imgData), 0, 0)
			}

			if (conf.text) setText()


			data = canvas.toDataURL()

			if (conf.tag)
				return '<img src="' + data + '" alt="Placeholder Image" title="Placeholder Image">'
			else
				return data
		},

		imgURL: function (conf) {

			var defaults = {
					width: 100,
					height: 100,
					grayscale: false,
					site: 'lorempixel.com',
					number: false,
					format: 'png'
				},
				url = 'http://'

			conf = conf || {}

			conf = mergeObjects(conf, defaults)

			// TODO: http://hhhhold.com/, http://pixelholdr.com/, http://placecreature.com/


			switch (conf.site) {

				case 'lorempixel.com':
					url += 'lorempixel.com'
					url += conf.grayscale ? '/g' : ''
					url += conf.width ? '/' + conf.width : ''
					url += conf.height ? '/' + conf.height : ''
					url += conf.tag ? '/' + conf.tag : ''
					url += conf.number ? '/' + conf.number : ''
					url += conf.text ? '/' + conf.text : ''
					break

				case 'placehold.it':
					url += 'placehold.it'
					url += conf.width ? '/' + conf.width : ''
					url += conf.height ? 'x' + conf.height : ''
					url += conf.bgColor ? '/' + Color(conf.bgColor).rgbString() : ''
					url += conf.textColor ? '/' + Color(conf.textColor).rgbString() : ''
					url += conf.format ? '.' + conf.format : ''
					url += conf.text ? '&text=' + encodeURIComponent(conf.text) : ''
					break

				case 'flickholdr.com':
					url += 'flickholdr.com'
					url += conf.width ? '/' + conf.width : ''
					url += conf.height ? '/' + conf.height : ''
					url += conf.tag ? '/' + conf.tag : ''
					url += conf.number ? '/' + conf.number : ''
					url += conf.text ? '/' + conf.text : ''
					url += conf.grayscale ? '/bw' : ''
					break

				case 'placekitten.com':
					url += 'placekitten.com'
					url += conf.grayscale ? '/g' : ''
					url += conf.width ? '/' + conf.width : ''
					url += conf.height ? '/' + conf.height : ''
					break

				default:
					throw new Error(conf.site + ' is no valid image hoster.')
			}

			return url
		},

		integer: function (minValue, maxValue, filter) {

			var randInt

			if (filter) {

				if (typeof(filter) != 'function')
					throw new TypeError('Filter must be a function.')

				do {
					randInt = randomInt(minValue, maxValue)

				} while (!filter(randInt))

				return randInt
			}

			return randomInt(minValue, maxValue)
		},

		/*
		 name: function () {
		 var name = ''

		 syllables.forEach(function (syl) {
		 name += syl[randomNumber(syl.length)]
		 })

		 return name
		 },
		 */

		object: function (scheme, number) {

			var obj = {}

			for (var key in scheme) {
				if (scheme.hasOwnProperty(key)) {


				}
			}

		},

		/*
		 matrix: function (width, height, valueSet) {

		 var a,
		 i,
		 matrix = []

		 valueSet = valueSet || [0, 1]

		 for (i = 1; i <= height; i++) {
		 for (a = 1; a <= width; a++) {

		 matrix.push(valueSet[randomNumber(valueSet.length - 1)])
		 }
		 }

		 return matrix

		 },
		 */

		sentence: function (min, max) {

			typeCheck(min, 'number')
			typeCheck(max, 'number')

			min = min || 5
			max = max || 25

			return capitalize(
				shuffle(lorem.split(" "))
					.slice(0, randomInt(min, max))
					.join(" ")
			) + "."
		},

		sentences: function (quantity, min, max) {

			var sentences = [],
				i

			typeCheck(quantity, 'number')
			typeCheck(min, 'number')
			typeCheck(max, 'number')

			quantity = quantity || 1
			min = min || 5
			max = max || 25


			for (i = 0; i < quantity; i++) {
				sentences.push(
					capitalize(
						shuffle(lorem.split(" "))
							.slice(0, randomInt(min, max))
							.join(" ")
					)
				)
			}

			return sentences.join(". ") + "."
		},

		string: function (alphabet, length) {

			var string = [],
				i

			typeCheck(alphabet, 'array')
			typeCheck(length, 'number')

			alphabet = alphabet || ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
				'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
			length = length || 10

			for (i = 0; i < length; i++)
				string.push(randomElement(alphabet))

			return string.join('')
		},

		text: function (quantity) {

			typeCheck(quantity, 'number')

			quantity = quantity || 100

			return lorem
				.split("")
				.slice(0, quantity)
				.join("")
		},

		/*
		 url: function () {
		 return this.name() + '.com'
		 },
		 */

		word: function (minChars, maxChars) {

			var word,
				test

			typeCheck(minChars, 'number')
			typeCheck(maxChars, 'number')

			minChars = minChars || 1
			maxChars = maxChars || 20

			test = function (element) {
				return element.length >= minChars && element.length <= maxChars
			}


			word = findFirst(shuffle(lorem.split(' ')), test)

			if (word)
				return word
			else
				throw new RangeError('No word with between ' + minChars + ' and ' + maxChars + ' characters available.')

		},

		words: function (quantity, minChars, maxChars) {

			var words = [],
				i

			typeCheck(quantity, 'number')
			typeCheck(minChars, 'number')
			typeCheck(maxChars, 'number')

			quantity = quantity || 10

			for (i = 0; i < quantity; i++)
				words.push(fn.word(minChars, maxChars))

			return words.join(' ')
		}
	}

	fakesome = {}

	for (var key in fn)
		if (fn.hasOwnProperty(key))
			!function (key) {
				fakesome[key] = fn[key]
			}(key)

	fakesome.maybe = function (chanceOfReturn) {

		var returnObject = {}

		chanceOfReturn = chanceOfReturn || 0.5

		for (var key in fn) {
			if (fn.hasOwnProperty(key)) {
				!function (key) {

					returnObject[key] = function () {

						var args = Array.prototype.slice.call(arguments),
							array = []

						if (Math.random() < chanceOfReturn)
							return fn[key].apply(null, args)
						else
							return null
					}
				}(key)
			}
		}

		return returnObject
	}

	fakesome.array = function (number) {

		var returnObject = {}

		number = number || 10

		for (var key in fn) {
			if (fn.hasOwnProperty(key)) {
				!function (key) {

					returnObject[key] = function () {

						var args = Array.prototype.slice.call(arguments),
							array = []

						for (var i = 0; i < number; i++) {
							array.push(fn[key].apply(null, args))
						}

						return array
					}
				}(key)
			}
		}

		return returnObject
	}

	fakesome.fn = fn


	if (typeof module === "object" && module && typeof module.exports === "object")
		module.exports = fakesome

	else if (typeof define === "function" && define.amd)
		define("fakesome", [], function () {
			return fakesome
		})

	if (typeof window === "object" && typeof window.document === "object") {
		window.fakesome = fakesome
	}

}(window, document)
