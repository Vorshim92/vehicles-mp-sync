/**
 * @noSelfInFile
 *
 * NOTE: Use this at the top of your TypeScript files. This prevents functions & methods
 *       from prepending a 'self' reference, which is usually not necessary and complicates
 *       rendered Lua code.
 */

import {
  BaseVehicle,
  IsoGameCharacter,
  IsoPlayer,
  KahluaTable,
  getCell,
  getSpecificPlayer,
  sendServerCommand
} from '@asledgehammer/pipewrench';

export interface VehicleUpdateArgs {
  vehicleId: number;
  x: number;
  y: number;
  z: number;
}

export const isDriver = (player: IsoPlayer) => {
  const vehicle: BaseVehicle = player.getVehicle();
  if (vehicle) {
    return vehicle.getDriver() === player;
  } else {
    return false;
  }
};

export const getVehiclePassengers = (vehicle: BaseVehicle) => {
  const passengers: IsoGameCharacter[] = [];
  for (let i = 0; i < vehicle.getMaxPassengers(); i++) {
    const passenger = vehicle.getCharacter(i);
    if (passenger) {
      passengers.push(passenger);
    }
  }
  return passengers;
};

export const getPlayerVehicle = () => {
  const player = getSpecificPlayer(0);
  if (player) {
    return player.getVehicle();
  } else return null;
};

export const getVehicleById = (id: number): BaseVehicle | null => {
  const vehicles = getCell().getVehicles();
  for (let i = 0; i < vehicles.size(); i++) {
    const vehicle = vehicles.get(i);
    if (vehicle.getId() === id) {
      return vehicle;
    }
  }
  return null; // Restituisce undefined se non viene trovato alcun veicolo con l'ID specificato
};

export const sendClientCommand = (
  player: IsoPlayer,
  module: string,
  command: string,
  args: KahluaTable
) => {
  sendServerCommand(player, module, command, args);
};

// export const getPlayersByCell = () => {
//   const players = getCell().getRemoteSurvivorList();
//   return players;
// };
