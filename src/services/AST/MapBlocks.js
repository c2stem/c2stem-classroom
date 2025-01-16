let blocks;
export default {
  get(blockName) {
    blocks = {
      forward: {
        only: "SpriteMorph",
        type: "command",
        category: "motion",
        spec: "move %n steps",
        defaults: [10],
      },
      turn: {
        only: "SpriteMorph",
        type: "command",
        category: "motion",
        spec: "turn %clockwise %n degrees",
        defaults: [15],
      },
      turnLeft: {
        only: "SpriteMorph",
        type: "command",
        category: "motion",
        spec: "turn %counterclockwise %n degrees",
        defaults: [15],
      },
      setHeading: {
        only: "SpriteMorph",
        type: "command",
        category: "motion",
        spec: "point in direction %dir",
      },
      doFaceTowards: {
        only: "SpriteMorph",
        type: "command",
        category: "motion",
        spec: "point towards %dst",
      },
      gotoXY: {
        only: "SpriteMorph",
        type: "command",
        category: "motion",
        spec: "go to x: %n y: %n",
        defaults: [0, 0],
      },
      doGotoObject: {
        only: "SpriteMorph",
        type: "command",
        category: "motion",
        spec: "go to %dst",
      },
      doGlide: {
        only: "SpriteMorph",
        type: "command",
        category: "motion",
        spec: "glide %n secs to x: %n y: %n",
        defaults: [1, 0, 0],
      },
      changeXPosition: {
        only: "SpriteMorph",
        type: "command",
        category: "motion",
        spec: "change x by %n",
        defaults: [10],
      },
      setXPosition: {
        only: "SpriteMorph",
        type: "command",
        category: "motion",
        spec: "set x to %n",
        defaults: [0],
      },
      changeYPosition: {
        only: "SpriteMorph",
        type: "command",
        category: "motion",
        spec: "change y by %n",
        defaults: [10],
      },
      setYPosition: {
        only: "SpriteMorph",
        type: "command",
        category: "motion",
        spec: "set y to %n",
        defaults: [0],
      },
      bounceOffEdge: {
        only: "SpriteMorph",
        type: "command",
        category: "motion",
        spec: "if on edge, bounce",
      },
      xPosition: {
        only: "SpriteMorph",
        type: "reporter",
        category: "motion",
        spec: "x position",
      },
      yPosition: {
        only: "SpriteMorph",
        type: "reporter",
        category: "motion",
        spec: "y position",
      },
      direction: {
        only: "SpriteMorph",
        type: "reporter",
        category: "motion",
        spec: "direction",
      },

      // Looks
      doSwitchToCostume: {
        type: "command",
        category: "looks",
        spec: "switch to costume %cst",
      },
      doWearNextCostume: {
        type: "command",
        category: "looks",
        spec: "next costume",
      },
      getCostumeIdx: {
        type: "reporter",
        category: "looks",
        spec: "costume #",
      },
      doSayFor: {
        only: "SpriteMorph",
        type: "command",
        category: "looks",
        spec: "say %s for %n secs",
        defaults: '[localize("Hello!"), 2]',
      },
      bubble: {
        only: "SpriteMorph",
        type: "command",
        category: "looks",
        spec: "say %s",
        defaults: '[localize("Hello!")]',
      },
      doThinkFor: {
        only: "SpriteMorph",
        type: "command",
        category: "looks",
        spec: "think %s for %n secs",
        defaults: '[localize("Hmm..."), 2]',
      },
      doThink: {
        only: "SpriteMorph",
        type: "command",
        category: "looks",
        spec: "think %s",
        defaults: '[localize("Hmm...")]',
      },
      changeEffect: {
        type: "command",
        category: "looks",
        spec: "change %eff effect by %n",
        defaults: [null, 25],
      },
      setEffect: {
        type: "command",
        category: "looks",
        spec: "set %eff effect to %n",
        defaults: [null, 0],
      },
      clearEffects: {
        type: "command",
        category: "looks",
        spec: "clear graphic effects",
      },
      changeScale: {
        only: "SpriteMorph",
        type: "command",
        category: "looks",
        spec: "change size by %n",
        defaults: [10],
      },
      setScale: {
        only: "SpriteMorph",
        type: "command",
        category: "looks",
        spec: "set size to %n %",
        defaults: [100],
      },
      getScale: {
        only: "SpriteMorph",
        type: "reporter",
        category: "looks",
        spec: "size",
      },
      show: {
        only: "SpriteMorph",
        type: "command",
        category: "looks",
        spec: "show",
      },
      hide: {
        only: "SpriteMorph",
        type: "command",
        category: "looks",
        spec: "hide",
      },
      comeToFront: {
        only: "SpriteMorph",
        type: "command",
        category: "looks",
        spec: "go to front",
      },
      goBack: {
        only: "SpriteMorph",
        type: "command",
        category: "looks",
        spec: "go back %n layers",
        defaults: [1],
      },
      //doScreenshot: {
      //type: 'command',
      //category: 'looks',
      //spec: 'save %imgsource as costume named %s',
      //defaults: [['pen trails'], localize('screenshot')]
      //},

      // Looks - Debugging primitives for development mode
      reportCostumes: {
        dev: true,
        type: "reporter",
        category: "looks",
        spec: "wardrobe",
      },

      alert: {
        dev: true,
        type: "command",
        category: "looks",
        spec: "alert %mult%s",
      },
      log: {
        dev: true,
        type: "command",
        category: "looks",
        spec: "console log %mult%s",
      },

      // Sound
      playSound: {
        type: "command",
        category: "sound",
        spec: "play sound %snd",
      },
      doPlaySoundUntilDone: {
        type: "command",
        category: "sound",
        spec: "play sound %snd until done",
      },
      doStopAllSounds: {
        type: "command",
        category: "sound",
        spec: "stop all sounds",
      },
      doRest: {
        type: "command",
        category: "sound",
        spec: "rest for %n beats",
        defaults: [0.2],
      },
      doPlayNote: {
        type: "command",
        category: "sound",
        spec: "play note %n for %n beats",
        defaults: [60, 0.5],
      },
      doChangeTempo: {
        type: "command",
        category: "sound",
        spec: "change tempo by %n",
        defaults: [20],
      },
      doSetTempo: {
        type: "command",
        category: "sound",
        spec: "set tempo to %n bpm",
        defaults: [60],
      },
      getTempo: {
        type: "reporter",
        category: "sound",
        spec: "tempo",
      },

      // Sound - Debugging primitives for development mode
      reportSounds: {
        dev: true,
        type: "reporter",
        category: "sound",
        spec: "jukebox",
      },

      // Pen
      clear: {
        type: "command",
        category: "pen",
        spec: "clear",
      },
      down: {
        only: "SpriteMorph",
        type: "command",
        category: "pen",
        spec: "pen down",
      },
      up: {
        only: "SpriteMorph",
        type: "command",
        category: "pen",
        spec: "pen up",
      },
      setColor: {
        only: "SpriteMorph",
        type: "command",
        category: "pen",
        spec: "set pen color to %clr",
      },
      changeHue: {
        only: "SpriteMorph",
        type: "command",
        category: "pen",
        spec: "change pen color by %n",
        defaults: [10],
      },
      setHue: {
        only: "SpriteMorph",
        type: "command",
        category: "pen",
        spec: "set pen color to %n",
        defaults: [0],
      },
      changeBrightness: {
        only: "SpriteMorph",
        type: "command",
        category: "pen",
        spec: "change pen shade by %n",
        defaults: [10],
      },
      setBrightness: {
        only: "SpriteMorph",
        type: "command",
        category: "pen",
        spec: "set pen shade to %n",
        defaults: [100],
      },
      changeSize: {
        only: "SpriteMorph",
        type: "command",
        category: "pen",
        spec: "change pen size by %n",
        defaults: [1],
      },
      setSize: {
        only: "SpriteMorph",
        type: "command",
        category: "pen",
        spec: "set pen size to %n",
        defaults: [1],
      },
      doStamp: {
        only: "SpriteMorph",
        type: "command",
        category: "pen",
        spec: "stamp",
      },
      floodFill: {
        only: "SpriteMorph",
        type: "command",
        category: "pen",
        spec: "fill",
      },

      // Control
      receiveGo: {
        type: "hat",
        category: "control",
        spec: "when %greenflag clicked",
      },
      receiveKey: {
        type: "hat",
        category: "control",
        spec: "when %keyHat key pressed",
      },

      /* migrated to a newer block version:

          receiveClick: {
              type: 'hat',
              category: 'control',
              spec: 'when I am clicked'
          },
      */

      receiveInteraction: {
        type: "hat",
        category: "control",
        spec: "when I am %interaction",
        defaults: ["clicked"],
      },
      receiveMessage: {
        type: "hat",
        category: "control",
        spec: "when I receive %msgHat",
      },
      receiveCondition: {
        type: "hat",
        category: "control",
        spec: "when %b",
      },
      doBroadcast: {
        type: "command",
        category: "control",
        spec: "broadcast %msg",
      },
      doBroadcastAndWait: {
        type: "command",
        category: "control",
        spec: "broadcast %msg and wait",
      },
      getLastMessage: {
        type: "reporter",
        category: "control",
        spec: "message",
      },
      doWait: {
        type: "command",
        category: "control",
        spec: "wait %n secs",
        defaults: [1],
      },
      doWaitUntil: {
        type: "command",
        category: "control",
        spec: "wait until %b",
      },
      doForever: {
        type: "command",
        category: "control",
        spec: "forever %c",
      },
      doRepeat: {
        type: "command",
        category: "control",
        spec: "repeat %n %c",
        defaults: [10],
      },
      doUntil: {
        type: "command",
        category: "control",
        spec: "repeat until %b %c",
      },
      doIf: {
        type: "command",
        category: "control",
        spec: "if %b %c",
      },
      doIfElse: {
        type: "command",
        category: "control",
        spec: "if %b %c else %c",
      },

      /* migrated to a newer block version:

          doStop: {
              type: 'command',
              category: 'control',
              spec: 'stop script'
          },
          doStopAll: {
              type: 'command',
              category: 'control',
              spec: 'stop all %stop'
          },
      */

      doStopThis: {
        type: "command",
        category: "control",
        spec: "stop %stopChoices",
      },
      doStopOthers: {
        type: "command",
        category: "control",
        spec: "stop %stopOthersChoices",
      },
      doRun: {
        type: "command",
        category: "control",
        spec: "run %cmdRing %inputs",
      },
      fork: {
        type: "command",
        category: "control",
        spec: "launch %cmdRing %inputs",
      },
      evaluate: {
        type: "reporter",
        category: "control",
        spec: "call %repRing %inputs",
      },
      /*
          doRunWithInputList: {
              type: 'command',
              category: 'control',
              spec: 'run %cmd with input list %l'
          },

          forkWithInputList: {
              type: 'command',
              category: 'control',
              spec: 'launch %cmd with input list %l'
          },

          evaluateWithInputList: {
              type: 'reporter',
              category: 'control',
              spec: 'call %r with input list %l'
          },
      */
      doReport: {
        type: "command",
        category: "control",
        spec: "report %s",
      },
      /*
          doStopBlock: { // migrated to a newer block version
              type: 'command',
              category: 'control',
              spec: 'stop block'
          },
      */
      doCallCC: {
        type: "command",
        category: "control",
        spec: "run %cmdRing w/continuation",
      },
      reportCallCC: {
        type: "reporter",
        category: "control",
        spec: "call %cmdRing w/continuation",
      },
      doWarp: {
        type: "command",
        category: "other",
        spec: "warp %c",
      },

      // Cloning - very experimental
      receiveOnClone: {
        type: "hat",
        category: "control",
        spec: "when I start as a clone",
      },
      createClone: {
        type: "command",
        category: "control",
        spec: "create a clone of %cln",
      },
      removeClone: {
        type: "command",
        category: "control",
        spec: "delete this clone",
      },

      // Debugging - pausing

      doPauseAll: {
        type: "command",
        category: "control",
        spec: "pause all %pause",
      },

      // Sensing

      reportTouchingObject: {
        only: "SpriteMorph",
        type: "predicate",
        category: "sensing",
        spec: "touching %col ?",
      },
      reportTouchingColor: {
        only: "SpriteMorph",
        type: "predicate",
        category: "sensing",
        spec: "touching %clr ?",
      },
      reportColorIsTouchingColor: {
        only: "SpriteMorph",
        type: "predicate",
        category: "sensing",
        spec: "color %clr is touching %clr ?",
      },
      colorFiltered: {
        dev: true,
        type: "reporter",
        category: "sensing",
        spec: "filtered for %clr",
      },
      reportStackSize: {
        dev: true,
        type: "reporter",
        category: "sensing",
        spec: "stack size",
      },
      reportFrameCount: {
        dev: true,
        type: "reporter",
        category: "sensing",
        spec: "frames",
      },
      reportThreadCount: {
        dev: true,
        type: "reporter",
        category: "sensing",
        spec: "processes",
      },
      doAsk: {
        type: "command",
        category: "sensing",
        spec: "ask %s and wait",
        defaults: '[localize("what\'s your name?")]',
      },
      reportLastAnswer: {
        // retained for legacy compatibility
        dev: true,
        type: "reporter",
        category: "sensing",
        spec: "answer",
      },
      getLastAnswer: {
        type: "reporter",
        category: "sensing",
        spec: "answer",
      },
      reportMouseX: {
        type: "reporter",
        category: "sensing",
        spec: "mouse x",
      },
      reportMouseY: {
        type: "reporter",
        category: "sensing",
        spec: "mouse y",
      },
      reportMouseDown: {
        type: "predicate",
        category: "sensing",
        spec: "mouse down?",
      },
      reportKeyPressed: {
        type: "predicate",
        category: "sensing",
        spec: "key %key pressed?",
      },
      reportDistanceTo: {
        type: "reporter",
        category: "sensing",
        spec: "distance to %dst",
      },
      doResetTimer: {
        type: "command",
        category: "sensing",
        spec: "reset timer",
      },
      reportTimer: {
        // retained for legacy compatibility
        dev: true,
        type: "reporter",
        category: "sensing",
        spec: "timer",
      },
      getTimer: {
        type: "reporter",
        category: "sensing",
        spec: "timer",
      },
      reportAttributeOf: {
        type: "reporter",
        category: "sensing",
        spec: "%att of %spr",
        defaults: [["costume #"]],
      },
      reportURL: {
        type: "reporter",
        category: "sensing",
        spec: "http:// %s",
        defaults: ["snap.berkeley.edu"],
      },
      reportIsFastTracking: {
        type: "predicate",
        category: "sensing",
        spec: "turbo mode?",
      },
      doSetFastTracking: {
        type: "command",
        category: "sensing",
        spec: "set turbo mode to %b",
      },
      reportDate: {
        type: "reporter",
        category: "sensing",
        spec: "current %dates",
      },
      reportGet: {
        type: "reporter",
        category: "sensing",
        spec: "my %get",
        defaults: [["neighbors"]],
      },

      // Operators
      reifyScript: {
        type: "ring",
        category: "other",
        spec: "%rc %ringparms",
        alias: "command ring lambda",
      },
      reifyReporter: {
        type: "ring",
        category: "other",
        spec: "%rr %ringparms",
        alias: "reporter ring lambda",
      },
      reifyPredicate: {
        type: "ring",
        category: "other",
        spec: "%rp %ringparms",
        alias: "predicate ring lambda",
      },
      reportSum: {
        type: "reporter",
        category: "operators",
        spec: "%n + %n",
      },
      reportDifference: {
        type: "reporter",
        category: "operators",
        spec: "%n \u2212 %n",
        alias: "-",
      },
      reportProduct: {
        type: "reporter",
        category: "operators",
        spec: "%n \u00D7 %n",
        alias: "*",
      },
      reportQuotient: {
        type: "reporter",
        category: "operators",
        spec: "%n / %n", // '%n \u00F7 %n'
      },
      reportRound: {
        type: "reporter",
        category: "operators",
        spec: "round %n",
      },
      reportMonadic: {
        type: "reporter",
        category: "operators",
        spec: "%fun of %n",
        defaults: [null, 10],
      },
      reportModulus: {
        type: "reporter",
        category: "operators",
        spec: "%n mod %n",
      },
      reportPower: {
        type: "reporter",
        category: "operators",
        spec: "%n power %n",
      },
      reportRandom: {
        type: "reporter",
        category: "operators",
        spec: "pick random %n to %n",
        defaults: [1, 10],
      },
      reportLessThan: {
        type: "predicate",
        category: "operators",
        spec: "%s < %s",
      },
      reportEquals: {
        type: "predicate",
        category: "operators",
        spec: "%s = %s",
      },
      reportGreaterThan: {
        type: "predicate",
        category: "operators",
        spec: "%s > %s",
      },
      reportAnd: {
        type: "predicate",
        category: "operators",
        spec: "%b and %b",
      },
      reportOr: {
        type: "predicate",
        category: "operators",
        spec: "%b or %b",
      },
      reportNot: {
        type: "predicate",
        category: "operators",
        spec: "not %b",
      },
      reportBoolean: {
        type: "predicate",
        category: "operators",
        spec: "%bool",
        alias: "true boolean",
      },
      reportFalse: {
        // special case for keyboard entry and search
        type: "predicate",
        category: "operators",
        spec: "%bool",
        defaults: [false],
        alias: "false boolean",
      },
      reportJoinWords: {
        type: "reporter",
        category: "operators",
        spec: "join %words",
        defaults: '[localize("hello") + " ", localize("world")]',
      },
      reportLetter: {
        type: "reporter",
        category: "operators",
        spec: "letter %n of %s",
        defaults: '[1, localize("world")]',
      },
      reportStringSize: {
        type: "reporter",
        category: "operators",
        spec: "length of %s",
        defaults: '[localize("world")]',
      },
      reportUnicode: {
        type: "reporter",
        category: "operators",
        spec: "unicode of %s",
        defaults: ["a"],
      },
      reportUnicodeAsLetter: {
        type: "reporter",
        category: "operators",
        spec: "unicode %n as letter",
        defaults: [65],
      },
      reportIsA: {
        type: "predicate",
        category: "operators",
        spec: "is %s a %typ ?",
        defaults: [5],
      },
      reportIsIdentical: {
        type: "predicate",
        category: "operators",
        spec: "is %s identical to %s ?",
      },
      reportTextSplit: {
        type: "reporter",
        category: "operators",
        spec: "split %s by %delim",
        defaults: '[localize("hello") + " " + localize("world"), " "]',
      },
      reportJSFunction: {
        // experimental
        type: "reporter",
        category: "operators",
        spec: "JavaScript function ( %mult%s ) { %code }",
      },
      reportTypeOf: {
        // only in dev mode for debugging
        dev: true,
        type: "reporter",
        category: "operators",
        spec: "type of %s",
        defaults: [5],
      },
      reportTextFunction: {
        // only in dev mode - experimental
        dev: true,
        type: "reporter",
        category: "operators",
        spec: "%txtfun of %s",
        defaults: [null, "Abelson & Sussman"],
      },

      /*
          reportScript: {
              type: 'reporter',
              category: 'operators',
              spec: 'the script %parms %c'
          },
          reify: {
              type: 'reporter',
              category: 'operators',
              spec: 'the %f block %parms'
          },
      */

      // Variables
      doSetVar: {
        type: "command",
        category: "variables",
        spec: "set %var to %s",
        defaults: [null, 0],
      },
      doChangeVar: {
        type: "command",
        category: "variables",
        spec: "change %var by %n",
        defaults: [null, 1],
      },
      doShowVar: {
        type: "command",
        category: "variables",
        spec: "show variable %var",
      },
      doHideVar: {
        type: "command",
        category: "variables",
        spec: "hide variable %var",
      },
      doDeclareVariables: {
        type: "command",
        category: "other",
        spec: "script variables %scriptVars",
      },

      // inheritance - experimental
      doDeleteAttr: {
        type: "command",
        category: "variables",
        spec: "delete %shd",
      },

      // Lists
      reportNewList: {
        type: "reporter",
        category: "lists",
        spec: "list %exp",
      },
      reportCONS: {
        type: "reporter",
        category: "lists",
        spec: "%s in front of %l",
      },
      reportListItem: {
        type: "reporter",
        category: "lists",
        spec: "item %idx of %l",
        defaults: [1],
      },
      reportCDR: {
        type: "reporter",
        category: "lists",
        spec: "all but first of %l",
      },
      reportListLength: {
        type: "reporter",
        category: "lists",
        spec: "length of %l",
      },
      reportListContainsItem: {
        type: "predicate",
        category: "lists",
        spec: "%l contains %s",
        defaults: '[null, localize("thing")]',
      },
      doAddToList: {
        type: "command",
        category: "lists",
        spec: "add %s to %l",
        defaults: '[localize("thing")]',
      },
      doDeleteFromList: {
        type: "command",
        category: "lists",
        spec: "delete %ida of %l",
        defaults: [1],
      },
      doInsertInList: {
        type: "command",
        category: "lists",
        spec: "insert %s at %idx of %l",
        defaults: '[localize("thing"), 1]',
      },
      doReplaceInList: {
        type: "command",
        category: "lists",
        spec: "replace item %idx of %l with %s",
        defaults: '[1, null, localize("thing")]',
      },

      // MAP - experimental
      reportMap: {
        dev: true,
        type: "reporter",
        category: "lists",
        spec: "map %repRing over %l",
      },
      doForEach: {
        dev: true,
        type: "command",
        category: "lists",
        spec: "for %upvar in %l %cl",
        defaults: '[localize("each item")]',
      },

      // Tables - experimental

      doShowTable: {
        dev: true,
        type: "command",
        category: "lists",
        spec: "show table %l",
      },

      // Code mapping - experimental
      doMapCodeOrHeader: {
        // experimental
        type: "command",
        category: "other",
        spec: "map %cmdRing to %codeKind %code",
      },
      doMapStringCode: {
        // experimental
        type: "command",
        category: "other",
        spec: "map String to code %code",
        defaults: ["<#1>"],
      },
      doMapListCode: {
        // experimental
        type: "command",
        category: "other",
        spec: "map %codeListPart of %codeListKind to code %code",
      },
      reportMappedCode: {
        // experimental
        type: "reporter",
        category: "other",
        spec: "code of %cmdRing",
      },
      angularForce: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "apply %clockwise torque of %n",
        defaults: [1000],
      },
      angularForceLeft: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "apply %counterclockwise torque of %n",
        defaults: [1000],
      },
      applyForceForward: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "apply force of %n",
        defaults: [1000],
      },
      applyForce: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "apply force %n in direction %dir",
        defaults: [100],
      },
      setMass: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "set mass to %n kg",
        defaults: [100],
        concepts: ["mass"],
      },
      mass: {
        only: "SpriteMorph",
        type: "reporter",
        category: "simulation",
        spec: "mass in kg",
        concepts: ["mass"],
      },
      setVelocity: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "set velocity to x: %n y: %n m/s",
        defaults: [0, 0],
        concepts: ["x_velocity", "y_velocity"],
      },
      setXVelocity: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "set x velocity to %n m/s",
        defaults: [0],
        concepts: ["x_velocity"],
      },
      setYVelocity: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "set y velocity to %n m/s",
        defaults: [0],
        concepts: ["y_velocity"],
      },
      xVelocity: {
        only: "SpriteMorph",
        type: "reporter",
        category: "simulation",
        spec: "x velocity in m/s",
        concepts: ["x_velocity"],
      },
      yVelocity: {
        only: "SpriteMorph",
        type: "reporter",
        category: "simulation",
        spec: "y velocity in m/s",
        concepts: ["y_velocity"],
      },
      changeVelocity: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "change velocity by x: %n y: %n m/s",
        defaults: [0, 0],
        concepts: ["x_velocity", "y_velocity"],
      },
      changeXVelocity: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "change x velocity by %n m/s",
        defaults: [0],
        concepts: ["x_velocity"],
      },
      changeYVelocity: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "change y velocity by %n m/s",
        defaults: [0],
        concepts: ["y_velocity"],
      },
      setAcceleration: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "set acceleration to x: %n y: %n m/s\u00b2",
        defaults: [0, 0],
        concepts: ["x_acceleration", "y_acceleration"],
      },
      setXAcceleration: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "set x acceleration to %n m/s\u00b2",
        defaults: [0],
        concepts: ["x_acceleration"],
      },
      setYAcceleration: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "set y acceleration to %n m/s\u00b2",
        defaults: [0],
        concepts: ["y_acceleration"],
      },
      xAcceleration: {
        only: "SpriteMorph",
        type: "reporter",
        category: "simulation",
        spec: "x acceleration in m/s\u00b2",
        concepts: ["x_acceleration"],
      },
      yAcceleration: {
        only: "SpriteMorph",
        type: "reporter",
        category: "simulation",
        spec: "y acceleration in m/s\u00b2",
        concepts: ["y_acceleration"],
      },
      setNetForce: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "set net force to x: %n y: %n N",
        defaults: [0, 0],
        concepts: ["x_net_force", "y_net_force"],
      },
      setXNetForce: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "set x net force to %n N",
        defaults: [0],
        concepts: ["x_net_force"],
      },
      setYNetForce: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "set y net force to %n N",
        defaults: [0],
        concepts: ["y_net_force"],
      },
      xNetForce: {
        only: "SpriteMorph",
        type: "reporter",
        category: "simulation",
        spec: "x net force in N",
        concepts: ["x_net_force"],
      },
      yNetForce: {
        only: "SpriteMorph",
        type: "reporter",
        category: "simulation",
        spec: "y net force in N",
        concepts: ["y_net_force"],
      },
      changeNetForce: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "change net force by x: %n y: %n N",
        defaults: [0, 0],
        concepts: ["x_net_force", "y_net_force"],
      },
      changeXNetForce: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "change x net force by %n N",
        defaults: [0],
        concepts: ["x_net_force"],
      },
      changeYNetForce: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "change y net force by %n N",
        defaults: [0],
        concepts: ["y_net_force"],
      },
      simulationTime: {
        type: "reporter",
        category: "simulation",
        spec: "time in s",
        concepts: ["simulation_time"],
      },
      deltaTime: {
        type: "reporter",
        category: "simulation",
        spec: "\u2206t in s",
        concepts: ["delta_time"],
      },
      setDeltaTime: {
        type: "command",
        category: "simulation",
        spec: "set \u2206t to %n in s",
        defaults: [0],
        concepts: ["delta_time"],
      },
      doSimulationStep: {
        type: "hat",
        category: "simulation",
        spec: "simulation_step",
      },
      yGravity: {
        type: "reporter",
        category: "simulation",
        spec: "gravity in m/s\u00b2",
        concepts: ["gravity"],
      },
      friction: {
        type: "reporter",
        category: "simulation",
        spec: "friction",
        concepts: ["friction"],
      },
      setPhysicsPosition: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "set position to x: %n y: %n m",
        defaults: [0, 0],
        concepts: ["x_position", "y_position"],
      },
      setPhysicsXPosition: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "set x position to %n m",
        defaults: [0],
        concepts: ["x_position"],
      },
      setPhysicsYPosition: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "set y position to %n m",
        defaults: [0],
        concepts: ["y_position"],
      },
      physicsXPosition: {
        only: "SpriteMorph",
        type: "reporter",
        category: "simulation",
        spec: "x position in m",
        concepts: ["x_position"],
      },
      physicsYPosition: {
        only: "SpriteMorph",
        type: "reporter",
        category: "simulation",
        spec: "y position in m",
        concepts: ["y_position"],
      },
      changePhysicsXPosition: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "change x position by %n m",
        defaults: [0],
        concepts: ["x_position"],
      },
      changePhysicsYPosition: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "change y position by %n m",
        defaults: [0],
        concepts: ["y_position"],
      },
      changePhysicsPosition: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "change position by x: %n y: %n m",
        defaults: [0, 0],
        concepts: ["x_position", "y_position"],
      },
      setPhysicsAngle: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "set heading to %n deg",
        defaults: [0],
        concepts: ["heading"],
      },
      changePhysicsAngle: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "change heading by %n deg",
        defaults: [0],
        concepts: ["heading"],
      },
      physicsAngle: {
        only: "SpriteMorph",
        type: "reporter",
        category: "simulation",
        spec: "heading in deg",
        concepts: ["heading"],
      },
      setAngularVelocity: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "set angular velocity to %n deg/s",
        defaults: [0],
        concepts: ["angular_velocity"],
      },
      changeAngularVelocity: {
        only: "SpriteMorph",
        type: "command",
        category: "simulation",
        spec: "change angular velocity by %n deg/s",
        defaults: [0],
        concepts: ["angular_velocity"],
      },
      angularVelocity: {
        only: "SpriteMorph",
        type: "reporter",
        category: "simulation",
        spec: "angular velocity in deg/s",
        concepts: ["angular_velocity"],
      },
      startSimulation: {
        type: "command",
        category: "simulation",
        spec: "start simulation",
      },
      stopSimulation: {
        type: "command",
        category: "simulation",
        spec: "stop simulation",
      },
      runSimulationSteps: {
        type: "command",
        category: "simulation",
        spec: "run simulation step",
      },
      getPhysicsAttrOf: {
        type: "reporter",
        category: "simulation",
        spec: "%phy of %spr",
        defaults: [["x position"]],
      },
      setPhysicsAttrOf: {
        type: "command",
        category: "simulation",
        spec: "set %phy of %spr to %n",
        defaults: [["x position"], null, [0]],
      },
      graphData: {
        type: "reporter",
        category: "simulation",
        spec: "graph data",
      },
      clearGraphData: {
        type: "command",
        category: "simulation",
        spec: "clear graph data",
      },
      recordGraphData: {
        type: "command",
        category: "simulation",
        spec: "record graph data",
      },
    };
    if (blocks[blockName]) {
      return blocks[blockName].spec;
    } else if (blockName.includes("var:")) {
      return blockName.split(" ")[1];
    } else {
      return blockName;
    }
  },
};
