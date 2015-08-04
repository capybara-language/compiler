module Grammar {
  export interface Node {
    type: string;
  }

  export type Stmt = ModuleStmt
                   | DeclareStmt
                   | ImportStmt
                   | DumpStmt
                   | ExportStmt
                   | SubModuleStmt
                   | Comment;

  export type TypeDefinition = Array<PrimitiveType>;

  export type PrimitiveType = string;

  export type Expr = Literal;

  export interface Program extends Node {
    body: Array<Stmt>;
  }

  export interface ModuleStmt extends Node {
    name: string;
  }

  export interface DeclareStmt extends Node {
    declarations: Array<Declaration>;
  }

  export interface ImportStmt extends Node {
    imports: Array<Importation>;
  }

  export interface DumpStmt extends Node {
    declarations: Array<string>;
  }

  export interface ExportStmt extends Node {
    blocks: Array<string>;
  }

  export interface SubModuleStmt extends Node {
    name: string;
    declarations: Array<SubModule>;
  }

  export interface Comment extends Node {
    text: string;
  }

  export interface DocComment extends Node {
    text: string;
  }

  export interface SubModule extends Node {
    using: string;
    translation: TranslatesDecl;
  }

  export interface TranslatesDecl extends Node {
    instruction: ZPLInstruction;
  }

  export interface ZPLInstruction extends Node {
    signal: string;
    instruction: string;
  }

  export interface Declaration extends Node {
    kind: TypeDefinition;
    key: string;
    value: Expr;
    mutable: boolean;
  }

  export interface Literal extends Node {
    kind: PrimitiveType;
    value: string | number | boolean;
  }

  export interface Importation {
    module: string;
    submodular: boolean;
    submodules: Array<string>;
  }
}