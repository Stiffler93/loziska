
export class Product {

  columnDefs: object[] = [];
  gridData: object[] = undefined;
  subproducts: Product[] = undefined;
  numData: number = 0;

  constructor(public name: string, public file: string, public icon: string, public text: string, public parameters: string[] = []) {
  }
}
