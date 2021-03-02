type State = {
  // The real type of state is private
  $: unknown;
};

type Rule = {
  description: string;
  match($: State): State;
};

type Grammar = Rule | string | RegExp;

export declare const Node: (grammar: Grammar, builder?: (stack: Array<any>) => any) => Grammar;
export declare const Any: (...grammars: Array<Grammar>) => Grammar;
export declare const All: (...grammars: Array<Grammar>) => Grammar;
export declare const Optional: (grammar: Grammar) => Grammar;
export declare const Plus: (grammar: Grammar) => Grammar;
export declare const Star: (grammar: Grammar) => Grammar;
export declare const Debug: (grammar: Grammar) => Grammar;
export declare const Ignore: (grammar: Grammar) => Grammar;
export declare const IgnoreBetween: (ignore: Grammar, grammar: Grammar) => Grammar;
export declare const Y: <T extends Grammar>(proc: (rec: T) => T) => T;

export declare class Parser {
  constructor(grammar: Grammar);

  parse(text: string, idx?: number, partial?: boolean): any;
}
