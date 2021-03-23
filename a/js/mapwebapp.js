!function (t) {
    function e(t) {
        return t.replace(/[^a-zA-Z0-9]/g, "")
    }

    function n(i) {
        var o = t.__M__[e(i)];
        return o ? (o.fn && !o.exports && (o.exports = {}, o.fn(n, o.exports, o), delete o.fn), o.exports) : (console.log("error: 导出文件有问题", i), void 0)
    }

    t.__M__ || (t.__M__ = {}), t.__M__.srcscriptslibutilsjs = {
        path: "/src/scripts/lib/utils.js",
        fn: function (t, e, n, i) {
            function o(t) {
                return Object.prototype.toString.call(t).slice(8, -1)
            }

            function r() {
                function t(e, n, r) {
                    for (var a in n) {
                        var s = n[a];
                        if (r) {
                            var c = o(s), l = "Array" === c, p = "Object" === c;
                            if (l || p) {
                                var u = o(e[a]);
                                l ? "Array" !== u && (e[a] = []) : "Object" !== u && (e[a] = {}), t(e[a], s, r)
                            } else s !== i && (e[a] = s)
                        } else s !== i && (e[a] = s)
                    }
                }

                var e, n, r = arguments.length, a = 0;
                for (n = arguments[a] === !0 ? (a++, !0) : !1, e = arguments[a++], a; r > a; a++)"Object" === o(arguments[a]) && t(e, arguments[a], n);
                return e
            }

            function a(t, e) {
                t = "Function" === o(t) ? t.prototype : t;
                var n = function () {
                };
                n.prototype = t, e.prototype = new n, e.prototype.constructor = e, e.supperClass = t
            }

            function s(t, e) {
                function n() {
                    var t = document.querySelector(".m-radar-scanner"), e = t.getContext("2d");
                    t.width = t.height = r;
                    var n = e.createLinearGradient(0, 0, r, r);
                    n.addColorStop(0, "rgba(0,255,0,.5)"), n.addColorStop(.5, "rgba(255,255,255,0)"), e.beginPath(), e.fillStyle = n, e.strokeStyle = "rgba(0,0,0,0)", e.moveTo(0, r), e.lineTo(0, 0), e.arcTo(r, 0, r, r, r), e.moveTo(0, r), e.lineTo(r, r), e.stroke(), e.fill()
                }

                function i() {
                    var t = document.querySelector(".m-radar-stage"), i = t.getContext("2d");
                    t.width = t.height = o, i.beginPath(), i.strokeStyle = "rgba(0,255,0,.3)", i.lineWidth = 2, i.arc(e, e, e - 1, 0, 2 * a, !0), i.arc(e, e, e / 1.5 - 1, 0, 2 * a, !0), i.arc(e, e, e / 3 - 1, 0, 2 * a, !0), i.moveTo(0, e), i.lineTo(o, e), i.moveTo(e, 0), i.lineTo(e, o), i.stroke(), n()
                }

                var o = 2 * e, r = e, a = Math.PI, s = document.querySelector(t);
                s.style.width = s.style.height = o, i()
            }

            function c(t, e) {
                var n;
                return function () {
                    var i = this, o = arguments;
                    clearTimeout(n), n = setTimeout(function () {
                        t.apply(i, o)
                    }, e)
                }
            }

            function l(t, e, n) {
                var i, o;
                return e = e > n ? e : n, function () {
                    var r = this, a = new Date, s = arguments;
                    clearTimeout(i), o || (o = a), a - o >= n ? (t.apply(r, s), o = a) : i = setTimeout(function () {
                        t.apply(r, s)
                    }, e)
                }
            }

            n.exports = {extend: r, classof: o, throttle: c, throttleAni: l, drawRadar: s, inheritClass: a}
        }
    }, t.__M__.srcscriptslibamapAdaptorImpljs = {
        path: "/src/scripts/lib/amapAdaptorImpl.js", fn: function (t, e, n) {
            t("/src/scripts/lib/utils.js");
            n.exports = function () {
                var t = {
                    getMapInfo: function (t) {
                        return {
                            type: "amap",
                            src: "//webapi.amap.com/maps?v=1.3&key=5515092ef63deb9b032f460337fba660&plugin=AMap.Driving&callback=amapLoadInit",
                            cb: function () {
                                try {
                                    var e = t.ele, n = e.querySelector("a.amap-logo");
                                    return n.onclick = function (t) {
                                        t.preventDefault(), t.stopPropagation()
                                    }, !0
                                } catch (i) {
                                    return !1
                                }
                            }
                        }
                    }, convertorGeolocationPos: function (t, e, n) {
                        var i = {gps: "gps", soso: "soso", baidu: "baidu", google: "google"};
                        n && AMap.convertFrom(new AMap.LngLat(t[1], t[0]), i[e], function (t, e) {
                            n(e.locations[0])
                        })
                    }, newMap: function (t, e) {
                        return new AMap.Map(t, e)
                    }, latLngToPos: function (t) {
                        return new AMap.LngLat(t[1], t[0])
                    }, fitBounds: function (t, e) {
                        t.setBounds(new AMap.Bounds(e[0], e[1]))
                    }, createMarker: function (t, e) {
                        t.offset = new AMap.Pixel(-e.anchor[0], -e.anchor[1]), t.icon = new AMap.Icon({
                            image: e.url,
                            size: new AMap.Size(e.size[0], e.size[1]),
                            imageOffset: new AMap.Pixel(-e.origin[0], -e.origin[1]),
                            imageSize: new AMap.Size(e.scaleSize[0], e.scaleSize[1])
                        });
                        var n = new AMap.Marker(t);
                        return n.getVisible = function () {
                            return !!n.getMap()
                        }, n
                    }, setMarkerAngle: function (t, e, n) {
                        var i = 180 * e / Math.PI;
                        n.setAngle(-i)
                    }, setMarkerVisible: function (t, e) {
                        e ? t.show() : t.hide()
                    }, setLabel: function (t, e) {
                        if (!e)return t.setMap(null), void 0;
                        e.offset = e.offset || [0, 0];
                        var n = new AMap.Marker({
                            map: t,
                            position: e.position || e.center,
                            offset: new AMap.Pixel(e.offset[0], e.offset[1]),
                            content: '<div title="' + (e.title || "map-recommend-point") + '">' + (e.content || "") + "</div>"
                        });
                        return n
                    }, setTip: function (t, e) {
                        e.offset = e.offset || [0, 0];
                        var n = new AMap.Marker({
                            map: t,
                            position: e.center,
                            zIndex: e.zIndex,
                            title: e.title,
                            offset: new AMap.Pixel(e.offset[0], e.offset[1]),
                            content: e.content || "<div></div>"
                        });
                        return n._setOffset = function (t) {
                            t && n.setOffset(new AMap.Pixel(t[0], t[1]))
                        }, n
                    }, setLines: function (t, e, n) {
                        return new AMap.Polyline({
                            map: t,
                            path: e,
                            strokeColor: n.color || "#27c89e",
                            strokeOpacity: n.opacity || 1,
                            strokeWeight: n.weight || 2,
                            strokeStyle: n.style || "dash",
                            strokeDasharray: n.dashArray || [10, 8]
                        })
                    }, newUnit: function (t, e, n, i) {
                        return AMap[t] ? new AMap[t](e, n, i) : !1
                    }, moveTo: function (t, e, n, i, o, r, a, s) {
                        var c = 3.6 * this.pointDistance(e, n) / i || .001;
                        a.moveTo(n, c), s && s.moveTo(n, c)
                    }, pointDistance: function (t, e) {
                        return t.distance(e)
                    }, addListener: function (t, e, n) {
                        var i = {zoomchange: "zoomchange", centerchange: "moveend"};
                        return AMap.event.addListener(t, i[e] || e, n)
                    }, removeListener: function (t) {
                        AMap.event.removeListener(t)
                    }, clearListeners: function (t) {
                        AMap.event.clearListeners(t)
                    }, renderDrivingA2B: function (t, e, n, i) {
                        var o = {map: t, hideMarkers: !0, policy: "REAL_TRAFFIC"}, r = new AMap.Driving(o);
                        i && AMap.event.addListener(r, "complete", i), r.search(e, n)
                    }, destroy: function (t) {
                        t.distory()
                    }
                }, e = {
                    config: {
                        boundsOffset: .002,
                        user: {angleOffset: -4},
                        start: {tipOffset: [0, -6]},
                        car: {marker: {zIndex: 110}, tipOffset: [0, -4]}
                    }
                };
                return {implementation: t, extendWebMap: e}
            }
        }
    }, t.__M__.srcscriptslibqmapAdaptorImpljs = {
        path: "/src/scripts/lib/qmapAdaptorImpl.js", fn: function (t, e, n) {
            var i = t("/src/scripts/lib/utils.js");
            n.exports = function () {
                var t = {}, e = "_9527", n = [], o = {
                    getMapInfo: function (t) {
                        return {
                            type: "qmap",
                            src: ("https:" === t.protocol ? "https://apis.map.qq.com" : "http://map.qq.com") + "/api/js?v=2.exp&libraries=convertor,geometry&key=S2XBZ-EFUHV-ZXNPO-UB7MU-DACB2-5KFTP&callback=qmapLoadInit",
                            cb: function () {
                                try {
                                    var e = t.ele, n = e.querySelector('div > div[onpositionupdate="return;"]'), i = n.querySelector("a");
                                    return i.onclick = function (t) {
                                        t.preventDefault(), t.stopPropagation()
                                    }, !0
                                } catch (o) {
                                    return !1
                                }
                            }
                        }
                    }, convertorGeolocationPos: function (t, e, n) {
                        var i = {gps: 1, soso: 2, baidu: 3, google: 5};
                        n && qq.maps.convertor.translate(new qq.maps.LatLng(t[0], t[1]), i[e], function (t) {
                            n(t[0])
                        })
                    }, newMap: function (t, e) {
                        return new qq.maps.Map(t, e)
                    }, latLngToPos: function (t) {
                        return new qq.maps.LatLng(t[0], t[1])
                    }, fitBounds: function (t, e) {
                        t.fitBounds(new qq.maps.LatLngBounds(e[0], e[1]))
                    }, createMarker: function (t, e) {
                        return t.visiable = !0, t.icon = new qq.maps.MarkerImage(e.url, new qq.maps.Size(e.size[0], e.size[1]), new qq.maps.Point(e.origin[0], e.origin[1]), new qq.maps.Point(e.anchor[0], e.anchor[1]), new qq.maps.Size(e.scaleSize[0], e.scaleSize[1])), new qq.maps.Marker(t)
                    }, setMarkerAngle: function (t, n) {
                        var i = document.querySelector('[title="' + t + e + '"]');
                        i && (i.style.webkitTransform = i.style.transform = "rotate(" + -n + "rad) translateZ(0)")
                    }, setMarkerVisible: function (t, e) {
                        t.setVisible(e)
                    }, setLabel: function (t, e) {
                        return e ? (e.offset = e.offset || [0, 0], new qq.maps.Label({
                            map: t,
                            position: e.position || e.center,
                            content: e.content || "",
                            style: i.extend(!0, {
                                position: "absolute",
                                whiteSpace: "normal",
                                lineHeight: "16px",
                                border: "none",
                                fontSize: "12px",
                                fontWeight: "600",
                                width: "100px",
                                padding: "0",
                                backgroundColor: "rgba(255,255,255,0)",
                                color: "#52b786"
                            }, e.style),
                            title: e.title || "",
                            offset: new qq.maps.Size(e.offset[0], e.offset[1])
                        })) : (t.setMap(null), void 0)
                    }, setTip: function (t, e) {
                        var n = this.setLabel(t, i.extend({style: {width: "220px", margin: "auto"}}, e));
                        return e.zIndex && n.setZIndex(e.zIndex), n._setOffset = function (t) {
                            t && n.setOffset(new qq.maps.Size(t[0], t[1]))
                        }, n
                    }, setLines: function (t, e, n) {
                        return new qq.maps.Polyline({
                            map: t,
                            path: e,
                            editable: !1,
                            clickable: !1,
                            zIndex: n.zIndex || 1e3,
                            strokeColor: n.color || "#27c89e",
                            strokeWeight: n.weight || 2,
                            strokeDashStyle: n.style || "dash"
                        })
                    }, newUnit: function (t, e, n, i) {
                        return qq.maps[t] ? new qq.maps[t](e, n, i) : !1
                    }, moveTo: function (e, n, i, r, a, s, c, l) {
                        var p = o, u = n.getLng(), f = n.getLat(), m = i.getLng(), h = i.getLat(), d = m - u, g = h - f;
                        if (0 === d && 0 === g)return !1;
                        var v = 0, b = 40;
                        interval = (r - 1) / b * 1e3;
                        var L = d / b, M = g / b;
                        t[e] && clearTimeout(t[e]), function w() {
                            u += L, f += M;
                            var n = p.latLngToPos([f, u]);
                            if (c.setPosition(n), l.setPosition(n), ++v < b)t[e] = setTimeout(w, interval); else {
                                var i = p.latLngToPos([h, m]);
                                c.setPosition(i), l.setPosition(i)
                            }
                        }()
                    }, pointDistance: function (t, e) {
                        return t.distanceTo(e)
                    }, addListener: function (t, e, n) {
                        var i = {zoomchange: "zoom_changed", centerchange: "center_changed"};
                        return qq.maps.event.addListener(t, i[e] || e, n)
                    }, removeListener: function (t) {
                        qq.maps.event.removeListener(t)
                    }, clearListeners: function () {
                        qq.maps.event.clearListeners()
                    }, renderDrivingA2B: function (t, e, n, i) {
                        var o = {map: t, policy: "REAL_TRAFFIC"};
                        i && (o.complete = i), new qq.maps.DrivingService(o).search(e, n)
                    }, destroy: function () {
                        n.forEach(function (t) {
                            clearInterval(t)
                        })
                    }
                }, r = {
                    config: {
                        user: {angleOffset: 2},
                        car: {marker: {title: "car" + e}, tipOffset: [-110, -54]},
                        start: {marker: {title: "start" + e}, tipOffset: [-110, -80]}
                    }
                };
                return {implementation: o, extendWebMap: r}
            }
        }
    }, t.__M__.srcscriptslibMapAPIjs = {
        path: "/src/scripts/lib/MapAPI.js", fn: function (t, e, n) {
            function i(t) {
                return t
            }

            var o = t("/src/scripts/lib/amapAdaptorImpl.js"), r = t("/src/scripts/lib/qmapAdaptorImpl.js"), a = {};
            n.exports = function (t, e) {
                if ("amap" === t) {
                    var n = o();
                    a = i(n.implementation), e(a, n.extendWebMap)
                } else {
                    var s = r();
                    a = i(s.implementation), e(a, s.extendWebMap)
                }
                return a
            }
        }
    }, t.__M__.srcscriptslibWebMapjs = {
        path: "/src/scripts/lib/WebMap.js", fn: function (t, e, n) {
            function i(t) {
                var e = {};
                e.config = {
                    ele: document.getElementById("map-webapp"),
                    map: {
                        autoInitGeoToCenter: !1,
                        zoom: 16,
                        center: [40.043535, 116.290425],
                        draggable: !0,
                        zoomControl: !1,
                        panControl: !1,
                        mapTypeControl: !1,
                        scaleControl: !1
                    },
                    bounds: ["user", "user"],
                    aniTime: 8,
                    markerUrl: "/a/images/i-marker-direction.png",
                    user: {
                        show: !1,
                        time: 3e3,
                        deviceorientation: !0,
                        marker: {title: "user_9527"},
                        icon: {origin: [27, 9], size: [20, 18], anchor: [9, 10]},
                        cb: function () {
                        }
                    },
                    start: {
                        show: !1,
                        tip: !1,
                        tipClass: "",
                        tipOffset: [-110, -80],
                        marker: {title: "start_9527", draggable: !1, zIndex: 12},
                        cb: function () {
                        }
                    },
                    end: {show: !1, icon: {origin: [78, 0]}},
                    car: {
                        show: !1,
                        tip: !0,
                        tipClass: "",
                        tipOffset: [-110, -54],
                        marker: {title: "car_9527", clickable: !0, visible: !1},
                        icon: {origin: [48, 3], size: [30, 30], anchor: [15, 15]}
                    }
                };
                var n = !!("ontouchstart"in window || window.DocumentTouch && document instanceof DocumentTouch), i = function (e) {
                    function n(t) {
                        console.log("获取地理位置信息失败\n", t)
                    }

                    if (e.navigator.geolocation) {
                        var i, o = {enableHighAccuracy: !0, accuracy: 2e3, maximumAge: 2e3, timeout: 1e4};
                        return {
                            getCurrentPosition: function (i, r) {
                                e.navigator.geolocation.getCurrentPosition(function (e) {
                                    var n = e.coords.longitude, o = e.coords.latitude;
                                    i && t.convertorGeolocationPos([o, n], "gps", i)
                                }, n, r || o)
                            }, watchPosition: function (r, a) {
                                if ("function" == typeof r) {
                                    var s, c, l = Date.now(), p = l - 2e5;
                                    a ? o.maximumAge = a : a = o.maximumAge, i && e.navigator.geolocation.clearWatch(i), i = e.navigator.geolocation.watchPosition(function (e) {
                                        if (!((l = Date.now()) - p < a)) {
                                            p = l;
                                            var n = e.coords.longitude, i = e.coords.latitude;
                                            (i !== s || n !== c) && (s = i, c = n, t.convertorGeolocationPos([i, n], "gps", function (t) {
                                                r([t.getLat(), t.getLng()])
                                            }))
                                        }
                                    }, n, o)
                                }
                            }, clearWatch: function () {
                                i && e.navigator.geolocation.clearWatch(i)
                            }
                        }
                    }
                    alert("浏览器不支持html5来获取地理位置信息")
                }(window);
                return e = o.extend(e, {
                    _init: function (e) {
                        var n = this;
                        this.ele = e.ele, this.maptype = e.maptype, this.map = t.newMap(e.ele, e.map), this._initUI(e.ele), e.map.autoInitGeoToCenter && i.getCurrentPosition(function (t) {
                            n.map.panTo(t)
                        }), e.user.show && this.initShowUser(e.user), e.start.show && this.initShowStart(e.start), e.end.show && this.initShowEnd(e.end), e.car.show && this.initShowCar(e.car)
                    }, _initUI: function (t) {
                        var e = t;
                        this._mvToUser = document.createElement("div"), this._mvToUser.className = "m-map-rebounds", e.appendChild(this._mvToUser), this._initEvent()
                    }, _initEvent: function () {
                        var e = this;
                        this._mvToUser.addEventListener(n ? "touchend" : "click", function () {
                            e.moveToMapCenter(e.config.bounds)
                        }, !1);
                        var i = e.eventCB = {zoomchange: [], centerchange: []};
                        t.addListener(e.map, "zoomchange", function () {
                            i.zoomchange && i.zoomchange.forEach(function (t) {
                                setTimeout(t, 200)
                            })
                        }), t.addListener(e.map, "centerchange", function () {
                            i.centerchange && i.centerchange.forEach(function (t) {
                                t(e.map.getCenter())
                            })
                        })
                    }, initShowUser: function (t) {
                        var e = this;
                        if (t = t ? o.extend(!0, this.config.user, t) : this.config.user, t.deviceorientation) {
                            t.icon = {origin: [26, 2], size: [20, 25], anchor: [10, 16]};
                            var n, i = o.throttleAni(function (i) {
                                (e.userMarker.getVisible() && n || (n = e.ele.querySelector('div[title="user_9527"]'))) && (n.style.webkitTransformOrigin = n.style.transformOrigin = "10px 15px 0px", n.style.webkitTransform = n.style.transform = "rotate(" + (-i.alpha - (t.angleOffset || 0)) + "deg) translateZ(0)")
                            }, 120, 400);
                            window.addEventListener("deviceorientation", i)
                        }
                        this.userMarker = this.createMarker(t), this.watchPosition("user", t.time, t.cb)
                    }, initShowStart: function (t) {
                        t = t ? o.extend(!0, this.config.start, t) : this.config.start, this.startMarker = this.createMarker(t)
                    }, initShowEnd: function (t) {
                        t = t ? o.extend(!0, this.config.end, t) : this.config.end, this.endMarker = this.createMarker(t)
                    }, initShowCar: function (t) {
                        var n = this;
                        t = t ? o.extend(!0, this.config.car, t) : this.config.car, this.carMarker = this.createMarker(t), t.tip && (this.carTipMarker = n.setTip("car", {
                            cls: t.tipClass,
                            center: t.center,
                            offset: e.config.car && e.config.car.tipOffset,
                            zIndex: 10
                        })), n.moveToMapCenter(n.config.bounds)
                    }, setVisible: function (e, n) {
                        var i = e + "Marker";
                        return this[i] && t.setMarkerVisible(this[i], n), this
                    }, setPosition: function (t, e, n) {
                        var i = t + "Marker";
                        return this[i] && this[i].setPosition(this.latLngToPos(e)), n && n(), this
                    }, setBounds: function (t) {
                        return this.config.bounds = t[1] ? t : [t[0], t[0]], this
                    }, setTip: function (n, i) {
                        var r = this, a = i.type ? n + i.type : n, s = this.tips[a];
                        return i.content && (i.content = '<div class="pos-info-tip ' + r.maptype + " " + n + " " + (i.cls ? i.cls : "") + '">' + (i.content || "") + "</div>"), s ? (i.content && s.setContent(i.content), i.center && s.setPosition(r.latLngToPos(i.center)), i.offset && s._setOffset(i.offset)) : (i.center = i.center && r.latLngToPos(i.center) || r.getPosition(n), s = r.tips[a] = t.setTip(r.map, o.extend({
                            offset: e.config[n] && e.config[n].tipOffset,
                            title: n + "_tip_9527"
                        }, i)), s.remove = function () {
                            s.setMap(null)
                        }), s
                    }, setMarkerAngle: function (e, n) {
                        var i = e + "Marker";
                        return this[i] && t.setMarkerAngle(e, n, this[i]), this
                    }, setLabel: function (e, n) {
                        return null === n ? t.setLabel(e, n) : t.setLabel(this.map, e)
                    }, setLines: function (e, n) {
                        return n ? t.setLines(this.map, e, n) : (e.setVisible(!1), e.setMap(null))
                    }, setZoom: function (t) {
                        this.map.setZoom(t || 17)
                    }, getZoom: function () {
                        return this.map.getZoom()
                    }, getPosition: function (t) {
                        if ("map" === t)return this.map.getCenter();
                        var e = t + "Marker";
                        return this[e] && this[e].getPosition() || this.config.center
                    }, getMapInfo: function (e) {
                        var n = this;
                        return t.getMapInfo(o.extend(!0, {ele: n.config.ele}, e))
                    }, convertGPSLatLngToPos: function (e, n) {
                        return t.convertorGeolocationPos(e, "gps", n), this
                    }, addMapEventListener: function (t, e) {
                        return this.eventCB[t] && this.eventCB[t].push(e), this
                    }, addMapInstanceListener: function (e, n, i) {
                        return t.addListener(e, n, i)
                    }, removeMapInstanceListener: function (e) {
                        t.removeListener(e)
                    }, watchPosition: function (t, e, n) {
                        var o = this;
                        i.watchPosition(function (e) {
                            o.setPosition(t, e), setTimeout(n, 500)
                        }, e)
                    }, posToLatLng: function (t) {
                        return [t.getLat(), t.getLng()]
                    }, latLngToPos: function (e) {
                        return t.latLngToPos(e)
                    }, createMarker: function (e) {
                        var n = this, i = o.extend(!0, {
                            url: n.config.markerUrl,
                            anchor: [12, 36],
                            size: [24, 36],
                            origin: [0, 0],
                            scaleSize: [102, 36]
                        }, e.icon), r = o.extend(!0, {
                            map: n.map,
                            position: e.center && n.latLngToPos(e.center) || n.config.map.center
                        }, e.marker);
                        return t.createMarker(r, i)
                    }, moveToMapCenter: function (t, e) {
                        var n, i;
                        return t = t || [], t.lat && t.lng ? (this.map.panTo(t), this) : t[0] || t[1] ? t[1] && t[0] !== t[1] || !(n = this.getPosition(t[0])) ? (n = this.getPosition(t[0]), i = this.getPosition(t[1]), n && i ? n.equals(i) ? this.moveToMapCenter(n, e) : this.fitBounds(this.posToLatLng(n), this.posToLatLng(i), e) : this) : n && this.map.panTo(n) : this.moveToMapCenter(this.config.bounds, e)
                    }, clearMarker: function (t) {
                        var e = t + "Marker";
                        return this[e] && this[e].setMap(null), this
                    }, moveTo: function (e, n, i) {
                        var o, r, a, s, c;
                        return (a = this[e + "Marker"]) && (o = this.getPosition(e), s = this.latLngToPos(n), r = this.posToLatLng(o), i = i || this.config.aniTime, c = Math.atan2(n[0] - r[0], n[1] - r[1]), this.setMarkerAngle(e, c), t.moveTo(e, o, s, i, this.map.getZoom(), c, a, this[e + "TipMarker"])), this
                    }, moveCarWithPop: function (t, e, n) {
                        return e = e || "<span><em>" + t.distance + "</em>公里 <em>" + t.time + "</em>分钟</span>", this.setVisible("carTip", !0), this.setTip("car", {
                            content: e,
                            cls: t.cls,
                            offset: t.tipOffset
                        }), this.moveTo("car", [t.lat, t.lng], n), this
                    }, fitBounds: function (e, n, i) {
                        var o, r = e[0], a = n[0], s = e[1], c = n[1];
                        r >= a && s >= c ? (o = r, r = a, a = o, o = s, s = c, c = o) : a > r && c > s || (r > a ? (o = r, r = a, a = o) : (o = s, s = c, c = o)), i = i || this.config.boundsOffset || 0;
                        var l, p;
                        return 2 === i.length ? (l = this.latLngToPos([r - i[0], s - i[0]]), p = this.latLngToPos([a + i[1], c + i[1]])) : 4 === i.length ? (l = this.latLngToPos([r - i[0], s - i[1]]), p = this.latLngToPos([a + i[2], c + i[3]])) : (l = this.latLngToPos([r - i, s - i]), p = this.latLngToPos([a + i, c + i])), t.fitBounds(this.map, [l, p]), this
                    }, renderDrivingStartToEnd: function (e) {
                        var n = this.getPosition("start"), i = this.getPosition("end");
                        n && i && t.renderDrivingA2B(this.map, n, i, function () {
                            e && setTimeout(e, 300)
                        })
                    }, distroy: function () {
                        i.clearWatch(), t.distroy()
                    }
                })
            }

            var o = t("/src/scripts/lib/utils.js"), r = t("/src/scripts/lib/MapAPI.js");
            n.exports = function (t, e) {
                r(t, function (t, n) {
                    e(o.extend(!0, i(t), n))
                })
            }
        }
    }, t.__M__.srcscriptslibMapWebappjs = {
        path: "/src/scripts/lib/MapWebapp.js", fn: function (t, e, n) {
            var i, o = t("/src/scripts/lib/utils.js"), r = t("/src/scripts/lib/WebMap.js");
            n.exports = function (t) {
                var e = function (t) {
                    this.config = o.extend(!0, i.config, t), this.config.map.center = i.latLngToPos(t.map.center), this.tips = [], this.nearCars = [], this._init(this.config)
                };
                return r(t, function (t) {
                    i = t, o.inheritClass(i, e), o.extend(e.prototype, {
                        version: "1.1.2", selectStartModel: function (t) {
                            var e = this;
                            mapContainerEle = this.config.ele;
                            var n = document.createElement("div");
                            n.className = "select-start-model-startmarker";
                            var i = document.createElement("div");
                            i.className = "select-start-model-starttip show";
                            var o = document.createElement("p");
                            o.innerHTML = t.defaultTip || '<img src="/a/images/rule-loading.gif" style="width: 33px;height: 7px;vertical-align: middle;"></img>', i.appendChild(o), mapContainerEle.appendChild(n), mapContainerEle.appendChild(i);
                            var r, a, s;
                            mapContainerEle.addEventListener("touchstart", function (e) {
                                var n = e.changedTouches[0];
                                a = n.clientX, s = n.clientY, r = o.innerHTML, i.classList.remove("show"), t.startTouch && t.startTouch(e)
                            }, !1), mapContainerEle.addEventListener("touchend", function (n) {
                                var o = n.changedTouches[0];
                                o.clientX === a && o.clientY === s && e.setRecommendPosLabelContent(r), i.classList.add("show"), t.endTouch && t.endTouch(n)
                            }, !1);
                            e.setRecommendPosLabelContent = function (t) {
                                o.innerHTML = t
                            }, e.recommendPosCB = t.success || function () {
                            }, e.recommendPosIsNotClicked = !0, this.addMapEventListener("centerchange", function (t) {
                                if (!e.recommendPosIsNotClicked)return e.recommendPosIsNotClicked = !0;
                                var n = e.getPosition("map"), i = n.lng, o = n.lat;
                                try {
                                    for (var r in e.setRecommendPosLabelList) {
                                        var a = e.setRecommendPosLabelList[r], s = a.getPosition(), c = i - s.lng, l = o - s.lat;
                                        if (1e-7 > c * c + l * l)return a.__clickHandler({target: a}, !0)
                                    }
                                } catch (p) {
                                }
                                e.recommendPosCB(t)
                            })
                        }, setRecommendPos: function (t) {
                            var e = this;
                            e.setRecommendPosLabelList && e.setRecommendPosLabelList.forEach(function (t) {
                                e.removeMapInstanceListener(t.__eventListener), t.remove()
                            }), e.setRecommendPosLabelList = [];
                            for (var n in t) {
                                var i = t[n], r = e.latLngToPos([+i.lat, +i.lng]), a = e.setPosLabel(r, i.displayname);
                                a.__posInfo = i, function (t) {
                                    var n = function (n, i) {
                                        e.recommendPosIsNotClicked = !!i, e.moveToMapCenter(t), e.recommendPosCB(n.target.__posInfo, !0)
                                    };
                                    a.__clickHandler = e.config.movefast ? n : o.throttle(n, 120), a.__eventListener = e.addMapInstanceListener(a, "click", a.__clickHandler)
                                }(r), e.setRecommendPosLabelList.push(a)
                            }
                        }, setPosLabel: function (t, e) {
                            var n = this, i = n.setLabel({
                                position: t,
                                offset: [10, -6],
                                content: e,
                                title: "map-recommend-point"
                            });
                            return i.remove = function () {
                                n.setLabel(i, null)
                            }, i
                        }, setLineA2B: function (t) {
                            var e = this;
                            return {
                                line: e.setLines(t, {
                                    color: "#27c89e",
                                    opacity: .9,
                                    weight: 2,
                                    style: "dash",
                                    dashArray: [10, 8]
                                }), remove: function () {
                                    return e.setLines(this.line, null), !1
                                }
                            }
                        }, setStart2UserDashLine: function (t) {
                            this.start2UserDashLine && this.start2UserDashLine.remove(), this.start2UserDashLine = t && this.setLineA2B([this.getPosition("user"), this.getPosition("map")])
                        }, setRadar: function (t, e) {
                            var n = this;
                            e = o.extend(!0, {width: 300}, e);
                            var i = n.setLabel({
                                center: n.getPosition("start"),
                                offset: [0, 0],
                                title: "m-radar",
                                zIndex: 10,
                                content: '<div class="m-radar" style="position:absolute; top: -' + e.width + "px; left: -" + e.width + "px; width:" + 2 * e.width + "px; height:" + 2 * e.width + 'px;"><canvas class="m-radar-stage"></canvas><canvas class="m-radar-scanner"></canvas></div>'
                            }), r = setTimeout(function () {
                                o.drawRadar(".m-map .m-radar", e.width)
                            }, 1e3), a = function () {
                                var t;
                                if (t = n.config.ele.querySelector(".m-radar")) {
                                    var e = n.map.getZoom() - 13;
                                    t.style.webkitTransform = t.style.transform = "scale(" + (0 > e ? .1 : 2.6 * e) / 10 + ")", i.setPosition(n.getPosition("start"))
                                }
                            };
                            return n.eventCB.zoomchange.push(a), i.remove = function () {
                                clearTimeout(r), n.eventCB.zoomchange.self.setLabel(i, null)
                            }, i
                        }, setNearCars: function (t) {
                            for (var e = this, n = 0, i = t.length; i > n; n++) {
                                var r = t[n];
                                e.nearCars.push(e.createMarker(o.extend(!0, {}, e.config.car, {
                                    show: !0,
                                    tip: !1,
                                    center: [r.lat, r.lng],
                                    marker: {title: "near-car", clickable: !1, visible: !0}
                                })))
                            }
                            return {
                                clean: function () {
                                    for (var t = 0, n = e.nearCars.length; n > t; t++)e.nearCars[t].setMap(null), delete e.nearCars[t];
                                    e.nearCars = []
                                }
                            }
                        }
                    })
                }), e.createMap = function (n, i) {
                    var o = this.supperClass.getMapInfo({ele: n.ele, protocol: location.protocol});
                    window[t + "LoadInit"] = function () {
                        n.maptype = t, i && i(new e(n));
                        var r = setInterval(function () {
                            o.cb() && clearInterval(r)
                        }, 500)
                    };
                    var r = document.createElement("script");
                    r.type = "text/javascript", r.src = o.src;
                    var a = 0;
                    r.onerror = function () {
                        document.body.removeChild(r), ++a < 3 && (document.body.appendChild(r), console.warn("map api is not stable, Map Webapp try again", a))
                    }, document.body.appendChild(r)
                }, e
            }
        }
    }, t.__M__.srcscriptsmapwebappjs = {
        path: "/src/scripts/mapwebapp.js", fn: function (t) {
            window.MapWebapp = t("/src/scripts/lib/MapWebapp.js")
        }
    }, n("/src/scripts/mapwebapp.js")
}(this);