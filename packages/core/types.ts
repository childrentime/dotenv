export interface Options {
  override: boolean;
}

type BuildArr<
  L extends number,
  Ele = unknown,
  Arr extends unknown[] = []
> = Arr["length"] extends L ? Arr : BuildArr<L, Ele, [...Arr, Ele]>;

type BuildToMax<
  Max extends number,
  Ele = unknown,
  Arr extends unknown[] = []
> = Arr["length"] extends Max ? Arr : Arr | BuildToMax<Max, Ele, [...Arr, Ele]>;

export type ArrRange<
  Min extends number,
  Max extends number,
  Ele = unknown
> = BuildToMax<Max, Ele, BuildArr<Min, Ele>>;
