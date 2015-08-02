{
  /**
   * Capybara compiler
   * Copyright 2015 - Marcelo Camargo <marcelocamargo@linuxmail.org>
   * Licensed under GNU GPL v3.
   */
  var Capybara = {
    declaration: {
      declare: function(key, value, mutable, type) {
        Persistent.declarations[key] = {
          value: value,
          mutable: mutable,
          type: type
        };
      },
      undeclare: function(key) {
        delete Persistent.declarations[key];
      },
      exists: function(key) {
        return key in Persistent.declarations;
      },
      isMutable: function(key) {
        return Persistent.declarations[key].mutable ===  true;
      },
      getType: function(key) {
        return Persistent.declarations[key].kind;
      },
      get: function(key) {
        return Persistent.declarations[key];
      }
    },
    importation: {
      insert: function(module, useSubmodules, submodules) {
        Persistent.imports[module] = {
          useSubmodules: useSubmodules,
          submodules: submodules
        };
      },
      isImported: function(module) {
        return module.name in Persistent.imports;
      }
    },
    type: {
      toInteger: function(digits) {
        return parseInt(digits.join(""));
      },
      toString: function(chars) {
        return chars.join("").toString();
      },
      check: function(expect, receive) {
        if (expect.indexOf(receive) !== -1 || expect.indexOf("Any") !== -1) {
          return;
        }

        throw new SyntaxError("Type [" + receive + "] is not assignable to " +
          " declaration of type [" + expect + "].");
      }
    },
    list: {
      build: function(x, xs, n) {
        return [x].concat(Capybara.list.take(xs, n));
      },
      take: function(xs, n) {
        var result = new Array(xs.length);

        for (var i = 0, len = xs.length; i < len; i++) {
          result[i] = xs[i][n];
        }

        return result;
      },
      takeOpt: function(opt, index) {
        return opt ? opt[index] : null;
      },
      opt: function(value) {
        return value !== null ? value : [];
      },
      stringify: function(x, xs) {
        return [x].concat(xs).join("");
      }
    }
  };

  var Persistent = {
    moduleName: undefined,
    declarations: {},
    imports: {},
  };
}

Start
  = _ code:Program {
    return code;
  }

Program
  = body:Body? {
    return {
      type: "Program",
      body: Capybara.list.opt(body)
    };
  }

Body
  = x:Stmt xs:(_ Stmt)* {
    return Capybara.list.build(x, xs, 1);
  }

Stmt "statement"
  = ModuleStmt
  / DeclareStmt
  / ImportStmt
  / DumpStmt
  / ExportStmt
  / SubModuleStmt
  / Comment
  / DocComment

/* Statements */
ModuleStmt
  = ModuleToken _ name:Ident _ StmtTerminator {
    if (!Persistent.moduleName) {
      Persistent.moduleName = name.name;
    } else {
      throw new SyntaxError("Module is immutable and cannot be redefined to " +
      "\"" + name.name + "\".");
    }

    return {
      type: "ModuleStmt",
      name: name.name
    }
  }

DeclareStmt
  = DeclareToken _ x:DeclareBody xs:DeclareRest* _ StmtTerminator {
    return {
      type: "DeclareStmt",
      declarations: [x].concat(xs)
    };
  }

ImportStmt
  = ImportToken _ list:ImportList _ StmtTerminator {
    return {
      type: "ImportStmt",
      imports: list
    };
  }

DumpStmt
  = DumpToken _ x:Ident xs:IdentAppender* _ StmtTerminator {
    var dumpStack = [x].concat(xs).map(function(d) {
      return d.name;
    });

    for (var i = 0, len = dumpStack.length; i < len; i++) {
      if (Capybara.declaration.exists(dumpStack[i])) {
        Capybara.declaration.undeclare(dumpStack[i]);
      } else {
        throw new SyntaxError("Cannot undeclare a non-declared value: " +
          "\"" + dumpStack[i] + "\"");
      }
    }

    return {
      type: "DumpStmt",
      declarations: dumpStack
    };
  }

ExportStmt
  = ExportToken _ x:Ident xs:IdentAppender* _ StmtTerminator {
    return {
      type: "ExportStmt",
      blocks: [x].concat(xs).map(function(m) { return m.name })
    };
  }

SubModuleStmt
  = SubModuleToken _ name:Ident _ x:SubModuleDecl xs:SubModuleDeclRest* _ StmtTerminator {
    return {
      type: "SubModuleStmt",
      name: name.name,
      declarations: [x].concat(xs)
    };
  }

SubModuleDecl
  = name:Ident typeDef:SubModuleTypeDef? translation:TranslatesTo {
    return {
      using: name.name,
      translation: translation,
      typeDef: typeDef
    };
  }

SubModuleDeclRest
  = Appender x:SubModuleDecl {
    return x;
  }

TranslatesTo
  = _ "+>" _ instruction:ZPLInstruction {
    return {
      type: "TranslatesDecl",
      instruction: instruction
    };
  }

SubModuleTypeDef
  = _ TypeDefinitionToken _ "[" _ x:SubModuleParam xs:SubModuleRestParam* _ "]" _ {
    return {
      type: "SubModuleTypeDef",
      param: [x].concat(xs)
    };
  }

SubModuleParam
  = name:Ident _ SubTypeDefinitionToken _ kind:DependentPrimitiveType union:DependentUnionTypes* {
    return {
      type: "SubModuleParam",
      name: name,
      kind: [kind].concat(union)
    };
  }

SubModuleRestParam
  = Appender param:SubModuleParam {
    return param;
  }

/* Dependent type system for submodules */
DependentPrimitiveType
  = DependentInteger
  / DependentString
  / TypeBoolToken {
    return {
      type: "DependentPrimitiveType",
      kind: "Bool"
    };
  }
  / TypeAnyToken {
    return {
      type: "DependentPrimitiveType",
      kind: "Any"
    };
  }

DependentInteger
  = TypeIntegerToken

DependentString
  = TypeStringToken

DependentUnionTypes
  = _ "|" _ t:DependentPrimitiveType {
    return t;
  }

/* ZPL bindings */

ZPLInstruction
  = signal:("~" / "^") x:ZPLValidStart xs:ZPLValidRest*  {
    return {
      type: "ZPLInstruction",
      signal: signal,
      instruction: [x].concat(xs).join("")
    };
  }

ZPLValidStart
  = [a-zA-Z]
  / Placeholder

ZPLValidRest
  = [a-zA-Z0-9_]
  / Placeholder

Placeholder
  = "{" i:Ident "}" {
    return "{PLACEHOLDER:[" + i.name + "]}";
  }

// TODO: Allow placeholders in ZPL declarations: ^AD{B}{X}{Y}.

IdentAppender
  = Appender x:Ident {
    return x;
  }

Comment "comment"
  = "%" source:ValidCommentChar* {
    return {
      type: "Comment",
      text: Capybara.type.toString(source)
    };
  }

DocComment "documentation comment"
  = "(*" source:ValidDocCommentChar* (("*)" _) / EOF) {
    return {
      type: "DocComment",
      text: Capybara.type.toString(source).trim()
    };
  }

ValidDocCommentChar
  = !"*)" chr:. {
  return chr;
}

ImportList
  = x:ImportBody xs:ImportRest* {
    return [x].concat(xs);
  }

ImportRest
  = Appender x:ImportBody {
    return x;
  }

ImportBody
  = module:Ident submodules:ImportSubList? {
    var hasSubmodules = !!submodules;

    if (Capybara.importation.isImported(module)) {
      throw new SyntaxError("Module already imported: \"" + module.name + "\"");
    }

    Capybara.importation.insert(module.name, hasSubmodules, submodules);

    return {
      type: "Importation",
      module: module,
      submodular: hasSubmodules,
      submodules: submodules
    };
  }

ImportSubList
  = _ "{" _ x:SubModuleValidName? xs:SubModuleValidNameRest* _ "}" {
    return x
      ? [x].concat(xs).map(function(m) { return m.name })
      : [];
  }

SubModuleValidName
  = Ident
  / matches:[\!\@\?\#\%\&\*\+\-\^\~\/\<\>\$\'\"]+ {
    return {
      name: matches.join("")
    };
  }

SubModuleValidNameRest
  = Appender x:SubModuleValidName {
    return x;
  }

DeclareBody
  = mut:(MutableToken _)? variable:Ident type:TypeDefinition? expr:DeclareExpr? {
    var isMutable = !!mut,
        userTyped = !!type,
        hasExpr   = !!expr,
        kind      = userTyped
          ? type
          : hasExpr ? [expr.kind] : ["Any"];

    if (Capybara.declaration.exists(variable.name)) {
      if (!hasExpr) {
        throw new SyntaxError("Cannot redeclare \"" + variable.name + "\".");
      }

      if (userTyped) {
        throw new SyntaxError("Cannot redefined type of \"" + variable.name +
          "\"");
      }

      if (Capybara.declaration.isMutable(variable.name)) {
        var expect = Capybara.declaration.get(variable.name).type;
        var receive = expr.kind;

        Capybara.type.check(expect, receive);
        Capybara.declaration.declare(variable.name, expr, true, expect);
      } else {
        throw new SyntaxError("Declaration \"" + variable.name + "\" is " +
        "immutable.");
      }
    } else {
      if (hasExpr) {
        Capybara.type.check(kind, hasExpr ? expr.kind : "Java");
      }
      Capybara.declaration.declare(variable.name, expr, isMutable, kind);
    }

    return {
      type: "Declaration",
      kind: kind,
      key: variable.name,
      value: expr,
      mutable: isMutable
    };
  }

DeclareExpr
  = _ AsToken _ expr:Expr {
    return expr;
  }

DeclareRest
  = Appender x:DeclareBody {
    return x;
  }

StmtTerminator "statement terminator ([.] or [;])"
  = ("." / ";") _

/* Expressions */
Expr "expression"
  = Literal

Literal
  = CapybaraString
  / CapybaraInteger
  / CapybaraBool

CapybaraString
  = "{:" str:ValidStringChar* ":}" {
    return {
      type: "Literal",
      kind: "String",
      value: Capybara.type.toString(str)
    };
  }

CapybaraInteger
  = i:[0-9]+ {
    return {
      type: "Literal",
      kind: "Integer",
      value: parseInt(i.join(""))
    };
  }

CapybaraBool
  = YesToken {
    return {
      type: "Literal",
      kind: "Bool",
      value: true
    };
  }
  / NoToken {
    return {
      type: "Literal",
      kind: "Bool",
      value: false
    };
  }

Appender
  = _ ( "," / ";" ) _

/* Primitive type system */
TypeDefinition
  = _ TypeDefinitionToken _ primary:PrimitiveType union:UnionTypes* {
    return [primary].concat(union);
  }

PrimitiveType
  = TypeStringToken {
    return "String";
  }
  / TypeIntegerToken {
    return "Integer";
  }
  / TypeBoolToken {
    return "Bool";
  }
  / TypeAnyToken {
    return "Any";
  }

UnionTypes
  = _ "|" _ t:PrimitiveType {
    return t;
  }

/* Tokens */
KeyWord "reserved word"
  = ModuleToken
  / DeclareToken
  / AsToken
  / YesToken
  / NoToken
  / MutableToken
  / ImportToken
  / DumpToken
  / ExportToken
  / TypeStringToken
  / TypeIntegerToken
  / TypeBoolToken
  / TypeAnyToken
  / SubModuleToken

ModuleToken
  = "Module" !IdentRest

DeclareToken
  = "Declare" !IdentRest

AsToken
  = "As" !IdentRest

YesToken
  = "Yes" !IdentRest

NoToken
  = "No" !IdentRest

MutableToken
  = "Mutable" !IdentRest

ImportToken
  = "Import" !IdentRest

DumpToken
  = "Dump" !IdentRest

ExportToken
  = "Export" !IdentRest

TypeStringToken
  = "String" !IdentRest

TypeIntegerToken
  = "Integer" !IdentRest

TypeBoolToken
  = "Bool" !IdentRest

TypeAnyToken
  = "Any" !IdentRest

SubModuleToken
  = "SubModule" !IdentRest

TypeDefinitionToken
  = "::"

SubTypeDefinitionToken
  = ":"

/* Identifier */
Ident "identifier"
  = !KeyWord name:IdentName _ {
    return name;
  }

IdentName
  = x:IdentStart xs:IdentRest* {
    return {
      type: "Ident",
      name: Capybara.list.stringify(x, xs)
    };
  }

IdentStart
  = [a-z_]i

IdentRest
  = [a-z0-9_]i

ValidStringChar
  = [a-z0-9_\-\/\^\~\!\@\#\$\%\&\*\(\)\+\{\}\?\,\.\<\>\t\s ]i

ValidCommentChar
  = !NewLine all:(.) {
    return all;
  }

/* Skipped */
_
  = (WhiteSpace / NewLine)*

WhiteSpace "whitespace"
  = "\t"
  / "\v"
  / "\f"
  / " "

NewLine "newline"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"

EOF
  = !.
