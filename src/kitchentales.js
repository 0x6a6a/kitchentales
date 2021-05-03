const kitchentales = (function () {
	const [ WIDTH, HEIGHT ] = [ 1920, 1080 ];
	const runningFades = {};
	function makeVideoSlide(o) {
		const slide = document.createElement("div");
		slide.setAttribute("id", o.name);
		slide.setAttribute("class", "step pointer is-video");
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
		slide.addEventListener("click", onVideoClicked);

		const video = document.createElement("video-js");
		const videoAttrs = {
			id: "video-" + o.name,
			"class": "video-js" + ("circle" in o ? " clip-circle" : ""),
			preload: "auto",
			autoplay: true,
			loop: true,
			muted: true,
		};
		for ([attr, val] of Object.entries(videoAttrs)) {
			video.setAttribute(attr, val === true ? attr : val);
		}
		video.dataset.setup = "{}";
		if ("circle" in o) {
			video.setAttribute("style", "clip-path: circle(" + (HEIGHT / 2 * o.circle) + "px);");
		}

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

	function allVideos(method, ...args) {
		for (player of Object.values(videojs.getPlayers())) {
			if (typeof method === "string") {
				player[method].apply(player, args);
			} else {
				method(player, ...args);
			}
		}
	}

	function fadeVolume(player, target, millis) {
		if (typeof player === "string") {
			player = videojs.getPlayer(player);
		}
		const playerName = player.id_;
		let volume = player.volume()
		const perInterval = (target - volume) / (millis / 50);
		if (perInterval === 0) {
			return;
		}
		const clamp = perInterval > 0 ? Math.min : Math.max;
		if (playerName in runningFades) {
			clearInterval(runningFades[playerName])
			delete runningFades[playerName];
		}
		const interval = setInterval(function () {
			volume = clamp(target, volume + perInterval);
			player.volume(volume);
			if (volume === target) {
				clearInterval(interval);
				if (runningFades[playerName] === interval) {
					delete runningFades[playerName];
				}
			}
		}, 50);
		runningFades[playerName] = interval;
	}

	function soundFocus(step) {
		if (step === null || step === undefined || step === false) {  // Play all sounds.
			allVideos(fadeVolume, 0.5, 5000);
		} else if (typeof step === "string") {  // Only play a specific video.
			allVideos(fadeVolume, 0, 3000);
			fadeVolume("video-" + step, 1, 1000);
		}
	}

	function go(ev) {
		// Stop propagation because else this bubbles up to impress's main click handler
		// which would instantly reactivate the slide with the button in it.
		ev.stopPropagation();

		allVideos("volume", 0);
		allVideos("muted", false);
		// Allow navigation again and go to an overview.
		document.body.classList.remove("no-nav");
		impress().goto("bg");
	}

	function isVideoActive() {
		const active = document.querySelector(".active");
		return (active && active.classList) ? active.classList.contains("is-video") : false;
	}

	function onStepLeave(ev) {
		// Do a sound focus on where we land next.
		if (ev.detail && ev.detail.next) {
			const stepName = ev.detail.next.id || "";
			soundFocus(videojs.getPlayer("video-" + stepName) ? stepName : null);
		}
	}

	function onVideoClicked(ev) {
		if (isVideoActive()) {
			ev.stopPropagation();
			impress().goto("bg");
		}
	}

	function impressNoNav(ev) {
		if (document.body.classList.contains("no-nav")) {
			return false;
		}
	}

	function init() {
		let i;
		try {
			i = impress();
		} catch { /* ignore */ }
		if (document.body.classList.contains("impress-not-supported")) {
			document.body.classList.add("impress-really-not-supported");
			return;
		}
		document.getElementById("meta-viewport").setAttribute("value", "width=" + WIDTH);
		i.init();
		impress.addPreStepLeavePlugin(impressNoNav);
		document.getElementById("impress").addEventListener("impress:stepleave", onStepLeave);
		document.getElementById("go").addEventListener("click", go);
		document.body.addEventListener("click", function () { impress().goto("bg"); });

		// Make sure we start on "start", no matter the #fragment in the URL.
		i.goto("start");
		document.body.classList.add("no-nav");
	}

	return {
		allVideos,
		appendVideoSlideAfter,
		fadeVolume,
		go,
		init,
		isVideoActive,
		makeVideoSlide,
		soundFocus,
	};
})();
