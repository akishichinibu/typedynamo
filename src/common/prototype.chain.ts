export function findOnPrototypeChain(From: Object, Until: Object) {
  let cur: any = From;
  const protos = [];

  while (cur !== Object.getPrototypeOf(Until)) {
    protos.push(cur);
    cur = Object.getPrototypeOf(cur);
  }

  return protos;
}
