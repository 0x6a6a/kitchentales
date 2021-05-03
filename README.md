# kitchen tales

This is a work of art.
It’s a website with some videos.

## Architecture

_kitchen tales_ is a static website based on [impress.js](https://impress.js.org/).
It’s using [ffmpeg](https://ffmpeg.org/) to split the embedded videos into [HLS](https://en.wikipedia.org/wiki/HTTP_Live_Streaming) segments before deployment, and [Video.js](https://videojs.com/) for cross-browser playback of these videos.

JavaScript dependencies are fetched from the unpkg CDN.
At some point we might serve them locally, but not yet.

## Setting up

* Clone the repo.
* Run `scripts/build.sh` to create the `dist` folder that contains the HTML, CSS and JavaScript from the `src` directory (as of yet, unminified). It will also automatically call `scripts/build-hls.sh` for converting the videos from `assets/videos` to HLS segments.
* Throw the contents of `dist` onto some webserver. Right now, we use `scripts/deploy.sh` to [rclone](https://rclone.org/)-sync them via WebDAV to [kitchentales.space](https://kitchentales.space/).
* There’s [a GitHub Actions workflow](.github/workflows/auto-deploy.yaml) that automates all of that on push.

For local development, run any kind of webserver in `dist`.
For example, if you have Python installed, you may use something like `python3 -m http.server 8080` and then access the site at <http://localhost:8080/>.
Do note that you’ll have to run `scripts/build.sh` after changing the source files.
If that’s too tedious for you, you can create symlinks to the required files like this:

```sh
ln -sf ../src/{index.html,kitchentales.css,kitchentales.js} ../assets/background.jpg dist
```

## Adding/removing/repositioning videos

Check out the `<script>` section in `index.html` that defines the JavaScript object `videoDef`.

Each of the keys is the **name** of a video (which will also be used as its DOM element ID).
The name corresponds to the file name:
All of the files are named `kitchen-<name>.mov` and reside in `assets/videos`.

Each of the values are a set of options.

* `scale` and `rotate` are passed as-is to impress.js.
* `x` and `y` set the 2D position, where `0, 0` is the top-left corner of the background image. This is somewhat different to the way _impress.js_ usually works (with `0, 0` being the _center_ of the view). We simply subtract half of the background’s width and height (defined in `kitchentales.js`) from the respective value. We’re doing this to allow us to read the coordinates by pointing at a pixel on the background image in Paint.
* `circle` will cause the video to be clipped (masked) into a circle. The value is a number from 0 to 1 and specifies the circle’s radius as a fraction of the video height.
* `after` is the DOM element ID the video should be inserted after.
