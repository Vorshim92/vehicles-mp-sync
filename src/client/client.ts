/**
 * @noSelfInFile
 *
 * NOTE: Use this at the top of your TypeScript files. This prevents functions & methods
 *       from prepending a 'self' reference, which is usually not necessary and complicates
 *       rendered Lua code.
 */
import {
  IsoPlayer,
  getGameTime,
  getPlayer,
  BaseVehicle,
  getVehicleById,
  getOnlinePlayers,
  getSpecificPlayer
} from '@asledgehammer/pipewrench';
import * as Events from '@asledgehammer/pipewrench-events';
import {
  VehicleUpdateArgs,
  getPlayerVehicle,
  getVehiclePassengers,
  isDriver,
  sendClientCommand
} from '../shared/utils';

print('VehiclesSyncMP: Starting client...');
const updateInterval = 0.1;
let lastUpdateTime = 0;

const updateVehiclePosition = () => {
  const players = getOnlinePlayers();
  // const player: IsoPlayer = getPlayer();
  const player = getSpecificPlayer(0);
  const vehicle = getPlayerVehicle();
  if (vehicle) {
    const vehicleId = vehicle.getId();
    const [x, y, z] = [vehicle.getX(), vehicle.getY(), vehicle.getZ()];
    const passengers = getVehiclePassengers(vehicle);
    if (passengers.length > 0) {
      for (const passenger of passengers) {
        if (passenger !== player) {
          const isoPassenger = passenger as unknown as IsoPlayer;
          sendClientCommand(isoPassenger, 'vehiclesync', 'vehicleUpdate', {
            vehicleId,
            x,
            y,
            z
          });
          print(
            'Sent vehicle update for passenger: ' +
              passenger.getName() +
              vehicleId +
              ', ' +
              x +
              ', ' +
              y +
              ', ' +
              z
          );
        }
      }
    }

    for (let i = 0; i < players.size(); i++) {
      const otherplayer = players.get(i);
      if (otherplayer !== player && isDriver(otherplayer)) {
        sendClientCommand(otherplayer, 'vehiclesync', 'vehicleUpdate', {
          vehicleId,
          x,
          y,
          z
        });
        print(
          'Sent vehicle update for driver: ' +
            otherplayer.getName() +
            vehicleId +
            ', ' +
            x +
            ', ' +
            y +
            ', ' +
            z
        );
      }
    }
  }
};

const receiveVehicleUpdate = (
  module: string,
  command: string,
  args: VehicleUpdateArgs
) => {
  if (module === 'vehiclesync' && command === 'vehicleUpdate') {
    const { vehicleId, x, y, z } = args;
    const vehicle: BaseVehicle = getVehicleById(vehicleId);
    if (vehicle) {
      vehicle.setX(x);
      vehicle.setY(y);
      vehicle.setZ(z);
    }

    print(
      'Received vehicle update from server: ' +
        vehicleId +
        ', ' +
        x +
        ', ' +
        y +
        ', ' +
        z
    );
  }
};

// EVENTI CLIENT
Events.onTick.addListener(() => {
  const currentTime = getGameTime().getTimeOfDay();
  if (currentTime - lastUpdateTime > updateInterval) {
    if (isDriver(getPlayer())) {
      print('Player is driving a vehicle...');
      updateVehiclePosition();
    }
    lastUpdateTime = currentTime;
  }
});

Events.onServerCommand.addListener(
  (module: string, command: string, args: VehicleUpdateArgs) => {
    if (module === 'vehiclesync' && command === 'vehicleUpdate') {
      receiveVehicleUpdate(module, command, args as VehicleUpdateArgs);
    }
  }
);
