function PlayAudio() {
    var t = document.getElementById("listen-button");
    playClicked = !0, t.innerHTML = '<i class="fa fa-2x fa-fw fa-spinner fa-spin"></i>', audioElement.load, audioElement.play(), loaded && liveOnAir()
}

function PauseAudio() {
    var t = document.getElementById("listen-button");
    audioElement.pause(), t.innerHTML = '<i class="fa fa-2x fa-fw fa-play"></i>'
}

function togglePlay() {
    audioElement.paused ? PlayAudio() : PauseAudio()
}

function liveOnAir() {
    var t = document.getElementById("listen-button");
    t.innerHTML = '<i class="fa fa-2x fa-fw fa-pause"></i>'
}(function() {
    var t, e, n, o, i, r, a, u, l, s, c, h, d, p, f, m, v, g, y, w, E, k, b, T, _, S, H, A, x, C, L, R, N, O, j, $, I, D, M, P, q, F, X, B, G, J, U, K, z, Q, V, W, Y, Z, tt, et, nt = [].indexOf || function(t) {
            for (var e = 0, n = this.length; n > e; e++)
                if (e in this && this[e] === t) return e;
            return -1
        },
        ot = function(t, e) {
            function n() {
                this.constructor = t
            }
            for (var o in e) it.call(e, o) && (t[o] = e[o]);
            return n.prototype = e.prototype, t.prototype = new n, t.__super__ = e.prototype, t
        },
        it = {}.hasOwnProperty,
        rt = [].slice,
        at = function(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        };
    O = {}, d = 10, W = !1, M = null, y = null, R = null, F = null, et = null, o = {
        BEFORE_CHANGE: "page:before-change",
        FETCH: "page:fetch",
        RECEIVE: "page:receive",
        CHANGE: "page:change",
        UPDATE: "page:update",
        LOAD: "page:load",
        RESTORE: "page:restore",
        BEFORE_UNLOAD: "page:before-unload",
        EXPIRE: "page:expire"
    }, T = function(t) {
        var e;
        return t = new n(t), U(), h(), null != M && M.start(), W && (e = Y(t.absolute)) ? (_(e), S(t, null, !1)) : S(t, Q)
    }, Y = function(t) {
        var e;
        return e = O[t], e && !e.transitionCacheDisabled ? e : void 0
    }, E = function(t) {
        return null == t && (t = !0), W = t
    }, w = function(t) {
        return null == t && (t = !0), s ? t ? null != M ? M : M = new r("html") : (null != M && M.uninstall(), M = null) : void 0
    }, S = function(t, e, n) {
        return null == n && (n = !0), Z(o.FETCH, {
            url: t.absolute
        }), null != et && et.abort(), et = new XMLHttpRequest, et.open("GET", t.withoutHashForIE10compatibility(), !0), et.setRequestHeader("Accept", "text/html, application/xhtml+xml, application/xml"), et.setRequestHeader("X-XHR-Referer", F), et.onload = function() {
            var n;
            return Z(o.RECEIVE, {
                url: t.absolute
            }), (n = D()) ? (X(t), B(), p.apply(null, b(n)), N(), "function" == typeof e && e(), Z(o.LOAD)) : document.location.href = g() || t.absolute
        }, M && n && (et.onprogress = function(t) {
            return function(t) {
                var e;
                return e = t.lengthComputable ? t.loaded / t.total * 100 : M.value + (100 - M.value) / 10, M.advanceTo(e)
            }
        }(this)), et.onloadend = function() {
            return et = null
        }, et.onerror = function() {
            return document.location.href = t.absolute
        }, et.send()
    }, _ = function(t) {
        return null != et && et.abort(), p(t.title, t.body), P(t), Z(o.RESTORE)
    }, h = function() {
        var t;
        return t = new n(y.url), O[t.absolute] = {
            url: t.relative,
            body: document.body,
            title: document.title,
            positionY: window.pageYOffset,
            positionX: window.pageXOffset,
            cachedAt: (new Date).getTime(),
            transitionCacheDisabled: null != document.querySelector("[data-no-transition-cache]")
        }, m(d)
    }, $ = function(t) {
        return null == t && (t = d), /^[\d]+$/.test(t) ? d = parseInt(t) : void 0
    }, m = function(t) {
        var e, n, i, r, a, u;
        for (a = Object.keys(O), e = a.map(function(t) {
                return O[t].cachedAt
            }).sort(function(t, e) {
                return e - t
            }), u = [], n = 0, r = a.length; r > n; n++) i = a[n], O[i].cachedAt <= e[t] && (Z(o.EXPIRE, O[i]), u.push(delete O[i]));
        return u
    }, p = function(e, n, i, r) {
        return Z(o.BEFORE_UNLOAD), document.title = e, document.documentElement.replaceChild(n, document.body), null != i && t.update(i), V(), r && k(), y = window.history.state, null != M && M.done(), Z(o.CHANGE), Z(o.UPDATE)
    }, k = function() {
        var t, e, n, o, i, r, a, u, l, s, c, h;
        for (h = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])')), n = 0, i = h.length; i > n; n++)
            if (c = h[n], "" === (l = c.type) || "text/javascript" === l) {
                for (e = document.createElement("script"), s = c.attributes, o = 0, r = s.length; r > o; o++) t = s[o], e.setAttribute(t.name, t.value);
                c.hasAttribute("async") || (e.async = !1), e.appendChild(document.createTextNode(c.innerHTML)), u = c.parentNode, a = c.nextSibling, u.removeChild(c), u.insertBefore(e, a)
            }
    }, K = function(t) {
        return t.innerHTML = t.innerHTML.replace(/<noscript[\S\s]*?<\/noscript>/gi, ""), t
    }, V = function() {
        var t, e;
        return t = (e = document.querySelectorAll("input[autofocus], textarea[autofocus]"))[e.length - 1], t && document.activeElement !== t ? t.focus() : void 0
    }, X = function(t) {
        return (t = new n(t)).absolute !== F ? window.history.pushState({
            turbolinks: !0,
            url: t.absolute
        }, "", t.absolute) : void 0
    }, B = function() {
        var t, e;
        return (t = et.getResponseHeader("X-XHR-Redirected-To")) ? (t = new n(t), e = t.hasNoHash() ? document.location.hash : "", window.history.replaceState(window.history.state, "", t.href + e)) : void 0
    }, g = function() {
        var t;
        return null != (t = et.getResponseHeader("Location")) && new n(t).crossOrigin() ? t : void 0
    }, U = function() {
        return F = document.location.href
    }, J = function() {
        return window.history.replaceState({
            turbolinks: !0,
            url: document.location.href
        }, "", document.location.href)
    }, G = function() {
        return y = window.history.state
    }, N = function() {
        var t;
        return navigator.userAgent.match(/Firefox/) && !(t = new n).hasNoHash() ? (window.history.replaceState(y, "", t.withoutHash()), document.location.hash = t.hash) : void 0
    }, P = function(t) {
        return window.scrollTo(t.positionX, t.positionY)
    }, Q = function() {
        return document.location.hash ? document.location.href = document.location.href : window.scrollTo(0, 0)
    }, f = function(t) {
        var e, n, o;
        if (null == t || "object" != typeof t) return t;
        e = new t.constructor;
        for (n in t) o = t[n], e[n] = f(o);
        return e
    }, I = function(t) {
        var e, n;
        return n = (null != (e = document.cookie.match(new RegExp(t + "=(\\w+)"))) ? e[1].toUpperCase() : void 0) || "", document.cookie = t + "=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/", n
    }, Z = function(t, e) {
        var n;
        return "undefined" != typeof Prototype && Event.fire(document, t, e, !0), n = document.createEvent("Events"), e && (n.data = e), n.initEvent(t, !0, !0), document.dispatchEvent(n)
    }, j = function(t) {
        return !Z(o.BEFORE_CHANGE, {
            url: t
        })
    }, D = function() {
        var t, e, n, o, i, r;
        return e = function() {
            var t;
            return 400 <= (t = et.status) && 600 > t
        }, r = function() {
            var t;
            return null != (t = et.getResponseHeader("Content-Type")) && t.match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/)
        }, o = function(t) {
            var e, n, o, i, r;
            for (i = t.querySelector("head").childNodes, r = [], e = 0, n = i.length; n > e; e++) o = i[e], null != ("function" == typeof o.getAttribute ? o.getAttribute("data-turbolinks-track") : void 0) && r.push(o.getAttribute("src") || o.getAttribute("href"));
            return r
        }, t = function(t) {
            var e;
            return R || (R = o(document)), e = o(t), e.length !== R.length || i(e, R).length !== R.length
        }, i = function(t, e) {
            var n, o, i, r, a;
            for (t.length > e.length && (i = [e, t], t = i[0], e = i[1]), r = [], n = 0, o = t.length; o > n; n++) a = t[n], nt.call(e, a) >= 0 && r.push(a);
            return r
        }, !e() && r() && (n = v(et.responseText), n && !t(n)) ? n : void 0
    }, b = function(e) {
        var n;
        return n = e.querySelector("title"), [null != n ? n.textContent : void 0, K(e.querySelector("body")), t.get(e).token, "runScripts"]
    }, t = {
        get: function(t) {
            var e;
            return null == t && (t = document), {
                node: e = t.querySelector('meta[name="csrf-token"]'),
                token: null != e && "function" == typeof e.getAttribute ? e.getAttribute("content") : void 0
            }
        },
        update: function(t) {
            var e;
            return e = this.get(), null != e.token && null != t && e.token !== t ? e.node.setAttribute("content", t) : void 0
        }
    }, v = function(t) {
        var e;
        return e = document.documentElement.cloneNode(), e.innerHTML = t, e.head = e.querySelector("head"), e.body = e.querySelector("body"), e
    }, n = function() {
        function t(e) {
            return this.original = null != e ? e : document.location.href, this.original.constructor === t ? this.original : void this._parse()
        }
        return t.prototype.withoutHash = function() {
            return this.href.replace(this.hash, "").replace("#", "")
        }, t.prototype.withoutHashForIE10compatibility = function() {
            return this.withoutHash()
        }, t.prototype.hasNoHash = function() {
            return 0 === this.hash.length
        }, t.prototype.crossOrigin = function() {
            return this.origin !== (new t).origin
        }, t.prototype._parse = function() {
            var t;
            return (null != this.link ? this.link : this.link = document.createElement("a")).href = this.original, t = this.link, this.href = t.href, this.protocol = t.protocol, this.host = t.host, this.hostname = t.hostname, this.port = t.port, this.pathname = t.pathname, this.search = t.search, this.hash = t.hash, this.origin = [this.protocol, "//", this.hostname].join(""), 0 !== this.port.length && (this.origin += ":" + this.port), this.relative = [this.pathname, this.search, this.hash].join(""), this.absolute = this.href
        }, t
    }(), i = function(t) {
        function e(t) {
            return this.link = t, this.link.constructor === e ? this.link : (this.original = this.link.href, this.originalElement = this.link, this.link = this.link.cloneNode(!1), void e.__super__.constructor.apply(this, arguments))
        }
        return ot(e, t), e.HTML_EXTENSIONS = ["html"], e.allowExtensions = function() {
            var t, n, o, i;
            for (n = 1 <= arguments.length ? rt.call(arguments, 0) : [], o = 0, i = n.length; i > o; o++) t = n[o], e.HTML_EXTENSIONS.push(t);
            return e.HTML_EXTENSIONS
        }, e.prototype.shouldIgnore = function() {
            return this.crossOrigin() || this._anchored() || this._nonHtml() || this._optOut() || this._target()
        }, e.prototype._anchored = function() {
            return (this.hash.length > 0 || "#" === this.href.charAt(this.href.length - 1)) && this.withoutHash() === (new n).withoutHash()
        }, e.prototype._nonHtml = function() {
            return this.pathname.match(/\.[a-z]+$/g) && !this.pathname.match(new RegExp("\\.(?:" + e.HTML_EXTENSIONS.join("|") + ")?$", "g"))
        }, e.prototype._optOut = function() {
            var t, e;
            for (e = this.originalElement; !t && e !== document;) t = null != e.getAttribute("data-no-turbolink"), e = e.parentNode;
            return t
        }, e.prototype._target = function() {
            return 0 !== this.link.target.length
        }, e
    }(n), e = function() {
        function t(t) {
            this.event = t, this.event.defaultPrevented || (this._extractLink(), this._validForTurbolinks() && (j(this.link.absolute) || tt(this.link.href), this.event.preventDefault()))
        }
        return t.installHandlerLast = function(e) {
            return e.defaultPrevented ? void 0 : (document.removeEventListener("click", t.handle, !1), document.addEventListener("click", t.handle, !1))
        }, t.handle = function(e) {
            return new t(e)
        }, t.prototype._extractLink = function() {
            var t;
            for (t = this.event.target; t.parentNode && "A" !== t.nodeName;) t = t.parentNode;
            return "A" === t.nodeName && 0 !== t.href.length ? this.link = new i(t) : void 0
        }, t.prototype._validForTurbolinks = function() {
            return null != this.link && !(this.link.shouldIgnore() || this._nonStandardClick())
        }, t.prototype._nonStandardClick = function() {
            return this.event.which > 1 || this.event.metaKey || this.event.ctrlKey || this.event.shiftKey || this.event.altKey
        }, t
    }(), r = function() {
        function t(t) {
            this.elementSelector = t, this._trickle = at(this._trickle, this), this.value = 0, this.content = "", this.speed = 300, this.opacity = .99, this.install()
        }
        var e;
        return e = "turbolinks-progress-bar", t.prototype.install = function() {
            return this.element = document.querySelector(this.elementSelector), this.element.classList.add(e), this.styleElement = document.createElement("style"), document.head.appendChild(this.styleElement), this._updateStyle()
        }, t.prototype.uninstall = function() {
            return this.element.classList.remove(e), document.head.removeChild(this.styleElement)
        }, t.prototype.start = function() {
            return this.advanceTo(5)
        }, t.prototype.advanceTo = function(t) {
            var e;
            if (t > (e = this.value) && 100 >= e) {
                if (this.value = t, this._updateStyle(), 100 === this.value) return this._stopTrickle();
                if (this.value > 0) return this._startTrickle()
            }
        }, t.prototype.done = function() {
            return this.value > 0 ? (this.advanceTo(100), this._reset()) : void 0
        }, t.prototype._reset = function() {
            var t;
            return t = this.opacity, setTimeout(function(t) {
                return function() {
                    return t.opacity = 0, t._updateStyle()
                }
            }(this), this.speed / 2), setTimeout(function(e) {
                return function() {
                    return e.value = 0, e.opacity = t, e._withSpeed(0, function() {
                        return e._updateStyle(!0)
                    })
                }
            }(this), this.speed)
        }, t.prototype._startTrickle = function() {
            return this.trickling ? void 0 : (this.trickling = !0, setTimeout(this._trickle, this.speed))
        }, t.prototype._stopTrickle = function() {
            return delete this.trickling
        }, t.prototype._trickle = function() {
            return this.trickling ? (this.advanceTo(this.value + Math.random() / 2), setTimeout(this._trickle, this.speed)) : void 0
        }, t.prototype._withSpeed = function(t, e) {
            var n, o;
            return n = this.speed, this.speed = t, o = e(), this.speed = n, o
        }, t.prototype._updateStyle = function(t) {
            return null == t && (t = !1), t && this._changeContentToForceRepaint(), this.styleElement.textContent = this._createCSSRule()
        }, t.prototype._changeContentToForceRepaint = function() {
            return this.content = "" === this.content ? " " : ""
        }, t.prototype._createCSSRule = function() {
            return this.elementSelector + "." + e + "::before {\n  content: '" + this.content + "';\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 2000;\n  background-color: #0076ff;\n  height: 3px;\n  opacity: " + this.opacity + ";\n  width: " + this.value + "%;\n  transition: width " + this.speed + "ms ease-out, opacity " + this.speed / 2 + "ms ease-in;\n  transform: translate3d(0,0,0);\n}"
        }, t
    }(), c = function(t) {
        return setTimeout(t, 500)
    }, x = function() {
        return document.addEventListener("DOMContentLoaded", function() {
            return Z(o.CHANGE), Z(o.UPDATE)
        }, !0)
    }, L = function() {
        return "undefined" != typeof jQuery ? jQuery(document).on("ajaxSuccess", function(t, e, n) {
            return jQuery.trim(e.responseText) ? Z(o.UPDATE) : void 0
        }) : void 0
    }, C = function(t) {
        var e, o;
        return (null != (o = t.state) ? o.turbolinks : void 0) ? (e = O[new n(t.state.url).absolute]) ? (h(), _(e)) : tt(t.target.location.href) : void 0
    }, A = function() {
        return J(), G(), document.addEventListener("click", e.installHandlerLast, !0), window.addEventListener("hashchange", function(t) {
            return J(), G()
        }, !1), c(function() {
            return window.addEventListener("popstate", C, !1)
        })
    }, H = void 0 !== window.history.state || navigator.userAgent.match(/Firefox\/2[6|7]/), l = window.history && window.history.pushState && window.history.replaceState && H, a = !navigator.userAgent.match(/CriOS\//), z = "GET" === (q = I("request_method")) || "" === q, s = l && a && z, u = document.addEventListener && document.createEvent, u && (x(), L()), s ? (tt = T, A()) : tt = function(t) {
        return document.location.href = t
    }, this.Turbolinks = {
        visit: tt,
        pagesCached: $,
        enableTransitionCache: E,
        enableProgressBar: w,
        allowLinkExtensions: i.allowExtensions,
        supported: s,
        EVENTS: f(o)
    }
}).call(this);
var audioElement = document.createElement("audio");
audioElement.src = "http://wjrh.org:8000/WJRHlow", audioElement.preload = "none";
var playClicked = !1,
    loaded = !1;
audioElement.onloadeddata = function() {
    loaded = !0, playClicked && liveOnAir()
}, $(document).on("page:change", function(t) {
    var e = document.getElementById("listen-button");
    audioElement.paused ? e.innerHTML = '<i class="fa fa-2x fa-fw fa-play"></i>' : e.innerHTML = '<i class="fa fa-2x fa-fw fa-pause"></i>'
}), setInterval("updateSongInfo();", 4e3);
var updateSongInfo = function() {
    $.getJSON("https://api.teal.cool/organizations/wjrh/latest", function(t) {
        console.log("latest events updated"), "track-log" === t.event ? ($("#nowplaying-dj").show(), $("#nowplaying-song").show(), $("#djdata").html(t.program.name + " with " + t.program.author), $("#songdata").html(t.track.artist + " - " + t.track.title)) : "episode-start" === t.event ? ($("#nowplaying-dj").show(), $("#nowplaying-song").hide(), $("#djdata").html(t.program.name + " with " + t.program.author)) : "episode-end" === t.event && ($("#nowplaying-dj").show(), $("#nowplaying-song").hide(), $("#djdata").html("WJRH RoboDJ"))
    })
};
$(document).ready(function() {
    updateSongInfo()
});
var checkData = function() {
    $("#songdata").text().length + $("#djdata").text().length > 160 || "WJRH RoboDJ\n" == $("#djdata").text() ? $("#nowplaying-dj").hide() : $("#nowplaying-dj").show()
};
$(document).ajaxComplete(function() {
    checkData()
});