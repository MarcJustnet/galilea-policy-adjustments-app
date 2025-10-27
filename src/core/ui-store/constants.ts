import { Any, Orders } from "../types";

export const defaultOrder = <T extends { id: number } | Any>() => [['id', 'ASC']] as Orders<T>
