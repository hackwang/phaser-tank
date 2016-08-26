
/**
 * @summary:
 *   socket事件类： 处理游戏事件
 * @description:
 *
 */

import RemotePlayer from './RemotePlayer';


export default class SocketEvent {

  constructor(game, socket, gamers, player, playerGroup) {
    this.game = game;
    this.socket = socket;
    this.gamers = gamers;
    this.player = player;
    this.playerGroup = playerGroup;
  }

  init() {
    this.socket.on('connect', this.onSocketConnected.bind(this));
    this.socket.on('disconnect', this.onSocketDisconnect.bind(this));
    this.socket.on('new player', this.onNewPlayer.bind(this));
    this.socket.on('move player', this.onMovePlayer.bind(this));
    this.socket.on('remove player', this.onRemovePlayer.bind(this));
    this.socket.on('shot', this.onShot.bind(this));
    this.socket.on('kill', this.onKill.bind(this));
    return this;
  }

  // Socket connected
  onSocketConnected() {
    console.log('Connected to socket server');
    // Reset gamers on reconnect
    Object.keys(this.gamers).forEach((gamerId) => {
      const gamerObj = this.gamers[gamerId];
      gamerObj.player.kill();
    });
    this.gamers = {};

    // Send local player data to the game server
    this.socket.emit('new player', { x: this.player.x, y: this.player.y, angle: this.player.angle, name });
  }

  // Socket disconnected
  onSocketDisconnect() {
    console.log('Disconnected from socket server');
  }

  // New player
  onNewPlayer(data) {
    console.log('New player connected:', data.id);

    // Avoid possible duplicate players
    const duplicate = this.gamerById(data.id, true);
    if (duplicate) {
      console.log('Duplicate player!');
      return;
    }
    // Add new player to the remote players array
    const gamer = new RemotePlayer(data.id, this.game, this.player, data.x, data.y, data.name, 'blue');
    this.gamers[data.id] = gamer;
    this.playerGroup.add(gamer.player);
  }

  // Move player
  onMovePlayer(data) {
    const movePlayer = this.gamerById(data.id);
    // Player not found
    if (!movePlayer) {
      return;
    }
    // Update player position
    movePlayer.player.x = data.x;
    movePlayer.player.y = data.y;
    movePlayer.player.angle = data.angle;
  }

  // Shot
  onShot(data) {
    const gamerObj = this.gamerById(data.id);
    // Player not found
    if (!gamerObj) {
      return;
    }
    gamerObj.weapon.fire();
  }

  // Remove player
  onRemovePlayer(data) {
    const removePlayer = this.gamerById(data.id);
    // Player not found
    if (!removePlayer) {
      return;
    }
    removePlayer.player.kill();
    // Remove player from array
    delete this.gamers[data.id];
  }

  onKill(data) {
    const removePlayer = this.gamerById(data.id);
    // Player not found
    if (!removePlayer) {
      console.log('not');
      return;
    }

    removePlayer.player.kill();
    console.log(removePlayer);
    // Remove player from array
    delete this.gamers[data.id];
  }

  // Find player by ID
  gamerById(id, silence = false) {
    const gamerObj = this.gamers[id];
    if (gamerObj) {
      return gamerObj;
    }
    if (!silence) {
      console.log('Player not found: ', id);
    }
    return false;
  }
}
