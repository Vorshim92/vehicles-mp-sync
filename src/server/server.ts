import { IsoPlayer } from '@asledgehammer/pipewrench';
import { VehicleUpdateArgs } from '../shared/utils';
import * as Events from '@asledgehammer/pipewrench-events';

print('VehiclesSyncMP: Starting server...');
const vehicles: Record<number, { x: number; y: number; z: number }> = {};
const receiveVehicleUpdate = (
  module: string,
  command: string,
  args: VehicleUpdateArgs
) => {
  if (module === 'vehiclesync' && command === 'vehicleUpdate') {
    const { vehicleId, x, y, z } = args;
    vehicles[vehicleId] = { x, y, z };
    print(
      'Received vehicle update from client: ' +
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

Events.onClientCommand.addListener(
  (
    module: string,
    command: string,
    player: IsoPlayer,
    args: VehicleUpdateArgs
  ) => {
    if (module === 'vehiclesync' && command === 'vehicleUpdate') {
      receiveVehicleUpdate(module, command, args as VehicleUpdateArgs);
    }
  }
);
