import { getData, setData, storedData, workspaceStatsBase } from './dataStore';

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
    workspaceStats: null
  };
  setData(clearedData);

  getData().workspaceStats = workspaceStatsBase;

  return {};
}
