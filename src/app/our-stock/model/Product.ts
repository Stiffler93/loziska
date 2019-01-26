
export class Product {

  columnDefs: object[] = [];
  gridData: object[] = undefined;
  subproducts: Product[] = undefined;

  constructor(public name: string, public file: string, public icon: string, public text: string, public parameters: string[] = []) {
  }
}
