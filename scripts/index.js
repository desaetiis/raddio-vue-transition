new Vue({
  el: '#app',
  components: {
    'icon': { template: '<svg><use :xlink:href="use"/></svg>', props: ['use'] }
  },

  data() {
    return {
      modal: false,
      companies: [],
      dropdown: { height: 0 },
      rating: { min: 10, max: 0 },
      filters: { countries: {}, categories: {}, rating: 0 },
      menus: { countries: false, categories: false, rating: false }
    }
  },

  computed: {
    activeMenu() {
      return Object.keys(this.menus).reduce(($$, set, i) => (this.menus[set]) ? i : $$, -1)
    },

    list() {
      let { countries, categories } = this.activeFilters

      return this.companies.filter(({ country, keywords, rating }) => {
        if (rating < this.filters.rating) return false
        if (countries.length && !~countries.indexOf(country)) return false
        return !categories.length || categories.every(cat => ~keywords.indexOf(cat))
      })
    },

    activeFilters() {
      let { countries, categories } = this.filters

      return {
        countries: Object.keys(countries).filter(c => countries[c]),
        categories: Object.keys(categories).filter(c => categories[c]),
        rating: (this.filters.rating > this.rating.min) ? [this.filters.rating] : []
      }
    }
  },

  watch: {
    activeMenu(index, from) {
      if (index === from) return;

      this.$nextTick(() => {
        if (!this.$refs.menu || !this.$refs.menu[index]) {
          this.dropdown.height = 0
        } else {
          this.dropdown.height = `${this.$refs.menu[index].clientHeight + 16}px`
        }
      })
    }
  },

  methods: {
    setFilter(filter, option) {
      if (filter === 'countries') {
        this.filters[filter][option] = !this.filters[filter][option]
      } else {
        setTimeout(() => {
          this.clearFilter(filter, option, this.filters[filter][option])
        }, 100)
      }
    },

    clearFilter(filter, except, active) {
      if (filter === 'rating') {
        this.filters[filter] = this.rating.min
      } else {
        Object.keys(this.filters[filter]).forEach(option => {
          this.filters[filter][option] = except === option && !active
        })
      }
    },

    clearAllFilters() {
      Object.keys(this.filters).forEach(this.clearFilter)
    },

    setMenu(menu, active) {
      Object.keys(this.menus).forEach(tab => {
        this.menus[tab] = !active && tab === menu
      })
    }
  },

  beforeMount() {
    fetch('../data.json')
      .then(response => response.json())
      .then(companies => {
        this.companies = companies

        companies.forEach(({ country, keywords, rating }) => {
          this.$set(this.filters.countries, country, false)

          if (this.rating.max < rating) this.rating.max = rating
          if (this.rating.min > rating) {
            this.rating.min = rating
            this.filters.rating = rating
          }

          keywords.forEach(category => {
            this.$set(this.filters.categories, category, false)
          })
        })
      })
  }
})

// inject svg spritesheet
fetch('https://s3-us-west-2.amazonaws.com/s.cdpn.io/450744/mock-logos.svg')
  .then(response => response.text()).then(sprite => {
    let figure = document.createElement('figure')
    figure.style.display = 'none'
    figure.innerHTML = sprite
    document.body.insertBefore(figure, document.body.children[0])
  })
//import $ from 'jquery';
//
//const PLAY_MARKUP = '<i class="material-icons md-light md-48 btn-player">play_arrow</i>';
//const PAUSE_MARKUP = '<i class="material-icons md-light md-48 btn-player">pause</i>';
//
//class Player {
//
//	constructor(intialRadioStation) {
//		this.playing = false;
//		this.audio = new Audio(); // Create an <audio> tag
//		this.audio.setAttribute('src', intialRadioStation.url); // Load initial stream
//		this.playToggle = $('#playToggle');
//		this.stationIcons = $("a").filter(function () {
//			return $(this).data("url") !== undefined;
//		});
//		this.events();
//	}
//
//	events() {
//		var _self = this;
//
//		this.playToggle.click(function (ev) {
//			ev.preventDefault();
//
//			_self.playing = !_self.playing; // toggle boolean value
//			if (_self.playing) {
//				_self.audio.play();
//				_self.playToggle.html(PAUSE_MARKUP);
//			} else {
//				_self.audio.pause();
//				_self.playToggle.html(PLAY_MARKUP);
//			}
//		});
//
//		this.stationIcons.click(function (ev) {
//			ev.preventDefault();
//
//			var newUrl = $(this).data('url');
//			_self.audio.setAttribute('src', newUrl); // Load the stream
//			_self.audio.play();
//
//			$('#currentRadioStation').text(
//				$(this).html()
//			);
//			// Show the pause button
//			_self.playToggle.html(PAUSE_MARKUP);
//		});
//	}
//}
//
//export default Player;