declare module "@svg-maps/colombia" {
  interface SvgMapLocation {
    id: string;
    name: string;
    path: string;
  }

  interface SvgMap {
    label: string;
    viewBox: string;
    locations: SvgMapLocation[];
  }

  const colombia: SvgMap;
  export default colombia;
}
