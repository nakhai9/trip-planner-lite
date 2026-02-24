const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api` || "";

export const API_URLS = {
  upload: API_BASE_URL + "/upload",
  plan: API_BASE_URL + "/plan",
  provinces: API_BASE_URL + "/provinces",
  svgVectorMap: API_BASE_URL + "/svg-vector-map",
};
