const kitchentales = (function () {
	const [ WIDTH, HEIGHT ] = [ 1920, 1080 ];
	function makeVideoSlide(o) {
		const slide = document.createElement("div");
		slide.setAttribute("id", o.name);
		slide.setAttribute("class", "step");
		[ "x", "y", "rotate", "scale" ].forEach(k => {
			if (k in o) {
				if (k === "x") {
					slide.dataset[k] = o[k] - (WIDTH / 2);
				} else if (k === "y") {
					slide.dataset[k] = o[k] - (HEIGHT / 2);
				} else {
					slide.dataset[k] = o[k];
				}
			}
		});

		const video = document.createElement("video-js");
		const videoAttrs = {
			id: "video-" + o.name,
			"class": "video-js clip-circle",
			preload: "auto",
			autoplay: true,
			loop: true,
			muted: true,
		};
		for ([attr, val] of Object.entries(videoAttrs)) {
			video.setAttribute(attr, val === true ? attr : val);
		}
		video.dataset.setup = "{}";

		const source = document.createElement("source");
		source.setAttribute("src", "hls/kitchen-" + o.name + "/main.m3u8");
		source.setAttribute("type", "application/vnd.apple.mpegurl");

		video.appendChild(source);
		slide.appendChild(video);
		return slide;
	}

	function appendVideoSlideAfter(after, o) {
		const afterEl = document.getElementById(after);
		afterEl.parentNode.insertBefore(makeVideoSlide(o), afterEl.nextSibling);
	}

	return {
		appendVideoSlideAfter,
		makeVideoSlide,
	};
})();
