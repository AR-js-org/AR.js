import * as AFRAME from 'aframe';
import Profile from '../../three.js/src/threex/arjs-profile';
import Session from '../../three.js/src/new-api/arjs-session-nft';
import { SessionDebugUI } from '../../three.js/src/new-api/arjs-debugui';

AFRAME.registerSystem('arjs', {
    schema: {
        trackingMethod: {
            type: 'string',
            default: 'best',
        },
        debugUIEnabled: {
            type: 'boolean',
            default: false,
        },
        areaLearningButton: {
            type: 'boolean',
            default: true,
        },
        performanceProfile: {
            type: 'string',
            default: 'default',
        },
        labelingMode: {
            type: 'string',
            default: '',
        },
        // new video texture mode (location based only)
        videoTexture: {
            type: 'boolean',
            default: false
        },
        // old parameters
        debug: {
            type: 'boolean',
            default: false
        },
        detectionMode: {
            type: 'string',
            default: '',
        },
        matrixCodeType: {
            type: 'string',
            default: '',
        },
        patternRatio: {
            type: 'number',
            default: -1,
        },
        cameraParametersUrl: {
            type: 'string',
            default: '',
        },
        maxDetectionRate: {
            type: 'number',
            default: -1
        },
        sourceType: {
            type: 'string',
            default: '',
        },
        sourceUrl: {
            type: 'string',
            default: '',
        },
        sourceWidth: {
            type: 'number',
            default: -1
        },
        sourceHeight: {
            type: 'number',
            default: -1
        },
        deviceId: {
            type: 'string',
            default: ''
        },
        displayWidth: {
            type: 'number',
            default: -1
        },
        displayHeight: {
            type: 'number',
            default: -1
        },
        canvasWidth: {
            type: 'number',
            default: -1
        },
        canvasHeight: {
            type: 'number',
            default: -1
        },
        errorPopup: {
            type: 'string',
            default: ''
        }
    },

    //////////////////////////////////////////////////////////////////////////////
    //		Code Separator
    //////////////////////////////////////////////////////////////////////////////

    init: function () {
        var _this = this

        // If videoTexture is set, skip the remainder of the setup entirely and just use the arjs-webcam-texture component
        if(this.data.videoTexture === true && this.data.sourceType === 'webcam') {
            var webcamEntity = document.createElement("a-entity");
            webcamEntity.setAttribute("arjs-webcam-texture", true);
            this.el.sceneEl.appendChild(webcamEntity);
            return;
        }

        //////////////////////////////////////////////////////////////////////////////
        //		setup arProfile
        //////////////////////////////////////////////////////////////////////////////

        var arProfile = this._arProfile = new Profile()
            .trackingMethod(this.data.trackingMethod)
            .performance(this.data.performanceProfile)
            .defaultMarker()

        //////////////////////////////////////////////////////////////////////////////
        //		honor this.data and setup arProfile with it
        //////////////////////////////////////////////////////////////////////////////

        // honor this.data and push what has been modified into arProfile
        if (this.data.debug !== false) arProfile.contextParameters.debug = this.data.debug
        if (this.data.detectionMode !== '') arProfile.contextParameters.detectionMode = this.data.detectionMode
        if (this.data.matrixCodeType !== '') arProfile.contextParameters.matrixCodeType = this.data.matrixCodeType
        if (this.data.patternRatio !== -1) arProfile.contextParameters.patternRatio = this.data.patternRatio
        if (this.data.labelingMode !== '') arProfile.contextParameters.labelingMode = this.data.labelingMode
        if (this.data.cameraParametersUrl !== '') arProfile.contextParameters.cameraParametersUrl = this.data.cameraParametersUrl
        if (this.data.maxDetectionRate !== -1) arProfile.contextParameters.maxDetectionRate = this.data.maxDetectionRate
        if (this.data.canvasWidth !== -1) arProfile.contextParameters.canvasWidth = this.data.canvasWidth
        if (this.data.canvasHeight !== -1) arProfile.contextParameters.canvasHeight = this.data.canvasHeight

        if (this.data.sourceType !== '') arProfile.sourceParameters.sourceType = this.data.sourceType
        if (this.data.sourceUrl !== '') arProfile.sourceParameters.sourceUrl = this.data.sourceUrl
        if (this.data.sourceWidth !== -1) arProfile.sourceParameters.sourceWidth = this.data.sourceWidth
        if (this.data.sourceHeight !== -1) arProfile.sourceParameters.sourceHeight = this.data.sourceHeight
        if (this.data.deviceId !== '') arProfile.sourceParameters.deviceId = this.data.deviceId
        if (this.data.displayWidth !== -1) arProfile.sourceParameters.displayWidth = this.data.displayWidth
        if (this.data.displayHeight !== -1) arProfile.sourceParameters.displayHeight = this.data.displayHeight

        arProfile.checkIfValid()

        //////////////////////////////////////////////////////////////////////////////
        //		Code Separator
        //////////////////////////////////////////////////////////////////////////////

        this._arSession = null

        _this.isReady = false
        _this.needsOverride = true

        // wait until the renderer is isReady
        this.el.sceneEl.addEventListener('renderstart', function () {
            var scene = _this.el.sceneEl.object3D
            var camera = _this.el.sceneEl.camera
            var renderer = _this.el.sceneEl.renderer

            //////////////////////////////////////////////////////////////////////////////
            //		build ARjs.Session
            //////////////////////////////////////////////////////////////////////////////
            var arSession = _this._arSession = new Session({
                scene: scene,
                renderer: renderer,
                camera: camera,
                sourceParameters: arProfile.sourceParameters,
                contextParameters: arProfile.contextParameters
            })

            //////////////////////////////////////////////////////////////////////////////
            //		Code Separator
            //////////////////////////////////////////////////////////////////////////////

            _this.isReady = true

            //////////////////////////////////////////////////////////////////////////////
            //		awful resize trick
            //////////////////////////////////////////////////////////////////////////////
            // KLUDGE
            window.addEventListener('resize', onResize)
            function onResize() {
                var arSource = _this._arSession.arSource

                // ugly kludge to get resize on aframe... not even sure it works
                if (arProfile.contextParameters.trackingBackend !== 'tango') {
                    arSource.copyElementSizeTo(document.body)
                }

                // fixing a-frame css
                var buttonElement = document.querySelector('.a-enter-vr')
                if (buttonElement) {
                    buttonElement.style.position = 'fixed'
                }
            }

            //////////////////////////////////////////////////////////////////////////////
            //		honor .debugUIEnabled
            //////////////////////////////////////////////////////////////////////////////
            if (_this.data.debugUIEnabled) initDebugUI()
            function initDebugUI() {
                // get or create containerElement
                var containerElement = document.querySelector('#arjsDebugUIContainer')
                if (containerElement === null) {
                    containerElement = document.createElement('div')
                    containerElement.id = 'arjsDebugUIContainer'
                    containerElement.setAttribute('style', 'position: fixed; bottom: 10px; width:100%; text-align: center; z-index: 1;color: grey;')
                    document.body.appendChild(containerElement)
                }

                // create sessionDebugUI
                var sessionDebugUI = new SessionDebugUI(arSession)
                containerElement.appendChild(sessionDebugUI.domElement)
            }
        })

        //////////////////////////////////////////////////////////////////////////////
        //		Code Separator
        //////////////////////////////////////////////////////////////////////////////
        // TODO this is crappy - code an exponential backoff - max 1 seconds
        // KLUDGE: kludge to write a 'resize' event
        // var startedAt = Date.now()
        // var timerId = setInterval(function () {
        //     if (Date.now() - startedAt > 10000 * 1000) {
        //         clearInterval(timerId)
        //         return
        //     }
        //     // onResize()
        //     window.dispatchEvent(new Event('resize'));
        // }, 1000 / 30)

        function setBackoff(func, millisDuration = Infinity, limit = 1000) {
            if(func == null || !(Object.prototype.toString.call(func) == '[object Function]')) {
                return;
            } 
            let backoff = 33.3
            let start = Date.now()
            let repeat = function() {
              return (millisDuration == Infinity || (Date.now() - start) < millisDuration)
            }
            let next = function() {
                backoff = (backoff * 2) < limit ? (backoff * 2) : limit
                setTimeout(function() {
                    func()
                    if(repeat()) {
                        next()
                    }
                }, backoff)
            };
            next()
        }

        setBackoff(() => {
            window.dispatchEvent(new Event('resize'))
        })
    },

    tick: function () {
        // skip it if not yet isInitialised
        if (this.isReady === false || this.data.videoTexture === true) return

        // update arSession
        this._arSession.update()

        // copy projection matrix to camera
        this._arSession.onResize()
    },

    _displayErrorPopup: function(msg) {
        if (this.data.errorPopup !== '') {
            let errorPopup = document.getElementById(this.data.errorPopup);
            if (!errorPopup) {
                errorPopup = document.createElement('div');
                errorPopup.setAttribute('id', this.data.errorPopup);
                document.body.appendChild(errorPopup);
            }
            errorPopup.innerHTML = msg;
        } else {
            alert(msg);
        }
    }
})
