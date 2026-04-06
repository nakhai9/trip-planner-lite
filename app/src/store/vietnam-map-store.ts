import { create } from "zustand";
import { OLD_VIETNAM_MAP } from "../data/old-vietnam-map";
import { NEW_VIETNAM_MAP } from "../data/new-vietnam-map";
import { LocationInfo } from "@/types/common";

type VietnamMapStore = {
  isNewMap: boolean;
  loading: boolean;
  map: any;
  currentMap: any;
  // visited locations
  selectedLocations: LocationInfo[];
  selectedLocationsToShare: LocationInfo[];
  switchToMap: () => void;
  updateSelectedLocations: (location: LocationInfo) => void;
  updateSelectedLocationsToShare: (location: LocationInfo) => void;
  resetMap: () => void;
  resetSelectedLocations: () => void;
  resetSelectedLocationsToShare: () => void;
};

export const useVietnamMapStore = create<VietnamMapStore>((set) => ({
  isNewMap: true,
  loading: false,
  map: {
    old: {
      data: OLD_VIETNAM_MAP,
      count: OLD_VIETNAM_MAP.length,
    },
    new: {
      data: NEW_VIETNAM_MAP,
      count: NEW_VIETNAM_MAP.length,
    },
  },
  currentMap: NEW_VIETNAM_MAP,
  selectedLocations: [],
  selectedLocationsToShare: [],
  switchToMap: () =>
    set((state) => ({
      loading: true,
      isNewMap: !state.isNewMap,
      currentMap: state.isNewMap ? state.map.old.data : state.map.new.data,
    })),
  updateSelectedLocations: (location: LocationInfo) =>
    set((state) => {
      const existingLoc = state.selectedLocations.find(
        (x) => x.codeName === location.codeName,
      );

      if (!existingLoc) {
        return {
          selectedLocations: [...state.selectedLocations, location],
        };
      }

      if (existingLoc || location.status === "NOT_VISITED") {
        return {
          selectedLocations: [
            ...state.selectedLocations.filter(
              (x) => x.codeName !== location.codeName,
            ),
          ],
        };
      }

      return {
        selectedLocations: [...state.selectedLocations],
      };
    }),
  resetMap: () =>
    set(() => ({
      isNewMap: false,
      currentMap: NEW_VIETNAM_MAP,
      selectedLocations: [],
      // selectedLocationsToShare: [],
    })),
  updateSelectedLocationsToShare: (location: LocationInfo) =>
    set((state) => {
      const existingLoc = state.selectedLocationsToShare.find(
        (x) => x.codeName === location.codeName,
      );

      if (!existingLoc) {
        return {
          selectedLocationsToShare: [
            ...state.selectedLocationsToShare,
            location,
          ],
        };
      }

      if (existingLoc || location.status === "NOT_VISITED") {
        return {
          selectedLocationsToShare: [
            ...state.selectedLocationsToShare.filter(
              (x) => x.codeName !== location.codeName,
            ),
          ],
        };
      }

      return {
        selectedLocationsToShare: [...state.selectedLocationsToShare],
      };
    }),
  resetSelectedLocations: () =>
    set(() => ({
      selectedLocations: [],
    })),
  resetSelectedLocationsToShare: () =>
    set(() => ({
      selectedLocationsToShare: [],
    })),
}));
