
export const isMobile = (): boolean => {
  return window.matchMedia("only screen and (max-width: 600px)").matches;
}