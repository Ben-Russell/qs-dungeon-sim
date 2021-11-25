/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = self["webpackHotUpdate"];
/******/ 	self["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		importScripts(__webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "3bd912e97fc37e7a0350";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_selfInvalidated: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 			invalidate: function() {
/******/ 				this._selfInvalidated = true;
/******/ 				switch (hotStatus) {
/******/ 					case "idle":
/******/ 						hotUpdate = {};
/******/ 						hotUpdate[moduleId] = modules[moduleId];
/******/ 						hotSetStatus("ready");
/******/ 						break;
/******/ 					case "ready":
/******/ 						hotApplyInvalidatedModule(moduleId);
/******/ 						break;
/******/ 					case "prepare":
/******/ 					case "check":
/******/ 					case "dispose":
/******/ 					case "apply":
/******/ 						(hotQueuedInvalidatedModules =
/******/ 							hotQueuedInvalidatedModules || []).push(moduleId);
/******/ 						break;
/******/ 					default:
/******/ 						// ignore requests in error states
/******/ 						break;
/******/ 				}
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash, hotQueuedInvalidatedModules;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus(hotApplyInvalidatedModules() ? "ready" : "idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 		return hotApplyInternal(options);
/******/ 	}
/******/
/******/ 	function hotApplyInternal(options) {
/******/ 		hotApplyInvalidatedModules();
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (
/******/ 					!module ||
/******/ 					(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 				)
/******/ 					continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire &&
/******/ 				// when called invalidate self-accepting is not possible
/******/ 				!installedModules[moduleId].hot._selfInvalidated
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					parents: installedModules[moduleId].parents.slice(),
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		if (hotUpdateNewHash !== undefined) {
/******/ 			hotCurrentHash = hotUpdateNewHash;
/******/ 			hotUpdateNewHash = undefined;
/******/ 		}
/******/ 		hotUpdate = undefined;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = item.parents;
/******/ 			hotCurrentChildModule = moduleId;
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			return hotApplyInternal(options).then(function(list) {
/******/ 				outdatedModules.forEach(function(moduleId) {
/******/ 					if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 				});
/******/ 				return list;
/******/ 			});
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModules() {
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			if (!hotUpdate) hotUpdate = {};
/******/ 			hotQueuedInvalidatedModules.forEach(hotApplyInvalidatedModule);
/******/ 			hotQueuedInvalidatedModules = undefined;
/******/ 			return true;
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModule(moduleId) {
/******/ 		if (!Object.prototype.hasOwnProperty.call(hotUpdate, moduleId))
/******/ 			hotUpdate[moduleId] = modules[moduleId];
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sim_Sim__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

onmessage = function (e) {
    console.log('Message received from main script');
    console.log('worker data', e.data);
    if (e.data.type === "startSim") {
        var simResult = runSim(e.data.fighters, e.data.fightergears, e.data.simType, e.data.simLevel);
    }
};
var runSim = function (fighters, fightergears, simType, simLevel) {
    var sim = new _sim_Sim__WEBPACK_IMPORTED_MODULE_0__["Sim"](fighters, fightergears, simType, simLevel);
    sim.Start();
    console.log('sim results');
    postMessage({
        type: "simResults",
        results: {
            wins: sim.Wins,
            losses: sim.Losses,
            winrate: sim.Winrate
        }
    });
};


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sim", function() { return Sim; });
/* harmony import */ var _Fighter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _datamodels_fighter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _Monster__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);
/* harmony import */ var _RNG__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5);





var Sim = /** @class */ (function () {
    function Sim(fighterdata, fightergears, simType, dungeonlevel) {
        var _this = this;
        this.Fighters = [];
        this.Fightergears = [];
        this.Monsters = [];
        this.HitOrder = [];
        this.RoundCounts = [];
        this.Wins = 0;
        this.Losses = 0;
        this.SimCount = 0;
        this.Winrate = 0;
        this.Time = 0;
        this.SimType = simType;
        this.Fightergears = fightergears;
        fighterdata.forEach(function (fdata) {
            var item = null;
            if (fdata.item_id !== null && typeof fdata.item_id !== "undefined") {
                item = _this.Fightergears[fdata.item_id];
            }
            if (_this.IsCave()) {
                fdata.type = _datamodels_fighter__WEBPACK_IMPORTED_MODULE_1__["FighterClasses"].CaveFighter;
            }
            _this.Fighters.push(new _Fighter__WEBPACK_IMPORTED_MODULE_0__["Fighter"](fdata, item));
        });
        this.DungeonLevel = dungeonlevel;
        if (this.IsCave()) {
            this.DungeonLevel *= 100;
            this.DungeonLevel += 50;
        }
    }
    Sim.prototype.Battle = function () {
        this.Round();
        var rcount = 1;
        var isbattleover = this.IsBattleOver();
        while (!isbattleover) {
            this.Round();
            rcount++;
            isbattleover = this.IsBattleOver();
            if (rcount >= 150) {
                isbattleover = true;
                this.Losses++;
            }
        }
        this.RoundCounts.push(rcount);
        // console.log(rcount);
    };
    Sim.prototype.CountAlive = function () {
        var fcount = this.Fighters.filter(function (f) { return f.Health > 0; }).length;
        var mcount = this.Monsters.filter(function (m) { return m.Health > 0; }).length;
        return [fcount, mcount];
    };
    Sim.prototype.CreateMonsters = function () {
        var mcount = 1;
        if (this.DungeonLevel < 51) {
            mcount = 1;
        }
        else if (this.DungeonLevel < 101) {
            mcount = 2;
        }
        else if (this.DungeonLevel < 151) {
            mcount = 3;
        }
        else if (this.DungeonLevel < 201) {
            mcount = 4;
        }
        else if (this.DungeonLevel < 251) {
            mcount = 5;
        }
        else {
            mcount = 6;
        }
        for (var i = 0; i < mcount; i++) {
            var m = new _Monster__WEBPACK_IMPORTED_MODULE_2__["Monster"](this.DungeonLevel - i * 25);
            this.Monsters.push(m);
        }
    };
    Sim.prototype.IsBattleOver = function () {
        var alive = this.CountAlive();
        // [fcount, mcount]
        //console.log(alive);
        if (alive[0] > 0) {
            if (alive[1] > 0) {
                return false;
            }
            this.Wins++;
        }
        else {
            this.Losses++;
        }
        return true;
    };
    Sim.prototype.IsCave = function () {
        return this.SimType === "cave";
    };
    Sim.prototype.IsDungeon = function () {
        return this.SimType === "dungeon";
    };
    Sim.prototype.Ready = function () {
        var hitorder = [];
        this.HitOrder = hitorder.concat(this.Fighters, this.Monsters);
        this.HitOrder.sort(function (a, b) { return b.Hit - a.Hit; });
    };
    Sim.prototype.Reset = function () {
        var _this = this;
        this.HitOrder.forEach(function (f) {
            if (_this.IsDungeon() || f.Type === _datamodels_fighter__WEBPACK_IMPORTED_MODULE_1__["FighterClasses"].Monster) {
                f.Health = f.MHealth;
            }
            f.CritCount = 0;
        });
    };
    Sim.prototype.Round = function () {
        var _this = this;
        this.HitOrder.forEach(function (f) {
            if (f.Health <= 0) {
                return;
            }
            if (f.Type === _datamodels_fighter__WEBPACK_IMPORTED_MODULE_1__["FighterClasses"].Knight) {
                // Knights can't attack.
                return;
            }
            if (f.StunCount > 0) {
                f.StunCount--;
                return;
            }
            var targets = f.SelectTargets(_this.Fighters, _this.Monsters);
            if (targets.length === 0 ||
                targets[0] === null ||
                typeof targets[0] === "undefined") {
                // Failed to find any valid targets
                return;
            }
            if (f.Type === _datamodels_fighter__WEBPACK_IMPORTED_MODULE_1__["FighterClasses"].Healer) {
                targets.forEach(function (t) {
                    if (t !== null) {
                        t.TakeHeal(f);
                    }
                });
            }
            else {
                targets.forEach(function (t) {
                    if (t !== null) {
                        t.TakeAttack(f);
                    }
                });
            }
            if (f.Type === _datamodels_fighter__WEBPACK_IMPORTED_MODULE_1__["FighterClasses"].Priest && _RNG__WEBPACK_IMPORTED_MODULE_4__["default"].RollChance(10)) {
                var dead = _this.Fighters.filter(function (tf) {
                    if (tf.Health <= 0) {
                        return true;
                    }
                    return false;
                });
                if (dead.length > 0) {
                    var rez = dead[Math.floor(Math.random() * dead.length)];
                    rez.Health = rez.MHealth;
                    //  console.log('rezzed', rez, f);
                }
            }
        });
        // Round healing seems to be at the end
        this.Fighters.forEach(function (f) {
            if (f.RoundHealing > 0 && f.Health > 0) {
                f.Health += f.RoundHealing;
                f.Health = Math.min(f.Health, f.MHealth);
            }
        });
        /*    console.log(
            JSON.parse(JSON.stringify(this.Fighters)),
            JSON.parse(JSON.stringify(this.Monsters))
        );
        */
    };
    Sim.prototype.Sim = function () {
        var start = Date.now();
        while (this.SimCount < _config__WEBPACK_IMPORTED_MODULE_3__["config"].iterations) {
            this.Reset();
            this.Battle();
            this.SimCount++;
        }
        var end = Date.now();
        this.Time = end - start;
    };
    Sim.prototype.Start = function () {
        this.CreateMonsters();
        this.Ready();
        this.Sim();
        this.Winrate =
            Math.round((this.Wins / this.SimCount) * 1000000) / 10000;
        console.log("Sim Ended: " + this.Time + " milliseconds", this);
    };
    return Sim;
}());



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Fighter", function() { return Fighter; });
/* harmony import */ var _datamodels_fighter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _RNG__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);



var Fighter = /** @class */ (function () {
    function Fighter(data, item) {
        if (item === void 0) { item = null; }
        this.Health = 200;
        this.MHealth = 500;
        this.Defense = 25;
        this.Damage = 100;
        this.CritDamage = 0;
        this.Hit = 50;
        this.Dodge = 50;
        this.BlockRate = 0.4;
        this.BlockChance = 0;
        this.RoundHealing = 0;
        this.AllAttributes = 0;
        this.Lookup = 0;
        this.Type = 0;
        this.Item = null;
        this.CritCount = 0;
        this.StunCount = 0;
        this.Data = data;
        this.Type = this.Data.type;
        if (item !== null) {
            this.Item = item;
        }
        if (this.Type !== _datamodels_fighter__WEBPACK_IMPORTED_MODULE_0__["FighterClasses"].Monster) {
            this.LoadData();
        }
    }
    Fighter.prototype.LoadData = function () {
        var _this = this;
        Object.keys(this.Data).forEach(function (stat) {
            var value = Math.max(0, _this.Data[stat]);
            switch (stat) {
                case "health":
                    _this.Health =
                        250 + _config__WEBPACK_IMPORTED_MODULE_1__["config"].uniqueMultiplier * (value * 100 + 400);
                    break;
                case "defense":
                    _this.Defense =
                        20 + _config__WEBPACK_IMPORTED_MODULE_1__["config"].uniqueMultiplier * (value * 10 + 15);
                    break;
                case "damage":
                    _this.Damage =
                        50 + _config__WEBPACK_IMPORTED_MODULE_1__["config"].uniqueMultiplier * (value * 25 + 75);
                    break;
                case "critdamage":
                    _this.CritDamage = _config__WEBPACK_IMPORTED_MODULE_1__["config"].uniqueMultiplier * (value * 0.25);
                    break;
                case "hit":
                    _this.Hit = 100 + _config__WEBPACK_IMPORTED_MODULE_1__["config"].uniqueMultiplier * (value * 50);
                    if (_this.Type === _datamodels_fighter__WEBPACK_IMPORTED_MODULE_0__["FighterClasses"].Cavalry) {
                        _this.Hit *= 2;
                    }
                    break;
                case "dodge":
                    _this.Dodge = 100 + _config__WEBPACK_IMPORTED_MODULE_1__["config"].uniqueMultiplier * (value * 50);
                    break;
            }
        });
        if (this.Type === _datamodels_fighter__WEBPACK_IMPORTED_MODULE_0__["FighterClasses"].Knight) {
            this.BlockRate = 0.4;
        }
        if (this.Item !== null) {
            //   console.log(this.Item);
            this.Health += this.Item.health + this.Item.all_attributes;
            this.Defense += this.Item.defense + this.Item.all_attributes;
            this.Damage += this.Item.damage + this.Item.all_attributes;
            this.CritDamage += this.Item.crit_damage;
            this.Hit += this.Item.hit + this.Item.all_attributes;
            this.Dodge += this.Item.dodge + this.Item.all_attributes;
            this.BlockChance += this.Item.block;
            this.RoundHealing += this.Item.round_healing;
        }
        // Todo handle items
        this.MHealth = this.Health;
    };
    Fighter.prototype.SelectTargets = function (fighters, monsters) {
        var _a, _b;
        switch (this.Type) {
            case _datamodels_fighter__WEBPACK_IMPORTED_MODULE_0__["FighterClasses"].Monster:
                return [
                    (_a = fighters.find(function (tf) {
                        if (tf.Health > 0) {
                            return true;
                        }
                        return false;
                    })) !== null && _a !== void 0 ? _a : null
                ];
                break;
            case _datamodels_fighter__WEBPACK_IMPORTED_MODULE_0__["FighterClasses"].Healer:
                return [
                    fighters.reduce(function (lowest, tf) {
                        if (tf.Health <= 0) {
                            return null;
                        }
                        if (lowest === null) {
                            return tf;
                        }
                        if (lowest.MHealth / lowest.Health <
                            tf.MHealth / tf.Health) {
                            return tf;
                        }
                        return lowest;
                    }, null)
                ];
                break;
            case _datamodels_fighter__WEBPACK_IMPORTED_MODULE_0__["FighterClasses"].Assassin:
                var reorder = [];
                if (monsters.length > 3) {
                    reorder.push(monsters.slice(3));
                }
                reorder.push(monsters.slice(0, 3));
                //console.log(reorder.flat());
                return [
                    reorder.flat().find(function (tf) {
                        if (tf.Health > 0) {
                            return true;
                        }
                        return false;
                    })
                ];
                break;
            default:
                return [
                    (_b = monsters.find(function (tf) {
                        if (tf.Health > 0) {
                            return true;
                        }
                        return false;
                    })) !== null && _b !== void 0 ? _b : null
                ];
                break;
        }
    };
    Fighter.prototype.TakeAttack = function (attacker) {
        var hitChance = (100 * attacker.Hit) / (attacker.Hit + this.Dodge);
        /*
        console.log(
            "Attacker",
            attacker.Type,
            "Defender",
            this.Type,
            "HitChance",
            hitChance
        );
        */
        var isHit = _RNG__WEBPACK_IMPORTED_MODULE_2__["default"].RollChance(hitChance);
        var damage = attacker.Damage;
        if (isHit) {
            attacker.CritCount++;
            var isCrit = attacker.CritCount >= 10;
            if (isCrit) {
                attacker.CritCount = 0;
                damage *= 1 + attacker.CritDamage / 100;
            }
            damage = Math.max(0, damage - this.Defense);
            var blockrate = 0;
            if (this.Type === _datamodels_fighter__WEBPACK_IMPORTED_MODULE_0__["FighterClasses"].Knight) {
                blockrate += this.BlockRate;
            }
            if (_RNG__WEBPACK_IMPORTED_MODULE_2__["default"].RollChance(this.BlockChance * 100)) {
                blockrate += this.BlockRate;
            }
            damage *= 1 - blockrate;
            if (attacker.Type === _datamodels_fighter__WEBPACK_IMPORTED_MODULE_0__["FighterClasses"].Warrior) {
                // Special Warrior
                var stunHit = _RNG__WEBPACK_IMPORTED_MODULE_2__["default"].RollChance(10);
                if (stunHit) {
                    this.StunCount = 2;
                }
            }
            this.Health -= damage;
        }
    };
    Fighter.prototype.TakeHeal = function (healer) {
        var healamount = healer.Damage * 0.75;
        healer.CritCount++;
        var isCrit = healer.CritCount >= 10;
        if (isCrit) {
            healer.CritCount = 0;
            healamount *= 1 + healer.CritDamage / 100;
        }
        this.Health += healamount;
        this.Health = Math.min(this.Health, this.MHealth);
    };
    return Fighter;
}());



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fighterstats", function() { return fighterstats; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createFighter", function() { return createFighter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FighterClasses", function() { return FighterClasses; });
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var fighterstats = [
    "health",
    "damage",
    "defense",
    "critdamage",
    "hit",
    "dodge"
];
// just kinda a default fighter constructor
function createFighter(id, data) {
    if (data === void 0) { data = {}; }
    return __assign({ id: id.toString(), type: 1, health: 0, damage: 0, defense: 0, critdamage: 0, hit: 0, dodge: 0 }, data);
}
var FighterClasses;
(function (FighterClasses) {
    FighterClasses[FighterClasses["Assassin"] = 0] = "Assassin";
    FighterClasses[FighterClasses["Brawler"] = 1] = "Brawler";
    FighterClasses[FighterClasses["Cavalry"] = 2] = "Cavalry";
    FighterClasses[FighterClasses["Healer"] = 3] = "Healer";
    FighterClasses[FighterClasses["Hunter"] = 4] = "Hunter";
    FighterClasses[FighterClasses["Knight"] = 5] = "Knight";
    FighterClasses[FighterClasses["Mage"] = 6] = "Mage";
    FighterClasses[FighterClasses["Priest"] = 7] = "Priest";
    FighterClasses[FighterClasses["Tank"] = 8] = "Tank";
    FighterClasses[FighterClasses["Warrior"] = 9] = "Warrior";
    FighterClasses[FighterClasses["Wizard"] = 10] = "Wizard";
    FighterClasses[FighterClasses["CaveFighter"] = 98] = "CaveFighter";
    FighterClasses[FighterClasses["Monster"] = 99] = "Monster";
})(FighterClasses || (FighterClasses = {}));


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "config", function() { return config; });
var config = {
    iterations: 500000,
    statIncrement: 500,
    uniqueMultiplier: 2.5,
    workerPath: "/worker.js"
};


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function Rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function RollChance(percent) {
    var roll = Rand(1, 10000);
    if (roll < percent * 100) {
        return true;
    }
    return false;
}
var RNG = {
    Rand: Rand,
    RollChance: RollChance
};
/* harmony default export */ __webpack_exports__["default"] = (RNG);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Monster", function() { return Monster; });
/* harmony import */ var _Fighter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _datamodels_fighter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};


var Monster = /** @class */ (function (_super) {
    __extends(Monster, _super);
    function Monster(level) {
        var _this = this;
        var data = Object(_datamodels_fighter__WEBPACK_IMPORTED_MODULE_1__["createFighter"])(999);
        _this = _super.call(this, __assign(__assign({}, data), { type: _datamodels_fighter__WEBPACK_IMPORTED_MODULE_1__["FighterClasses"].Monster })) || this;
        _this.Level = level;
        _this.Health = 100 + _this.ScaleStat(400);
        _this.Defense = 20 + _this.ScaleStat(10);
        _this.Damage = 60 + _this.ScaleStat(40);
        _this.CritDamage = 100;
        _this.Hit = 50 + _this.ScaleStat(30);
        _this.Dodge = 50 + _this.ScaleStat(30);
        _this.MHealth = _this.Health;
        return _this;
    }
    Monster.prototype.ScaleStat = function (scale) {
        var cscale = scale;
        var total = Math.min(600, this.Level) * cscale;
        if (this.Level > 600) {
            var scalelvl = this.Level - 600;
            while (scalelvl > 0) {
                cscale += scale;
                var bracket = Math.min(200, scalelvl);
                total += bracket * cscale;
                scalelvl -= 200;
            }
        }
        return total;
    };
    return Monster;
}(_Fighter__WEBPACK_IMPORTED_MODULE_0__["Fighter"]));



/***/ })
/******/ ]);