/// <reference path="Grammar" />

module AstVisitor {
  export class Visitor {
    private holder: {
      module: string
    } = {
      module: null
    };

    public Program(program: Grammar.Program) {
      if (program.type === "Program") {
        var output: Array<string> = [];
        var stmtLength: number = program.body.length;
        for (var i: number = 0; i < stmtLength; i++) {
          switch(program.body[i].type) {
            case "ModuleStmt":
              output.push(this.Module(program[i]));
              continue;
            case "Comment":
              output.push(this.Comment(program[i]));
          }
        }
      }
    }

    private Module(mod: Grammar.ModuleStmt): string {
      return Codegen.Module(mod.name);
    }

    private Comment(comment: Grammar.Comment): string {
      return Codegen.Comment(comment.text);
    }
  }

  export class Codegen {
    static Module(name: string): string {
      return "^FX:MODULE[" + name + "]";
    }

    static Comment(text: string): string {
      return "^FX" + text;
    }
  }
}