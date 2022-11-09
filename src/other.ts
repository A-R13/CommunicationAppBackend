import { setData, storedData } from './dataStore';

/**
 * <description: Resets the dataStore to its intial state. 'Clearing' away any additional added objects. >
 * @param {} - None
 *
 * @returns {} - None
 */

export function clearV1 () {
  const clearedData: storedData = {
    users: [],
    channels: [],
    dms: [],
  };
  setData(clearedData);

  return {};
}
