

var game = function (gameID) {
    this.playerWhite = null;
    this.playerBlack = null;
    this.id = gameID;
    this.gameState = "0 JOINT"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted
  };
  
  /*
   * The game can be in a number of different states.
   */
  game.prototype.transitionStates = {};
  game.prototype.transitionStates["0 JOINT"] = 0;
  game.prototype.transitionStates["1 JOINT"] = 1;
  game.prototype.transitionStates["2 JOINT"] = 2;
  // game.prototype.transitionStates["WHITE TURN"] = 3;
  // game.prototype.transitionStates["BLACK TURN"] = 4;
  game.prototype.transitionStates["WHITE"] = 5; //White won
  game.prototype.transitionStates["BLACK"] = 6; //Black won
  game.prototype.transitionStates["DRAW"] = 7;
  game.prototype.transitionStates["ABORTED"] = 8;
  
  /*
   * Not all game states can be transformed into each other;
   * the matrix contains the valid transitions.
   * They are checked each time a state change is attempted.
   */
  game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0, 0, 0], //0 JOINT
    [1, 0, 1, 0, 0, 0, 0, 0, 0], //1 JOINT
    [0, 0, 0, 1, 0, 0, 0, 0, 1], //2 JOINT (note: once we have two players, there is no way back!)
    [0, 0, 0, 0, 1, 1, 0, 1, 1], //3 WHITE TURN
    [0, 0, 0, 1, 0, 0, 1, 1, 1], //4 BLACK TURN
    [0, 0, 0, 0, 0, 0, 0, 0, 0], //5 WHITE WON
    [0, 0, 0, 0, 0, 0, 0, 0, 0], //6 BLACK WON
    [0, 0, 0, 0, 0, 0, 0, 0, 0], //7 DRAW
    [0, 0, 0, 0, 0, 0, 0, 0, 0] //8 ABORTED
  
    
  ];
  
  game.prototype.isValidTransition = function (from, to) {
    console.assert(
      typeof from == "string",
      "%s: Expecting a string, got a %s",
      arguments.callee.name,
      typeof from
    );
    console.assert(
      typeof to == "string",
      "%s: Expecting a string, got a %s",
      arguments.callee.name,
      typeof to
    );
    console.assert(
      from in game.prototype.transitionStates == true,
      "%s: Expecting %s to be a valid transition state",
      arguments.callee.name,
      from
    );
    console.assert(
      to in game.prototype.transitionStates == true,
      "%s: Expecting %s to be a valid transition state",
      arguments.callee.name,
      to
    );
  
    let i, j;
    if (!(from in game.prototype.transitionStates)) {
      return false;
    } else {
      i = game.prototype.transitionStates[from];
    }
  
    if (!(to in game.prototype.transitionStates)) {
      return false;
    } else {
      j = game.prototype.transitionStates[to];
    }
  
    return game.prototype.transitionMatrix[i][j] > 0;
  };
  
  game.prototype.isValidState = function (s) {
    return s in game.prototype.transitionStates;
  };
  
  game.prototype.setStatus = function (w) {
    console.assert(
      typeof w == "string",
      "%s: Expecting a string, got a %s",
      arguments.callee.name,
      typeof w
    );
  
    if (
      game.prototype.isValidState(w) &&
      game.prototype.isValidTransition(this.gameState, w)
    ) {
      this.gameState = w;
      console.log("[STATUS] %s", this.gameState);
    } else {
      return new Error(
        "Impossible status change from %s to %s",
        this.gameState,
        w
      );
    }
  };
  
  /* game.prototype.doMove = function (from, to) {
    console.assert(
      typeof from == "string" && typeof to == "string",
      "invalid move"
    );
  
    //two possible options for the current game state:
    //1 JOINT, 2 JOINT
    if (this.gameState != "1 JOINT" && this.gameState != "2 JOINT") {
      return new Error(
        "Trying to set word, but game status is %s",
        this.gameState
      );
    }
    this.wordToGuess = w;
  }; */
  
  
  game.prototype.hasTwoConnectedPlayers = function () {
    return this.gameState == "2 JOINT";
  };
  
  
  game.prototype.otherPlayer = function (player) {
    return this.playerWhite.id==player.id ? this.playerBlack : this.playerWhite;

    // if (this.gameState == "BLACK TURN"){
    //   this.setStatus("WHITE TURN");
    //   return this.playerWhite;
    // } 
  
    // if (this.gameState == "WHITE TURN"){
    //   this.setStatus("BLACK TURN");
    //   return this.playerBlack;
    // }
  
    // return new Error(
    //   "Invalid call to nextPlayer, current state is %s",
    //   this.gameState
    // );
  
  
  };
      
  
  
  game.prototype.addPlayer = function (p) {
    console.assert(
      p instanceof Object,
      "%s: Expecting an object (WebSocket), got a %s",
      arguments.callee.name,
      typeof p
    );
  
    if (this.gameState != "0 JOINT" && this.gameState != "1 JOINT") {
      return new Error(
        "Invalid call to addPlayer, current state is %s",
        this.gameState
      );
    }
  
    /*
     * revise the game state
     */
  
    var error = this.setStatus("1 JOINT");
    if (error instanceof Error) {
      this.setStatus("2 JOINT");
    }
  
    if (this.playerWhite == null) {
      this.playerWhite = p;
      return "WHITE";
    } else {
      this.playerBlack = p;
      return "BLACK";
    }
  
  
  
  
  };
  
  module.exports = game;
  