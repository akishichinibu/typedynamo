import { Expression } from "../entity.expression";
import { unaryOperators, binaryOperators, ternaryOperators } from "../operators";
import { RawExpression } from "../raw.expression";


export abstract class CommandBuilder<TEntity, TCommand> {
  protected readonly expressionTable: Map<string, string>;
  protected readonly valueTable: Map<string, any>;

  constructor() {
    this.expressionTable = new Map();
    this.valueTable = new Map();
  }

  protected addExpression(e: string): string {
    const queryAttr = `#FIELD${this.expressionTable.size}_${e.toUpperCase()}`;
    this.expressionTable.set(queryAttr, e);
    return queryAttr;
  }

  protected addValue(v: any): string {
    const valueAttr = `:VALUE_${this.valueTable.size}`;
    this.valueTable.set(valueAttr, v);
    return valueAttr;
  }

  protected isUnaryOperator(key: string) {
    return new Set(unaryOperators).has(key);
  }

  protected isBinaryOperator(key: string) {
    return new Set(binaryOperators).has(key);
  }

  protected isTernaryOperator(key: string) {
    return new Set(ternaryOperators).has(key);
  }

  protected rawExpressionToString(e: RawExpression): string {
    return Object.entries(e)
      .map(([k, v]) => {
        if (this.isUnaryOperator(k)) {
          return `${k} ${v}`;
        }

        if (this.isBinaryOperator(k)) {
          const [vl, vr] = v;
          return `${vl} ${k} ${vr}`;
        }

        if (this.isTernaryOperator(k)) {
          const [vm, [vl, vr]] = v;
          return `${vm} ${k} ${vl} AND ${vr}`;
        }

        return (v as any[]).map((r) => this.rawExpressionToString(r)).join(` ${k} `);
      })
      .map((r) => `(${r})`)
      .join(' ');
  }

  protected resolveToRawExpression(target: Expression<TEntity>): RawExpression {
    console.log('@#@#@', target);

    const entities = Object
      .entries(target)
      .map(([k, v]) => {
        console.log('@@@', k, v);

        if (this.isUnaryOperator(k)) {
          return [k, this.addExpression(v)];
        }

        if (this.isBinaryOperator(k)) {
          const [vl, vr] = Object.entries(v)[0];
          return [k, [this.addExpression(vl), this.addValue(vr)]];
        }

        if (this.isTernaryOperator(k)) {
          const [vm, [vl, vr]] = Object.entries(v)[0] as any;
          return [k, [this.addExpression(vm), this.addValue(vl), this.addValue(vr)]];
        }

        return [k, (v as any[]).map((r) => this.resolveToRawExpression(r))];
      });

    return Object.fromEntries(entities);
  }

  abstract toCommand(): TCommand;

}
