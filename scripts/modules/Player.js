import $ from 'jquery';

const PLAY_MARKUP = '<i class="material-icons md-light md-48 btn-player">play_arrow</i>';
const PAUSE_MARKUP = '<i class="material-icons md-light md-48 btn-player">pause</i>';

class Player {

    constructor(intialRadioStation) {
        this.playing = false;
        this.audio = new Audio(); // Create an <audio> tag
        this.audio.setAttribute('src', intialRadioStation.url); // Load initial stream
        this.playToggle = $('#playToggle');
        this.stationIcons = $("a").filter(function () {
            return $(this).data("url") !== undefined;
        });
        this.events();
    }

    events() {
        var _self = this;

        this.playToggle.click(function (ev) {
            ev.preventDefault();

            _self.playing = !_self.playing; // toggle boolean value
            if (_self.playing) {
                _self.audio.play();
                _self.playToggle.html(PAUSE_MARKUP);
            } else {
                _self.audio.pause();
                _self.playToggle.html(PLAY_MARKUP);
            }
        });

        this.stationIcons.click(function (ev) {
            ev.preventDefault();

            var newUrl = $(this).data('url');
            _self.audio.setAttribute('src', newUrl); // Load the stream
            _self.audio.play();

            $('#currentRadioStation').text(
                    $(this).html()
                    );
            // Show the pause button
            _self.playToggle.html(PAUSE_MARKUP);
        });
    }
}

export default Player;